# Deploy — projeto55100

## Ambiente de produção

- Servidor HTTP: **Apache** com `AllowOverride All` habilitado no vhost
- PHP: versão 8.2+ com extensões pdo_mysql, mysqli, mbstring, zip
- Sem Docker, sem Composer no servidor, sem Node.js
- Deploy via **FTP**

---

## Passo a passo

### 1. Preparar dependências PHP (local)

```bash
cd src
composer install --no-dev --optimize-autoloader
```

O diretório `src/vendor/` gerado deve ser incluído no envio FTP.

### 2. Buildar o frontend React (local)

```bash
cd <pasta-do-projeto-react>
npm install
npm run build
```

Copiar o conteúdo de `dist/` para `src/public/` (ou subpasta definida no projeto).

### 3. Configurar `.env` de produção

Copiar `src/env` para `src/.env` e preencher com as credenciais de produção:

```
CI_ENVIRONMENT = production
app.baseURL = 'https://seu-dominio.com/'
database.default.hostname = localhost
database.default.database = nome_do_banco
database.default.username = usuario
database.default.password = senha
database.default.DBDriver = MySQLi
```

O arquivo `.env` **não deve ser versionado**.

### 4. Enviar via FTP

Pastas e arquivos **obrigatórios**:

| Caminho             | Descrição                          |
|---------------------|------------------------------------|
| `src/app/`          | Código da aplicação (controllers, models, views, config) |
| `src/system/`       | Core do CodeIgniter 4              |
| `src/vendor/`       | Dependências PHP pré-instaladas    |
| `src/public/`       | Webroot (index.php, assets, build React) |
| `src/.env`          | Configuração de produção           |

Pastas a **não enviar**:

| Caminho             | Motivo                             |
|---------------------|------------------------------------|
| `src/tests/`        | Testes unitários, irrelevante em prod |
| `src/writable/cache/` | Cache local, recriado em prod    |
| `node/`             | Servidor WebSocket, somente dev    |
| `docker/`           | Configurações Docker, somente dev  |
| `docker-compose*.yml` | Somente dev                      |

### 5. Verificar Apache

O arquivo `src/public/.htaccess` do CodeIgniter requer que o Apache esteja configurado com:

```apache
AllowOverride All
```

No vhost ou em `httpd.conf`. Sem isso o roteamento não funciona.

### 6. Permissões de escrita

A pasta `src/writable/` precisa de permissão de escrita pelo processo do Apache:

```bash
chmod -R 755 writable/
```

---

## WebSocket em produção

O serviço Node.js (WebSocket) **não está disponível em produção**. Funcionalidades que dependam de `/ws` devem ser adaptadas para polling HTTP ou SSE se necessário.

---

## Portas (somente em dev local)

| Porta | Serviço  |
|-------|----------|
| 55100 | Nginx → aplicação |
| 55101 | MySQL    |
| 55102 | Adminer  |
