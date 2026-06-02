# projeto55100 — Referência de Portas, Serviços e Dependências

## Sequência de portas: 551XX

| Porta | Serviço               | Container / Processo         | Acesso                          |
|-------|-----------------------|------------------------------|---------------------------------|
| 55100 | Nginx → PHP + React   | codeigniter55100_nginx       | http://localhost:55100          |
| 55101 | MySQL 8.0             | codeigniter55100_mysql       | localhost:55101 (cliente MySQL) |
| 55102 | Adminer               | codeigniter55100_adminer     | http://localhost:55102          |
| —     | PHP-FPM 8.2 (interno) | codeigniter55100_php         | php:9000 (FastCGI, interno)     |
| —     | Node.js WS (interno)  | codeigniter55100_node        | node:3000 (somente dev)         |

---

## Dois Ambientes

### Dev local (Docker Compose)

Subir todos os serviços (incluindo Node.js/WebSocket):
```bash
docker compose up -d
```

Subir sem Node.js (simula produção):
```bash
docker compose -f docker-compose.yml up -d
```

O `docker-compose.override.yml` é carregado automaticamente pelo `docker compose up` e inclui o serviço `node`.

### Produção (FTP + Apache)

Sem Docker. Ver [DEPLOY.md](DEPLOY.md) para passo a passo completo.

---

## Mapa de Arquivos por Responsabilidade

### Orquestração dev

| Arquivo                         | Responsabilidade                              |
|---------------------------------|-----------------------------------------------|
| `docker-compose.yml`            | Serviços principais: nginx, php, mysql, adminer |
| `docker-compose.override.yml`   | Serviço node/WebSocket (somente dev)          |
| `docker/php/Dockerfile`         | Imagem PHP 8.2-fpm com extensões              |
| `docker/node/Dockerfile`        | Imagem Node 20-alpine                         |
| `docker/nginx/default.conf`     | Roteamento Nginx: PHP-FPM + proxy WebSocket   |
| `docker/mysql/init.sql`         | Schema inicial: tabela `messages`             |

### Aplicação PHP (CodeIgniter 4)

| Caminho               | Responsabilidade                              |
|-----------------------|-----------------------------------------------|
| `src/app/`            | Controllers, Models, Views, Config, Filters   |
| `src/system/`         | Core CodeIgniter 4                            |
| `src/vendor/`         | Dependências Composer (enviar no FTP)         |
| `src/public/`         | Webroot: index.php, assets, build React       |
| `src/public/.htaccess`| Roteamento Apache → index.php                 |
| `src/composer.json`   | Declaração de dependências PHP                |
| `src/env`             | Template de variáveis de ambiente             |
| `src/writable/`       | Cache, logs, sessões (escrita em runtime)     |

### Frontend React

| Item            | Detalhe                                          |
|-----------------|--------------------------------------------------|
| Localização     | Repositório/pasta separada                       |
| Build           | `npm run build` → `dist/`                        |
| Deploy          | Conteúdo de `dist/` copiado para `src/public/`   |

### Node.js WebSocket (somente dev)

| Arquivo              | Responsabilidade                              |
|----------------------|-----------------------------------------------|
| `node/server.js`     | Express + WebSocket; `/ws`, `/internal/broadcast`, `/health` |
| `node/package.json`  | Dependências: ws ^8.17.1, express ^4.19.2     |

---

## Dependências

### PHP
| Pacote                 | Versão    | Uso                     |
|------------------------|-----------|-------------------------|
| codeigniter4/framework | 4.x       | Framework MVC           |
| laminas/laminas-escaper| ^2.18     | Escape seguro de output  |
| psr/log                | ^3.0      | Interface de logging     |

Dev (não vão para produção):
- phpunit/phpunit, fakerphp/faker, friendsofphp/php-cs-fixer, kint-php/kint

### Node.js (somente dev)
| Pacote   | Versão  | Uso            |
|----------|---------|----------------|
| ws       | ^8.17.1 | WebSocket      |
| express  | ^4.19.2 | HTTP server    |

---

## Rede Docker (dev)

Rede: `codeigniter55100_net` (bridge)

```
nginx:80 ──► php:9000 (FastCGI)
nginx:80 ──► node:3000 (proxy /ws)
php       ──► mysql:3306
adminer   ──► mysql:3306
```

Volume: `mysql_data` (local) — dados MySQL persistidos entre restarts.
