# Deploy via Git — projeto55100

Documentação do fluxo completo de publicação automática via Git entre GitHub e KingHost (habilidade.com).
Inclui diagnóstico, causa raiz e sequência exata que resolveu o problema em 02/06/2026.

---

## Estrutura de Repositórios

| Repositório GitHub                             | Branch | Diretório KingHost      |
| ---------------------------------------------- | ------ | ----------------------- |
| `git@github.com:git-GMHammes/projeto55100.git` | `main` | `~/www/projeto55100`    |
| `git@github.com:git-GMHammes/projeto56300.git` | `main` | `~/www/projeto56300`    |

**Atenção:** O painel KingHost exibe o caminho como `/www/projeto55100`, mas o caminho real no servidor SSH é `~/www/projeto55100` (`/home/habilidade/www/projeto55100`).

---

## Como Funciona

```
[ Desenvolvedor ]
      |
      | git push origin main
      v
[ GitHub ]
      |
      | Webhook HTTP -> painel.kinghost.com.br
      v
[ KingHost — processo interno ]
      |
      | git pull (usando chave SSH da conta KingHost)
      v
[ ~/www/projeto55100 ]
```

O GitHub notifica a KingHost via webhook a cada push. A KingHost executa `git pull` autenticado pela chave SSH registrada na conta GitHub (`kinghost_key_202605021225`).

---

## Configuracao do Webhook (GitHub -> KingHost)

Configurado automaticamente pelo painel KingHost em:
`painel.kinghost.com.br -> Gerenciar habilidade.com -> Publicacao via GIT`

- Painel KingHost: `painel.kinghost.com.br/painel.git.webhook.php?id_dominio=101260`
- Log de webhooks: `painel.kinghost.com.br/painel.git.webhook.log.php?id_dominio=101260&id_repo=48668`

---

## Autenticacao SSH — Como a KingHost Acessa o GitHub

### Chave da conta KingHost (nivel de conta GitHub)

A KingHost registra automaticamente uma chave SSH na conta GitHub do usuario durante o cadastro inicial via painel. Essa chave opera no nivel da conta (nao por repositorio), dando acesso a todos os repos do usuario.

- Nome no GitHub: `kinghost_key_202605021225`
- Adicionada por: `Kinghost Deploy` em 02/05/2026
- Localizacao no GitHub: `github.com/settings/keys` (SSH and GPG keys)
- Acesso: Read/write em todos os repos da conta `git-GMHammes`

Essa chave e gerenciada internamente pela KingHost. Nao e necessario manipula-la.

### Deploy Keys por repositorio (geradas para diagnostico)

Durante o diagnostico foram geradas chaves dedicadas no servidor via PuTTY:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_55100 -N ""
cat ~/.ssh/id_rsa_55100.pub
```

A chave publica foi cadastrada em:
`GitHub -> git-GMHammes/projeto55100 -> Settings -> Deploy keys`

- Title: `kinghost-deploy`
- Allow write access: NAO

### Configuracao do ~/.ssh/config no servidor

Para que o usuario `habilidade` use a chave correta ao conectar no GitHub via shell:

```bash
echo -e "Host github.com\n  IdentityFile ~/.ssh/id_rsa_55100\n  StrictHostKeyChecking no" >> ~/.ssh/config
chmod 600 ~/.ssh/config
```

O `chmod 600` e obrigatorio — o SSH rejeita o arquivo se as permissoes estiverem abertas:
`Bad owner or permissions on /home/habilidade/.ssh/config`

Teste de conexao:

```bash
ssh -T git@github.com
# Resposta esperada: Hi git-GMHammes/projeto55100! You've successfully authenticated...
```

---

## CAUSA RAIZ DO PROBLEMA — Permissao do Diretorio

### Sintoma

Webhooks chegavam com hashes corretos no log do painel KingHost, mas nenhum arquivo aparecia em `~/www/projeto55100`.

### Diagnostico

```bash
stat ~/www/projeto55100
# Access: (0755/drwxr-xr-x)  <-- PROBLEMA

stat ~/www/projeto56300
# Access: (0777/drwxrwxrwx)  <-- correto, deploy funcionava
```

O diretorio `projeto55100` foi criado via FTP com permissao padrao `0755`.
O processo interno da KingHost roda como um usuario de sistema diferente de `habilidade` e nao tem permissao de escrita em diretorios `755`.

O `projeto56300` tinha `0777` — por isso funcionava.

### Solucao

```bash
chmod 777 ~/www/projeto55100
```

---

## Primeiro Deploy — Clone Manual via SSH

Na primeira vez, ou apos recriar o diretorio, a KingHost pode nao conseguir fazer o clone inicial automaticamente. Nesse caso, executar manualmente via PuTTY:

```bash
git clone git@github.com:git-GMHammes/projeto55100.git ~/www/projeto55100
```

Apos o clone inicial, os deploys subsequentes ocorrem automaticamente via webhook a cada `git push`.

Se o diretorio ja existir com conteudo, usar pull:

```bash
git -C ~/www/projeto55100 pull
```

---

## Diagnostico de Acesso ao Repositorio

Para testar se uma chave especifica consegue acessar o repositorio:

```bash
# Testar com chave padrao
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no" \
  git clone git@github.com:git-GMHammes/projeto55100.git /tmp/test55100 2>&1

# Testar com chave dedicada
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_rsa_55100 -o StrictHostKeyChecking=no" \
  git clone git@github.com:git-GMHammes/projeto55100.git /tmp/test55100_b 2>&1
```

Limpar apos o teste:

```bash
rm -rf /tmp/test55100 /tmp/test55100_b
```

---

## Sequencia Completa que Resolveu o Deploy

1. Gerar chave SSH dedicada no servidor KingHost via PuTTY:
   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_55100 -N ""
   cat ~/.ssh/id_rsa_55100.pub
   ```

2. Adicionar a chave publica como Deploy Key no GitHub:
   `github.com/git-GMHammes/projeto55100/settings/keys -> Add deploy key`

3. Configurar `~/.ssh/config` e corrigir permissoes:
   ```bash
   echo -e "Host github.com\n  IdentityFile ~/.ssh/id_rsa_55100\n  StrictHostKeyChecking no" >> ~/.ssh/config
   chmod 600 ~/.ssh/config
   ```

4. Verificar autenticacao:
   ```bash
   ssh -T git@github.com
   ```

5. Corrigir permissao do diretorio de deploy:
   ```bash
   chmod 777 ~/www/projeto55100
   ```

6. Executar clone inicial:
   ```bash
   git clone git@github.com:git-GMHammes/projeto55100.git ~/www/projeto55100
   ```

7. Fazer um push qualquer para validar o webhook automatico.

---

## Placeholders — Referencia de Credenciais

> As credenciais reais nunca devem ser registradas em arquivos versionados.

| Item                         | Onde fica                          | Formato esperado                           |
| ---------------------------- | ---------------------------------- | ------------------------------------------ |
| Personal Access Token GitHub | Painel KingHost (cadastro inicial) | `ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| Chave SSH privada KingHost   | `~/.ssh/id_rsa_55100` (servidor)   | Arquivo PEM, nunca exportar                |
| Chave SSH publica KingHost   | GitHub -> Deploy keys              | `ssh-rsa AAAA...== comentario`             |
| Senha SSH KingHost           | Fornecida pelo usuario na sessao   | Nao persiste                               |

---

## Fluxo de Trabalho Local

```bash
# Editar arquivos em:
# C:\laragon\www\php\habilidade\projeto55100\

git status
git add nome-do-arquivo.php
git commit -m "descricao da alteracao"
git push origin main
# O push dispara o deploy automatico na KingHost
```

Apos o push, verificar em:
`painel.kinghost.com.br -> Publicacao via GIT -> Ver logs de Webhooks`

---

## Diagnostico de Problemas

### Log mostra 000000000000 em Revisao Antes

O KingHost recebeu o webhook mas nunca fez o clone inicial.
Causa: Deploy Key nao cadastrada ou chave errada no GitHub.
Solucao: Verificar GitHub -> Settings -> Deploy keys e recadastrar no painel KingHost.

### Erro Key is already in use no GitHub

O GitHub nao permite a mesma chave publica como Deploy Key em dois repositorios.
Solucao: Gerar chave dedicada por projeto (`id_rsa_55100`, `id_rsa_56300`, etc.).

### Erro Key is invalid no GitHub

Chave copiada com caracteres errados.
Solucao: Selecionar o texto diretamente no terminal PuTTY com o mouse — a selecao ja copia automaticamente.

### Bad owner or permissions on ~/.ssh/config

O SSH rejeita o arquivo de configuracao com permissoes abertas.
Solucao: `chmod 600 ~/.ssh/config`

### Webhooks chegam mas nenhum arquivo e deployado

Causa mais provavel: permissao `0755` no diretorio de deploy.
Solucao: `chmod 777 ~/www/projeto55100`
Verificar tambem: `stat ~/www/projeto55100` e comparar com um projeto que funciona.

### Deploy nao ocorre apos push

1. Verificar se o push foi para branch `main`
2. Verificar log de webhooks no painel KingHost
3. Executar Recadastrar Aplicacao no painel KingHost
4. Se primeira vez: executar clone manual via PuTTY

---

## Referencias

- Painel KingHost: painel.kinghost.com.br
- Repositorio: github.com/git-GMHammes/projeto55100
- Servidor SSH: web36f42.kinghost.net
- Usuario SSH: habilidade
- Caminho real no servidor: `/home/habilidade/www/projeto55100`
- Chave da conta KingHost no GitHub: `kinghost_key_202605021225`
