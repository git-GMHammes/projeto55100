# ROADMAP — podman compose: diagnóstico e solução com podman-compose nativo

**Data:** 2026-06-10
**Ambiente:** Windows 11 Pro — WSL 2 — Podman Desktop v1.27.2 — Podman v5.8.2 — Python 3.14.2

---

## 1. Contexto e Sintoma

Ao tentar subir os containers do projeto com o comando padrão:

```powershell
podman compose up -d --build
```

O seguinte erro era exibido:

```
>>>> Executing external compose provider
"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker-compose.exe".
Please see podman-compose(1) for how to disable this message. <<<<

unable to get image 'projeto55100-php': error during connect:
Get "http://%2F%2F.%2Fpipe%2Fpodman-machine-default/v1.48/images/projeto55100-php/json":
open //./pipe/podman-machine-default: The system cannot find the file specified.

Error: executing C:\Program Files\Docker\Docker\resources\bin\docker-compose.exe
up -d --build: exit status 1
```

---

## 2. Anatomia do Problema

Para entender a causa raiz, é necessário compreender como o `podman compose`
funciona no Windows.

### 2.1 — Como o `podman compose` funciona no Windows

O comando `podman compose` **não tem implementação própria**. Ele procura um
provider externo para executar o compose. A ordem de busca é:

1. `podman-compose` (executável nativo Python) — se estiver no PATH.
2. `docker-compose` — se estiver disponível.

No Windows com Docker Desktop instalado, o `podman compose` encontra e delega
para `C:\Program Files\Docker\Docker\resources\bin\docker-compose.exe`.

### 2.2 — Como o `docker-compose.exe` se conecta ao Podman

O `docker-compose.exe` é um cliente da **Docker API**. Para conectar ao
Podman, ele precisa de um **Windows Named Pipe** que exponha a API Docker.

O processo responsável por criar esse pipe é o `win-sshproxy.exe`, que:

1. Lê a configuração da máquina Podman.
2. Abre um túnel SSH até a VM WSL onde o Podman roda.
3. Cria o named pipe Windows: `\\.\pipe\podman-machine-default`.
4. Cria o pipe de compatibilidade Docker: `\\.\pipe\docker_engine`.
5. Encaminha requisições HTTP da Docker API pelo túnel para o socket Unix
   do Podman dentro do WSL.

### 2.3 — Sequência de falha

O `win-sshproxy.exe` falha com o seguinte ciclo:

```
win-sshproxy.exe inicia
    → tenta remover socket antigo:
      C:\Users\...\AppData\Local\Temp\podman\podman-machine-default-api.sock
    → FALHA: "The file cannot be accessed by the system."
    → encerra com exit code 0 (anômalo)
    → named pipes NÃO são criados
```

O socket `.sock` é um arquivo especial do tipo Unix socket, criado dentro do
sistema de arquivos WSL e mapeado para o Windows. Ele fica inacessível ao
Windows porque o processo que o criou (a VM WSL) ainda mantém um lock sobre
o inode, mesmo após reinicializações — o arquivo existe no disco NTFS como
um reparse point, mas o sistema operacional bloqueia deleção via PowerShell
ou Explorer.

Consequência: sem os named pipes, o `docker-compose.exe` não consegue
conectar ao Podman, e o `podman compose` falha.

---

## 3. Diagnóstico Passo a Passo

### 3.1 — Verificar se a máquina Podman está rodando

```powershell
podman machine list
```

Output esperado quando a máquina está ativa:

```
NAME                     VM TYPE     CREATED       LAST UP            CPUS  MEMORY  DISK SIZE
podman-machine-default*  wsl         3 months ago  Currently running  6     2GiB    100GiB
```

> Se o status for `Currently starting` (loop infinito), consultar o ROADMAP
> `ROADMAP_correcao_podman.md` para resolver esse problema primeiro.

---

### 3.2 — Verificar se o named pipe existe

```powershell
Get-ChildItem "\\.\pipe\" | Where-Object { $_.Name -like "*podman*" }
```

- Se retornar resultado → o pipe existe, o problema é outro.
- Se retornar vazio → o pipe não foi criado pelo `win-sshproxy.exe`.

> Atenção: `Get-ChildItem` em named pipes é pouco confiável no PowerShell 5.
> Para confirmar, consultar o Event Log (próximo passo).

---

### 3.3 — Verificar o Event Log do Windows

```powershell
Get-WinEvent -LogName Application -MaxEvents 20 |
    Where-Object { $_.Message -like "*podman*" -or $_.Message -like "*sshproxy*" } |
    Select-Object -First 10 TimeCreated, Message |
    Format-List
```

Output indicando falha do `win-sshproxy.exe`:

```
TimeCreated : 10/06/2026 07:46:04
Message     : [error] podman-machine-default: Error occurred in execution group:
              remove C:/Users/.../AppData/Local/Temp/podman/podman-machine-default-api.sock:
              The file cannot be accessed by the system.

TimeCreated : 10/06/2026 07:46:04
Message     : [info ] podman-machine-default: Listening on: \\.\pipe\docker_engine

TimeCreated : 10/06/2026 07:46:04
Message     : [info ] podman-machine-default: Listening on: \\.\pipe\podman-machine-default
```

> Aparente contradição: os logs mostram "Listening on" e ao mesmo tempo mostram
> o erro. Isso ocorre porque os logs de "Listening on" são emitidos ANTES da
> tentativa de remoção do socket. O processo encerra logo em seguida — os pipes
> registrados nos logs não chegam a ser criados de fato.

---

### 3.4 — Verificar o socket travado

```powershell
Get-ChildItem "$env:TEMP\podman\"
```

Output indicando socket travado:

```
Mode     LastWriteTime         Length Name
----     -------------         ------ ----
-a---l   09/06/2026     16:23       0 podman-machine-default-api.sock
```

O atributo `l` na coluna `Mode` indica que é um link simbólico ou reparse
point — não é um arquivo convencional. O PowerShell e o Explorer não
conseguem deletá-lo.

---

### 3.5 — Confirmar que o `win-sshproxy.exe` não está em execução

```powershell
Get-Process | Where-Object { $_.Name -like "*sshproxy*" }
```

- Se retornar vazio → confirmado: o proxy não está rodando, os pipes não existem.
- Se retornar processo → o proxy está ativo; o problema é outro.

---

## 4. Tentativas que NÃO resolvem o problema

Estas abordagens foram testadas e descartadas para documentação:

### 4.1 — Reiniciar a máquina Podman sem limpar o socket

```powershell
podman machine stop podman-machine-default
podman machine start podman-machine-default
```

**Resultado:** o socket é recriado pela VM WSL ao iniciar, e o
`win-sshproxy.exe` volta a falhar pelo mesmo motivo.

### 4.2 — Remover o socket via PowerShell

```powershell
Remove-Item "$env:TEMP\podman\podman-machine-default-api.sock" -Force
```

**Resultado:**

```
Remove-Item : Não é possível remover o item ...: Não é possível o acesso ao arquivo pelo sistema.
```

O Windows não consegue deletar arquivos do tipo Unix socket.

### 4.3 — Definir DOCKER_HOST manualmente e tentar docker-compose.exe

```powershell
$env:DOCKER_HOST = "npipe:////./pipe/podman-machine-default"
podman compose up -d --build
```

**Resultado:** mesmo erro — o pipe simplesmente não existe no sistema.

### 4.4 — Remover o socket via WSL e reiniciar

```bash
wsl rm -f /mnt/c/Users/HabilidadeCom/AppData/Local/Temp/podman/podman-machine-default-api.sock
```

O socket é deletado com sucesso pelo WSL. Porém, ao reiniciar a máquina
Podman (`podman machine start`), a VM WSL recria o socket imediatamente
antes do `win-sshproxy.exe` ter chance de agir. O ciclo de falha se repete.

---

## 5. Causa Raiz Definitiva

O `win-sshproxy.exe` exige que o arquivo de socket NÃO exista antes de criar
o pipe. A VM WSL, porém, cria o socket como parte da sua inicialização — antes
que o `win-sshproxy.exe` seja acionado. Existe uma condição de corrida
(_race condition_) no processo de start da máquina Podman no Windows que
torna o `win-sshproxy.exe` cronicamente incapaz de criar os named pipes neste
ambiente.

**Conclusão:** o `docker-compose.exe` não consegue conectar ao Podman por uma
falha estrutural na camada de compatibilidade Docker API do Podman no Windows.
A solução definitiva é eliminar essa dependência.

---

## 6. Solução Definitiva — Instalar o `podman-compose` Nativo

O `podman-compose` é uma implementação Python do Docker Compose que se
comunica diretamente com o Podman via sua API nativa, **sem precisar do
named pipe Windows nem do `docker-compose.exe`**.

### 6.1 — Pré-requisito: verificar Python

```powershell
python --version
```

Output esperado:

```
Python 3.14.2
```

> Se Python não estiver instalado, baixar em https://www.python.org/downloads/
> e marcar a opção "Add Python to PATH" durante a instalação.

---

### 6.2 — Instalar o `podman-compose` via pip

```powershell
python -m pip install podman-compose
```

Output esperado:

```
Collecting podman-compose
  Downloading podman_compose-1.6.0-py3-none-any.whl (53 kB)
Collecting python-dotenv
Collecting pyyaml
Installing collected packages: pyyaml, python-dotenv, podman-compose
Successfully installed podman-compose-1.6.0 python-dotenv-1.2.2 pyyaml-6.0.3
```

> O pip pode exibir um aviso de que o executável foi instalado em uma pasta
> fora do PATH. Anote o caminho informado no aviso — será necessário no
> próximo passo.

---

### 6.3 — Localizar o executável instalado

O pip informa o caminho durante a instalação com o aviso:

```
WARNING: The script podman-compose.exe is installed in
'C:\Users\HabilidadeCom\AppData\Local\Python\pythoncore-3.14-64\Scripts'
which is not on PATH.
```

Anote esse caminho. Neste ambiente:

```
C:\Users\HabilidadeCom\AppData\Local\Python\pythoncore-3.14-64\Scripts\podman-compose.exe
```

---

### 6.4 — (Recomendado) Adicionar o Scripts ao PATH permanentemente

Para usar `podman-compose` diretamente sem precisar informar o caminho
completo, adicionar ao PATH do usuário:

```powershell
$scriptsPath = "C:\Users\HabilidadeCom\AppData\Local\Python\pythoncore-3.14-64\Scripts"
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")

if ($currentPath -notlike "*$scriptsPath*") {
    [System.Environment]::SetEnvironmentVariable(
        "Path",
        "$currentPath;$scriptsPath",
        "User"
    )
    Write-Host "PATH atualizado. Feche e reabra o terminal para efetivar."
} else {
    Write-Host "Caminho ja esta no PATH."
}
```

Após fechar e reabrir o terminal, `podman-compose` passa a estar disponível
globalmente.

---

### 6.5 — Verificar a instalação

```powershell
# Com o caminho completo (funciona sem reiniciar o terminal)
& "C:\Users\HabilidadeCom\AppData\Local\Python\pythoncore-3.14-64\Scripts\podman-compose.exe" --version

# Ou, após adicionar ao PATH e reabrir o terminal:
podman-compose --version
```

Output esperado:

```
podman-compose version 1.6.0
```

---

## 7. Uso — Subir os Containers do Projeto

Após a instalação, o comando para subir os containers muda. Há quatro formas
equivalentes:

### Forma 0 — Aplicar PATH na sessão atual e subir (sem fechar o terminal)

Use logo após a instalação, sem precisar fechar e reabrir o terminal:

```powershell
$env:PATH += ";C:\Users\HabilidadeCom\AppData\Local\Python\pythoncore-3.14-64\Scripts"
cd C:\laragon\www\php\habilidade\projeto55100
podman-compose up -d --build
```

> Nas próximas sessões, se o PATH já foi gravado permanentemente (passo 6.4),
> basta usar `podman-compose` diretamente (Forma 3).

### Forma 1 — Caminho completo (funciona sem PATH configurado)

```powershell
$scriptsPath = "C:\Users\HabilidadeCom\AppData\Local\Python\pythoncore-3.14-64\Scripts"
cd C:\laragon\www\php\habilidade\projeto55100
& "$scriptsPath\podman-compose.exe" up -d --build
```

### Forma 2 — Via módulo Python (funciona sem PATH configurado)

```powershell
cd C:\laragon\www\php\habilidade\projeto55100
python -m podman_compose up -d --build
```

### Forma 3 — Diretamente (requer Scripts no PATH e terminal reaberto)

```powershell
cd C:\laragon\www\php\habilidade\projeto55100
podman-compose up -d --build
```

---

## 8. Outros Comandos com `podman-compose`

Todos os comandos do Docker Compose têm equivalência direta:

```powershell
# Subir containers (sem rebuild das imagens)
podman-compose up -d

# Subir containers com rebuild forçado das imagens
podman-compose up -d --build

# Parar e remover containers (preserva volumes)
podman-compose down

# Parar e remover containers e volumes
podman-compose down -v

# Ver status dos containers
podman-compose ps

# Ver logs em tempo real de todos os servicos
podman-compose logs -f

# Ver logs de um servico especifico
podman-compose logs -f nginx
podman-compose logs -f php
podman-compose logs -f node

# Rebuild das imagens sem subir
podman-compose build

# Reiniciar um servico especifico
podman-compose restart nginx

# Executar comando dentro de um container
podman-compose exec php bash
podman-compose exec php php spark migrate

# Parar containers sem remover
podman-compose stop

# Iniciar containers parados
podman-compose start
```

---

## 9. Verificar se os Containers Subiram

Após o `podman-compose up -d --build`, verificar com:

```powershell
podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Output esperado para o projeto55100:

```
NAMES                         STATUS                     PORTS
codeigniter55100_mysql        Up X seconds (healthy)     0.0.0.0:55101->3306/tcp
codeigniter55100_php          Up X seconds               9000/tcp
codeigniter55100_adminer      Up X seconds               0.0.0.0:55102->8080/tcp
codeigniter55100_nginx        Up X seconds               0.0.0.0:55100->80/tcp
codeigniter55100_node         Up X seconds               3000/tcp
```

Todos os 5 containers devem estar com status `Up`.

---

## 10. Por que o `podman-compose` Nativo Funciona

| Aspecto                  | `docker-compose.exe` (falha)       | `podman-compose` nativo (funciona)       |
| ------------------------ | ---------------------------------- | ---------------------------------------- |
| Protocolo de comunicacao | Docker API via Windows Named Pipe  | API nativa do Podman via socket Unix/SSH |
| Dependencia              | `win-sshproxy.exe` + named pipe    | Nenhuma — SSH direto para a VM WSL       |
| Requisito no Windows     | `\\.\pipe\podman-machine-default`  | Nenhum pipe necessario                   |
| Sensibilidade ao socket  | Falha se socket antigo existir     | Ignora o estado do socket                |
| Compatibilidade          | Limitada ao subconjunto Docker API | Completa com recursos Podman             |

---

## 11. Situacoes que Podem Causar Problemas com `podman-compose`

### 11.1 — Containers com nome conflitante de execucao anterior

Se o `podman-compose up` falhar com mensagem como:

```
Error: creating container storage: the container name "codeigniter55100_mysql"
is already in use by <hash>.
```

E porque containers de uma execucao anterior ainda existem. Solucao:

```powershell
# Parar e remover os containers existentes
cd C:\laragon\www\php\habilidade\projeto55100
podman-compose down

# Tentar subir novamente
podman-compose up -d --build
```

Ou remover containers especificos:

```powershell
podman rm -f codeigniter55100_mysql
podman rm -f codeigniter55100_php
podman rm -f codeigniter55100_nginx
podman rm -f codeigniter55100_adminer
podman rm -f codeigniter55100_node
```

### 11.2 — Pod conflitante

O `podman-compose` cria um pod para agrupar os containers. Se o pod ja existir:

```powershell
# Listar pods
podman pod list

# Remover pod especifico (remove tambem os containers dentro dele)
podman pod rm -f <nome-do-pod>
```

### 11.3 — Maquina Podman parada

Se a maquina Podman nao estiver rodando:

```powershell
# Verificar status
podman machine list

# Iniciar se necessario
podman machine start podman-machine-default
```

---

## 12. Referencia Rapida — Fluxo Completo do Zero

Para um ambiente recem-configurado ou apos problemas, executar nesta ordem:

```powershell
# 1. Garantir que a maquina Podman esta rodando
podman machine list
# Se necessario: podman machine start podman-machine-default

# 2. Instalar o podman-compose (apenas uma vez)
python -m pip install podman-compose

# 3. Adicionar Scripts ao PATH (apenas uma vez — fechar e reabrir terminal apos)
$scriptsPath = "C:\Users\HabilidadeCom\AppData\Local\Python\pythoncore-3.14-64\Scripts"
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$scriptsPath*") {
    [System.Environment]::SetEnvironmentVariable("Path", "$currentPath;$scriptsPath", "User")
}

# 4. Ir para a pasta do projeto
cd C:\laragon\www\php\habilidade\projeto55100

# 5. Subir os containers
podman-compose up -d --build

# 6. Verificar se subiram
podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## 13. Nota sobre o `podman compose` (com espaco)

O comando original `podman compose` (com espaco, sem hifen) continuara
funcionando normalmente para operacoes que usam a API nativa do Podman
(ex.: `podman compose ps`, `podman compose logs`). O problema se manifesta
apenas quando ele delega para o `docker-compose.exe` — o que ocorre
especificamente no `up` e `build`.

Apos instalar o `podman-compose` e adiciona-lo ao PATH, o `podman compose`
passara a encontra-lo como provider preferencial e a delegacao para o
`docker-compose.exe` do Docker Desktop sera eliminada automaticamente.

---

## 14. Versoes Registradas

| Componente     | Versao            |
| -------------- | ----------------- |
| Windows        | 11 Pro 10.0.26200 |
| Podman Desktop | 1.27.2            |
| Podman CLI     | 5.8.2             |
| WSL            | 2                 |
| Python         | 3.14.2            |
| podman-compose | 1.6.0             |
| python-dotenv  | 1.2.2             |
| pyyaml         | 6.0.3             |
