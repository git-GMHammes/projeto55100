# README — CORS com CodeIgniter 4 + Nginx (SPA React / Vite)

**Data:** 2026-06-16
**Ambiente:** CodeIgniter 4 · PHP 8.2 · Nginx · React 19 + Vite · Podman (Docker)

---

## 1. Problema

A SPA React (Vite, porta 5173) chamava a API CI4 via URL limpa:

```
GET  http://localhost:55100/api/v1/municipio-rj-view/get-all
OPTIONS http://localhost:55100/api/v1/municipio-rj-view/get-all
```

O browser bloqueava com:

```
CORS Missing Allow Origin — Código de status: 404
```

A mesma rota funcionava perfeitamente no Postman com `index.php` na URL:

```
GET http://localhost:55100/index.php/api/v1/municipio-rj-view/get-all
```

---

## 2. Causas Identificadas

### 2.1 — Nginx: URL limpa não preservava o PATH_INFO

O `location /api/` usava:

```nginx
try_files $uri $uri/ /index.php?$args;
```

O fallback `/index.php?$args` passa apenas a query string para o PHP-FPM.
O caminho `/api/v1/municipio-rj-view/get-all` era perdido.
O CI4 recebia uma requisição para `/index.php` sem rota → 404.

### 2.2 — CI4: router executa ANTES dos `globals.before` filters

O fluxo interno do `CodeIgniter.php` é:

```
runRequiredBeforeFilters()   ← forcehttps, pagecache
    └─ handleRequest()
           ├─ tryToRouteIt()          ← ROUTER RODA AQUI (lança PageNotFoundException se não achar rota)
           └─ $filters->run('before') ← globals.before (CORS) só roda depois do router
```

Para requisições `OPTIONS` sem rota explícita definida com `$routes->options(...)`,
o router lança `PageNotFoundException` **antes** do filter CORS ter chance de rodar.
O CI4 retorna 404 sem nenhum header CORS → browser bloqueia.

### 2.3 — CI4: `cors` ausente em `globals.after`

O filter CORS estava apenas em `globals.before`. Sem `globals.after`, o header
`Access-Control-Allow-Origin` não era adicionado às respostas GET/POST normais.

---

## 3. Solução

Dois arquivos alterados:

### 3.1 — `docker/nginx/default.conf`

**Correção 1:** Nginx intercepta `OPTIONS` diretamente, sem passar pelo PHP.

**Correção 2:** `try_files` preserva o PATH_INFO ao redirecionar para o PHP-FPM.

```nginx
location /api/ {
    # Nginx intercepta OPTIONS — CI4 não consegue porque o router roda antes dos filters
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '$http_origin' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With' always;
        add_header 'Access-Control-Max-Age' '7200' always;
        return 204;
    }
    # $uri preserva o caminho (/api/v1/...) como PATH_INFO no PHP-FPM
    try_files $uri $uri/ /index.php$uri?$query_string;
}
```

> **Por que `$http_origin`?**
> O Nginx ecoa de volta a origem do request. Qualquer origem pode ser listada
> no `Config/Cors.php` do CI4 para controle fino nas requisições não-OPTIONS.

### 3.2 — `src/app/Config/Filters.php`

Adicionar `cors` em `globals.after` para que respostas GET/POST recebam o header CORS:

```php
public array $globals = [
    'before' => [
        'cors',   // já existia
    ],
    'after' => [
        'cors',   // ADICIONAR — garante Access-Control-Allow-Origin nas respostas normais
    ],
];
```

---

## 4. Verificação

Após reiniciar o Nginx (`podman restart <container_nginx>`):

```bash
# OPTIONS deve retornar 204 com header CORS
curl -s -D - -o /dev/null -X OPTIONS "http://localhost:55100/api/v1/MODULO/get-all" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization"

# Esperado:
# HTTP/1.1 204 No Content
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS

# GET deve retornar 200 com header CORS
curl -s -D - -o /dev/null "http://localhost:55100/api/v1/MODULO/get-all?page=1&limit=1" \
  -H "Origin: http://localhost:5173"

# Esperado:
# HTTP/1.1 200 OK
# Access-Control-Allow-Origin: http://localhost:5173
```

---

## 5. Checklist para outros projetos

- [ ] Nginx `location /api/` tem o bloco `if ($request_method = 'OPTIONS')` retornando 204
- [ ] Nginx `try_files` usa `/index.php$uri?$query_string` (com `$uri`, não apenas `?$args`)
- [ ] `src/app/Config/Filters.php` tem `cors` em ambos `globals.before` E `globals.after`
- [ ] `src/app/Config/Cors.php` lista as origens permitidas em `allowedOrigins`
- [ ] Após qualquer mudança no Nginx: reiniciar o container Nginx

---

## 6. Arquivos de referência deste projeto

| Arquivo                      | Papel                                                |
| ---------------------------- | ---------------------------------------------------- |
| `docker/nginx/default.conf`  | Configuração Nginx com CORS para OPTIONS e PATH_INFO |
| `src/app/Config/Filters.php` | Filter CORS em before + after                        |
| `src/app/Config/Cors.php`    | Origens, métodos e headers permitidos                |
