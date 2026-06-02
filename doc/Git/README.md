# Deploy via Git — projeto55100

Documentação do fluxo de publicação automática via Git entre GitHub e KingHost (habilidade.com).

---

## Estrutura de Repositórios

| Repositório GitHub                             | Branch | Diretório KingHost  |
| ---------------------------------------------- | ------ | ------------------- |
| `git@github.com:git-GMHammes/projeto55100.git` | `main` | `/www/projeto55100` |
| `git@github.com:git-GMHammes/projeto56300.git` | `main` | `/www/projeto56300` |

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
[ KingHost ]
      |
      | git pull (usando Deploy Key SSH)
      v
[ /www/projeto55100 ]
```

O GitHub notifica a KingHost via webhook a cada push. A KingHost faz `git pull` autenticado pela Deploy Key SSH cadastrada no repositório.

---

## Configuracao do Webhook (GitHub -> KingHost)

Configurado automaticamente pelo painel KingHost em:
`painel.kinghost.com.br -> Gerenciar habilidade.com -> Publicacao via GIT`

- Painel KingHost: `painel.kinghost.com.br/painel.git.webhook.php?id_dominio=101260`
- Log de webhooks: `painel.kinghost.com.br/painel.git.webhook.log.php?id_dominio=101260&id_repo=48668`

---

## Deploy Key SSH — Configuracao

### Por que e necessaria

O GitHub exige autenticacao SSH para que servidores externos (KingHost) facam `git pull` em repositorios. A Deploy Key e uma chave SSH publica cadastrada diretamente no repositorio.

### Regras do GitHub para Deploy Keys

- Cada repositorio aceita suas proprias Deploy Keys
- **A mesma chave publica nao pode ser usada como Deploy Key em dois repositorios diferentes**
- Por isso, foi gerada uma chave dedicada por projeto no servidor KingHost

### Chave gerada no servidor KingHost

Gerada via SSH (PuTTY) conectado em `web36f42.kinghost.net` com o usuario `habilidade`:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_55100 -N ""
cat ~/.ssh/id_rsa_55100.pub
```

A chave publica gerada foi cadastrada em:
`GitHub -> git-GMHammes/projeto55100 -> Settings -> Deploy keys -> Add deploy key`

- **Title:** `kinghost-deploy`
- **Allow write access:** NAO (somente leitura)

### Configuracao do SSH no servidor KingHost

Para que o servidor use a chave correta ao conectar no GitHub:

```bash
echo -e "Host github.com\n  IdentityFile ~/.ssh/id_rsa_55100\n  StrictHostKeyChecking no" >> ~/.ssh/config
```

Teste de conexao:

```bash
ssh -T git@github.com
# Resposta esperada: Hi git-GMHammes! You've successfully authenticated...
```

---

## Placeholders — Referencia de Credenciais

> As credenciais reais nunca devem ser registradas em arquivos versionados.
> Use variaveis de ambiente ou cofre de senhas.

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

# Verificar status
git status

# Adicionar alteracoes
git add nome-do-arquivo.php

# Commit
git commit -m "descricao da alteracao"

# Push — dispara o deploy automatico na KingHost
git push origin main
```

Apos o push, verificar em:
`painel.kinghost.com.br -> Publicacao via GIT -> Ver logs de Publicacoes`

---

## Diagnostico de Problemas

### Log mostra 000000000000 em Revisao Antes

Significa que o KingHost nunca conseguiu fazer o clone inicial.
Causa: Deploy Key nao cadastrada ou chave errada no GitHub.
Solucao: Verificar GitHub -> Settings -> Deploy keys e recadastrar a aplicacao no painel KingHost.

### Erro Key is already in use no GitHub

O GitHub nao permite a mesma chave publica em dois repositorios diferentes.
Solucao: Gerar nova chave dedicada com nome diferente (id_rsa_55100, id_rsa_56300, etc.).

### Erro Key is invalid no GitHub

A chave foi copiada com caracteres errados.
Solucao: Copiar diretamente do terminal via selecao de mouse no PuTTY — nunca transcrever manualmente.

### Deploy nao ocorre apos push

1. Verificar se o push foi para branch main
2. Verificar log de webhooks no painel KingHost
3. Executar Recadastrar Aplicacao no painel KingHost

---

## Referencias

- Painel KingHost: painel.kinghost.com.br
- Repositorio: github.com/git-GMHammes/projeto55100
- Servidor: web36f42.kinghost.net
- Usuario SSH: habilidade
- Tutorial KingHost: Central de Ajuda -> Publicacao via GIT
