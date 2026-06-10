# ROADMAP — Correção do Podman Desktop travado em STARTING

**Data:** 2026-06-10
**Ambiente:** Windows 11 Pro — WSL 2 — Podman Desktop v1.27.2 — Podman v5.8.2

---

## 1. Contexto e Sintoma

Após múltiplas reinicializações da máquina, o Podman Desktop permanecia com o
status **STARTING** indefinidamente na tela de Dashboard, sem progredir para
o estado operacional.

**Sintoma visual no Podman Desktop (barra inferior):**

```
Podman v5.8.2   ● STARTING   |   podman-machine-default
```

A máquina nunca chegava ao estado **Running**, independentemente do tempo de
espera ou da quantidade de reinicializações do sistema operacional.

---

## 2. Hipótese Inicial

Suspeita de defeito ou estado inconsistente no WSL 2, que serve de backend
para a máquina virtual do Podman. A máquina `podman-machine-default` é do
tipo `wsl`, portanto depende diretamente do subsistema WSL para funcionar.

---

## 3. Testes de Diagnóstico

### 3.1 — Status do WSL e distros instaladas

**Comando executado:**

```powershell
wsl --status
wsl --list --verbose
```

**Output obtido:**

```
Distribuição Padrão: docker-desktop
Versão Padrão: 2

  NAME                           STATE     VERSION
* docker-desktop                 Stopped   2
  podman-machine-default         Stopped   2
```

**Diagnóstico parcial:**
A distro WSL `podman-machine-default` está com estado **Stopped**. O WSL já
encerrou (ou nunca conseguiu iniciar) a distro. O Podman Desktop, porém,
ainda a aguardava subir — sem receber nenhum sinal de falha ou sucesso.

---

### 3.2 — Verificação dos serviços de virtualização do Windows

**Comando executado:**

```powershell
Get-Service -Name "*vmcompute*", "*vmms*", "*WslService*", "*LxssManager*" |
    Select-Object Name, Status, StartType
```

**Output obtido:**

```
Name        Status    StartType
----        ------    ---------
vmcompute   Running   Manual
vmms        Running   Automatic
WSLService  Running   Automatic
```

**Diagnóstico:**
Os serviços de virtualização do Windows (`Hyper-V Compute`, `Hyper-V VM
Management`, `WSL Service`) estão todos ativos e saudáveis. O problema não
é de infraestrutura do hipervisor — é específico do estado da máquina Podman.

---

### 3.3 — Status reportado pelo próprio Podman

**Comando executado:**

```powershell
podman machine list
```

**Output obtido:**

```
NAME                     VM TYPE  CREATED       LAST UP             CPUS  MEMORY  DISK SIZE
podman-machine-default*  wsl      3 months ago  Currently starting  6     2GiB    100GiB
```

**Diagnóstico conclusivo — estado inconsistente confirmado:**

| Camada | Estado reportado     |
| ------ | -------------------- |
| WSL 2  | `Stopped`            |
| Podman | `Currently starting` |

O Podman ficou travado aguardando a distro WSL subir. O WSL já a havia
encerrado. Após os reinicios, nenhum dos dois lados limpou o estado
intermediário: o Podman nunca recebeu o sinal de falha e ficou em loop de
espera infinito.

---

## 4. Causa Raiz

O Podman Desktop usa o WSL 2 como backend de virtualização. Ao reinicializar
o Windows, a sequência de shutdown/startup não garantiu que a máquina Podman
fosse encerrada de forma limpa antes do sistema desligar. Na próxima
inicialização:

1. O WSL subiu mas não restaurou a distro `podman-machine-default` automaticamente.
2. O Podman Desktop iniciou e tentou conectar à máquina, que não respondeu.
3. O estado ficou registrado internamente como `Currently starting` — sem
   timeout definido para abortar a tentativa.

Resultado: travamento permanente em STARTING até intervenção manual.

---

## 5. Correção — Passo a Passo

### Passo 1 — Forçar parada da máquina pelo Podman

**Objetivo:** Sinalizar ao Podman que a máquina deve parar, limpando o estado
`Currently starting` registrado internamente.

**Comando:**

```powershell
podman machine stop podman-machine-default
```

**Output:**

```
Machine "podman-machine-default" stopped successfully
```

---

### Passo 2 — Encerrar a distro WSL diretamente

**Objetivo:** Garantir que o WSL também esteja com a distro completamente
terminada, sem processos órfãos ou estado residual.

**Comando:**

```powershell
wsl --terminate podman-machine-default
```

**Output:**

```
A operação foi concluída com êxito.
```

---

### Passo 3 — Iniciar a máquina novamente

**Objetivo:** Subir a máquina Podman com estado completamente limpo.

**Comando:**

```powershell
podman machine start podman-machine-default
```

**Output:**

```
Starting machine "podman-machine-default"
your 131072x1 screen size is bogus. expect trouble

This machine is currently configured in rootless mode. If your containers
require root permissions (e.g. ports < 1024), or if you run into compatibility
issues with non-podman clients, you can switch using the following command:

    podman machine set --rootful

API forwarding for Docker API clients is not available due to the following startup failures.
    win-sshproxy.exe failed to start, exit code: 0 (see windows event logs)

Podman clients are still able to connect.
Machine "podman-machine-default" started successfully
```

> **Observação:** o aviso `your 131072x1 screen size is bogus` é inofensivo —
> é um aviso do terminal WSL sobre resolução de tela, sem impacto funcional.

---

### Passo 4 — Verificação final

**Comando:**

```powershell
podman machine list
```

**Output:**

```
NAME                     VM TYPE  CREATED       LAST UP            CPUS  MEMORY  DISK SIZE
podman-machine-default*  wsl      3 months ago  Currently running  6     2GiB    100GiB
```

**Resultado:** Máquina em estado **Currently running**.
O Podman Desktop saiu do STARTING e passou a exibir o status operacional.

---

## 6. Aviso — win-sshproxy.exe

Durante o `machine start` apareceu o seguinte aviso:

```
API forwarding for Docker API clients is not available due to the following startup failures.
    win-sshproxy.exe failed to start, exit code: 0 (see windows event logs)
```

**O que significa:**
O socket de compatibilidade com Docker (`npipe:////./pipe/docker_engine`) não
está disponível. Clientes que dependem da API Docker para conectar ao Podman
(ex.: alguns plugins de IDE configurados para Docker, Docker CLI apontando
para Podman) não conseguirão conectar via esse socket.

**O que NÃO é afetado:**
O Podman nativo funciona normalmente — `podman` CLI, Podman Desktop, e todos
os containers e pods continuam operando sem restrição.

**Se precisar investigar o win-sshproxy.exe:**

```powershell
# Ver eventos relacionados no Windows Event Log
Get-WinEvent -LogName Application |
    Where-Object { $_.Message -like "*win-sshproxy*" } |
    Select-Object -First 10 |
    Format-List TimeCreated, Message
```

---

## 7. Referência Rápida — Comandos para Uso Futuro

Se o problema se repetir após reinicializações:

```powershell
# 1. Forçar parada da máquina pelo Podman
podman machine stop podman-machine-default

# 2. Encerrar a distro WSL
wsl --terminate podman-machine-default

# 3. Iniciar novamente
podman machine start podman-machine-default

# 4. Confirmar que está rodando
podman machine list
wsl --list --verbose
```

**Tempo estimado:** menos de 1 minuto para executar os 4 passos.

---

## 8. Diagnósticos Adicionais Úteis

```powershell
# Ver status dos serviços de virtualização
Get-Service -Name "*vmcompute*", "*vmms*", "*WslService*" |
    Select-Object Name, Status, StartType

# Ver estado detalhado de todas as distros WSL
wsl --list --verbose

# Ver estado geral do WSL
wsl --status

# Inspecionar detalhes da máquina Podman (JSON)
podman machine inspect podman-machine-default
```
