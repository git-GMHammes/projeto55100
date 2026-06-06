# CLAUDE.md — Projeto55100

> Este arquivo é carregado automaticamente ao trabalhar neste projeto.
> Complementa as regras globais em `C:\Users\HabilidadeCom\.claude\CLAUDE.md`.

---

## Arquitetura Geral

Este projeto adota separação estrita entre backend e frontend:

| Camada    | Tecnologia           | Raiz no repositório                            |
| --------- | -------------------- | ---------------------------------------------- |
| Backend   | CodeIgniter 4 (PHP)  | `src/`                                         |
| Frontend  | React 19 + Vite (TS) | `src/public/frontend/Projeto55100App/`         |
| WebSocket | Node.js 20 (Express) | `docker/node/` — servidor separado, porta 3000 |
| Banco     | MySQL/MariaDB        | Gerenciado via Docker (`docker/mysql/`)        |
| Proxy     | Nginx                | `docker/nginx/default.conf`                    |

O frontend é uma **SPA desacoplada**: nunca contém lógica de banco de dados
e se comunica com o backend exclusivamente via API REST.

---

## BACKEND — CodeIgniter 4

**Raiz:** `src/`

### O que é Backend

- Toda lógica PHP está aqui: regras de negócio, acesso ao banco, autenticação, validação.
- Expõe **somente APIs REST** sob o prefixo `/api/v1/...`.
- Retorna JSON — nunca renderiza HTML para o frontend React.
- Autenticação via Bearer Token (JWT ou similar).

### Estrutura relevante

```
src/
├── app/
│   ├── Config/        ← Configurações do CI4 (Routes, Database, Filters…)
│   ├── Controllers/
│   │   ├── Api/
│   │   │   └── V1/   ← Controllers REST (retornam JSON)
│   │   └── Home.php   ← Controller padrão (uso interno/diagnóstico)
│   ├── Database/      ← Migrations e seeds
│   ├── Filters/       ← Middlewares (ex.: autenticação JWT)
│   ├── Helpers/       ← Funções auxiliares globais PHP
│   ├── Libraries/     ← Classes de serviço internas
│   ├── Models/        ← Modelos CI4 (acesso ao banco)
│   ├── Requests/      ← Validação de entrada
│   ├── Services/      ← Serviços de domínio
│   └── Views/         ← Views PHP (somente para páginas não-React)
├── public/
│   ├── index.php      ← Entry point do CI4
│   └── frontend/      ← Diretório do frontend (ver abaixo)
├── system/            ← Core do CodeIgniter — NÃO EDITAR
├── writable/          ← Cache, logs, sessões, uploads — NÃO VERSIONAR
├── composer.json
└── spark              ← CLI do CodeIgniter
```

---

### ABSTRAÇÕES DO BACKEND — REGRA INVIOLÁVEL

> **Todo método usado em mais de uma classe DEVE ser promovido para a classe
> base correspondente.** Nunca duplicar lógica entre controllers ou entre
> services. Parâmetros específicos do módulo são passados via sobrescrita de
> hooks ou de métodos abstratos.

#### Hierarquia de Controllers (`Controllers/Api/V1/`)

```
BaseResourceTableController   ← 14 endpoints REST + helpers de resposta
    └── BaseResourceViewController  ← 8 endpoints somente leitura (view)
            └── MeuModuloViewController   ← apenas declara $this->processor
    └── MeuModuloTableController    ← declara $this->processor +
                                       getCreateRules() + getUpdateRules()
```

**`BaseResourceTableController`**
`src/app/Controllers/Api/V1/BaseResourceTableController.php`

Fornece **todos** os endpoints REST e helpers de resposta. Nunca reescrever
esses métodos em controllers filhos — apenas usar via herança:

| Endpoints de leitura (tabela) | Endpoints de escrita | Endpoints de exclusão |
| ----------------------------- | -------------------- | --------------------- |
| `find()` — filtros exatos     | `create()`           | `deleteSoft()`        |
| `getGrouped()` — WHERE IN     | `update($id)`        | `deleteRestore()`     |
| `search()` — busca textual    |                      | `deleteHard()`        |
| `get($id)`                    |                      | `clearDeleted()`      |
| `getAll()`                    |                      |                       |
| `getNoPagination()`           |                      |                       |
| `getDeleted($id)`             |                      |                       |
| `getWithDeleted($id)`         |                      |                       |
| `getDeletedAll()`             |                      |                       |
| `getAllWithDeleted()`         |                      |                       |

Helpers de resposta padronizados (sempre usar, nunca recriar):
`respondSuccess()`, `respondCreated()`, `respondPaginated()`,
`respondNotFound()`, `respondValidationError()`, `respondError()`,
`respondServerError()`

Hooks abstratos obrigatórios nos controllers filhos com tabela:

- `getCreateRules(): array` — regras de validação do create
- `getUpdateRules(): array` — regras de validação do update

**`BaseResourceViewController`**
`src/app/Controllers/Api/V1/BaseResourceViewController.php`

Estende `BaseResourceTableController`. Redefine `find/getGrouped/search/get/
getAll/getNoPagination/getDeleted/getDeletedAll/getAllWithDeleted` para
operar sobre a **view SQL** via `$this->processor->*View()`. Bloqueia create
e update (hooks selados como `final`). Usar para módulos somente leitura.

---

#### Hierarquia de Services (`Services/V1/`)

```
BaseViewService       ← sanitização, formatação, paginação + leitura de view
    └── BaseTableService   ← leitura de tabela + escrita (Template Method) + exclusão
            └── MeuModuloService   ← sobrescreve hooks de validação e preparação
```

**`BaseViewService`**
`src/app/Services/V1/BaseViewService.php`

Utilitários e leitura de view. Nunca recriar esses métodos em services filhos:

| Utilitários               | Leitura de View           |
| ------------------------- | ------------------------- |
| `sanitizeString()`        | `findView()`              |
| `sanitizeData()`          | `getGroupedView()`        |
| `removeMasks()`           | `searchView()`            |
| `formatDate()`            | `getView()`               |
| `formatDatetime()`        | `getAllView()`            |
| `buildPaginationParams()` | `getNoPaginationView()`   |
|                           | `getDeletedView()`        |
|                           | `getDeletedAllView()`     |
|                           | `getAllWithDeletedView()` |

**`BaseTableService`**
`src/app/Services/V1/BaseTableService.php`

Estende `BaseViewService`. Adiciona leitura de tabela, escrita via
**Template Method** e exclusão. Nunca recriar esses métodos em services filhos:

Leitura de tabela: `find()`, `getGrouped()`, `search()`, `get()`, `getAll()`,
`getNoPagination()`, `getDeleted()`, `getWithDeleted()`, `getDeletedAll()`,
`getAllWithDeleted()`

Escrita (Template Method — sobrescrever apenas os hooks):

```
create():  sanitizeData + removeMasks → validateOnCreate → prepareData → insert
update():  find → sanitizeData + removeMasks → prepareUpdateData → validateOnUpdate → update
```

Hooks sobrescrevíveis nos services filhos:

- `validateOnCreate(array $data): ?array` — conflito de FK/unicidade antes do insert
- `validateOnUpdate(int $id, array $data): ?array` — conflito antes do update
- `prepareData(array $data): array` — hash de senha, formatação antes do insert
- `prepareUpdateData(int $id, array $data): array` — remoção de campos imutáveis antes do update

Exclusão: `deleteSoft()`, `deleteRestore()`, `deleteHard()`, `clearDeleted()`

---

### Regras do Backend

- Nunca alterar `src/system/` — é o core do framework.
- Nunca commitar `src/writable/` (cache, logs, uploads).
- Credenciais de banco de dados ficam em `src/.env` — nunca em código.
- Controllers herdam de `BaseResourceTableController` (tabela) ou
  `BaseResourceViewController` (view) — nunca de `BaseController` diretamente
  para endpoints REST.
- Services herdam de `BaseTableService` (tabela) ou `BaseViewService` (view).
- Migrations: `php spark migrate` / Seeds: `php spark db:seed`.

---

## FRONTEND — React 19 + Vite + TypeScript

**Raiz:** `src/public/frontend/Projeto55100App/`

> Instruções detalhadas de convenções React estão no CLAUDE.md do próprio frontend:
> `src/public/frontend/Projeto55100App/CLAUDE.md`

### O que é Frontend

- SPA em React 19, bundlada com Vite 8.
- Consome exclusivamente a API REST do backend.
- O **deploy** consiste em rodar `npm run build` — o resultado em `dist/` é
  copiado para `src/public/` (servido pelo Nginx como arquivos estáticos).
- Durante o desenvolvimento, o servidor Vite roda na porta **5173**
  (HMR exposto na porta **55103** via Docker).

### Estrutura relevante

```
src/public/frontend/Projeto55100App/
├── src/
│   ├── components/   ← Componentes reutilizáveis (Bootstrap 5) — ver abaixo
│   ├── config/       ← constants.ts (URLs base, chaves fixas)
│   ├── contexts/     ← Context API (auth, tenant, theme)
│   ├── hooks/        ← Custom hooks
│   ├── pages/        ← Páginas por módulo
│   ├── routes/       ← Roteamento descentralizado por módulo
│   ├── services/     ← Chamadas à API (Fetch/Axios + token)
│   ├── store/        ← Estado global
│   ├── themes/       ← Temas visuais
│   ├── types/        ← Tipos TypeScript globais
│   └── utils/        ← Funções utilitárias
├── public/           ← Assets estáticos (copiados direto para dist/)
├── index.html        ← Entry point HTML do Vite
├── vite.config.ts
├── package.json
└── .env / .env.example
```

---

### ABSTRAÇÕES DO FRONTEND — REGRA INVIOLÁVEL

> **Toda lógica ou ação comum a mais de uma feature DEVE ser extraída para
> um CORE compartilhado** — hook em `hooks/`, utilitário em `utils/`, serviço
> em `services/`, ou componente em `components/`. Nunca duplicar lógica entre
> páginas ou features.

#### Componentes Bootstrap — Regra de Ouro

> **TODOS os componentes de UI são construídos para receber parâmetros via
> props tipadas (objeto JSON/TypeScript) e renderizar usando Bootstrap 5.**
> Nenhum componente embute valores literais de layout ou configuração — tudo
> vem de props. Isso vale sem exceção para todos os elementos abaixo.

Componentes que DEVEM existir em `components/` como wrappers parametrizáveis
(cada um recebe props tipadas e renderiza com Bootstrap 5):

**Dados / Tabelas**

- `TBody` — corpo de tabela, recebe colunas e linhas via props
- `TFooter` — rodapé de tabela, recebe totais/paginação via props

**Mídia**

- `Figure` — `<figure>` com `<figcaption>`, recebe `src`, `alt`, `caption`

**Controles de Formulário**

- `FormControl` — input/textarea Bootstrap, recebe `type`, `label`, `name`, validação
- `SelectControl` — `<select>` Bootstrap, recebe `options[]`, `label`, `name`
- `CheckRadio` — checkboxes e radios Bootstrap, recebe `items[]`, `type`, `name`
- `RangeControl` — `<input type="range">` Bootstrap, recebe `min`, `max`, `step`
- `InputGroup` — input group Bootstrap, recebe `prepend`, `append`, `input`
- `FloatingLabel` — floating label Bootstrap, recebe `label`, `input`
- `FormLayout` — layout de formulário Bootstrap (grid de colunas), recebe `fields[]`
- `FormValidation` — wrapper de validação Bootstrap, recebe `errors`, `children`

**Acordeão / Colapso**

- `Accordion` — recebe `items[]` com `id`, `title`, `body`, `expanded`
- `Collapse` — recebe `targetId`, `label`, `children`

**Feedback / Notificação**

- `Alert` — recebe `variant`, `message`, `dismissible`
- `Badge` — recebe `variant`, `text`, `pill`
- `Toast` — recebe `title`, `message`, `variant`, `autohide`, `delay`
- `Spinner` — recebe `variant`, `size`, `label`
- `Progress` — recebe `value`, `max`, `variant`, `striped`, `animated`
- `Placeholder` — recebe `lines`, `variant`, `animation`

**Navegação**

- `Breadcrumb` — recebe `items[]` com `label`, `href`, `active`
- `Navbar` — recebe `brand`, `links[]`, `variant`, `expand`
- `NavsTabs` — recebe `tabs[]` com `id`, `label`, `content`, `active`
- `Pagination` — recebe `currentPage`, `totalPages`, `onPageChange`
- `Scrollspy` — recebe `items[]`, `offset`

**Botões**

- `Button` — recebe `variant`, `size`, `label`, `onClick`, `disabled`, `type`
- `ButtonGroup` — recebe `buttons[]`, `size`, `vertical`
- `CloseButton` — recebe `onClick`, `disabled`, `ariaLabel`
- `Dropdown` — recebe `label`, `items[]` com `label`, `href`, `onClick`, `divider`

**Layout / Conteúdo**

- `Card` — recebe `header`, `body`, `footer`, `image`, `variant`
- `ListGroup` — recebe `items[]` com `label`, `active`, `disabled`, `badge`, `href`
- `Modal` — recebe `id`, `title`, `body`, `footer`, `size`, `scrollable`
- `Offcanvas` — recebe `id`, `title`, `body`, `placement`

**Mídia Interativa**

- `Carousel` — recebe `items[]` com `image`, `caption`, `alt`, `interval`

**Sobreposições**

- `Popover` — recebe `target`, `title`, `content`, `placement`, `trigger`
- `Tooltip` — recebe `target`, `content`, `placement`

#### Regras dos Componentes

1. **Props obrigatoriamente tipadas** — toda prop declarada com interface
   TypeScript em `types/` ou inline no próprio componente.
2. **Sem valores hardcoded internos** — cores, textos, classes extras, IDs:
   tudo via props com valores default razoáveis quando cabível.
3. **Sem lógica de negócio** — componentes renderizam; lógica vai em `hooks/`
   ou `services/`.
4. **Sem CSS inline** — estilização exclusivamente via classes Bootstrap +
   props de variante (ex.: `variant="danger"`).
5. **Sem duplicação** — se dois módulos precisam do mesmo comportamento de UI,
   o componente vai para `components/` e ambos importam daí.
6. **Sem CSS customizado** a menos que Bootstrap não atenda — e neste caso
   o estilo vai em um arquivo `.module.css` do componente, nunca global.

---

### Comandos Node.js

```powershell
# Dentro de: src/public/frontend/Projeto55100App/

npm install          # instalar dependências
npm run dev          # servidor de desenvolvimento (porta 5173)
npm run build        # gerar build de produção em dist/
npm run preview      # pré-visualizar o build localmente
npm run lint         # verificar erros de lint
```

### Deploy do Frontend

1. Rodar `npm run build` dentro de `src/public/frontend/Projeto55100App/`.
2. Copiar o conteúdo de `dist/` para `src/public/` (substituindo os arquivos
   anteriores, exceto `index.php` e `.htaccess` do CI4).
3. O Nginx serve os arquivos estáticos e redireciona `/api/` para o PHP-FPM.

---

## WebSocket — Node.js

**Raiz:** `docker/node/`

- Servidor Node.js independente, porta **3000**.
- Usado para comunicação em tempo real (não é o servidor de desenvolvimento React).
- O Nginx redireciona `/ws` → `http://node:3000`.
- Código de produção em `docker/node/server.js`.

---

## Infraestrutura Docker

```
docker/
├── nginx/default.conf   ← Proxy reverso (porta 80)
│                            /api/  → PHP-FPM (porta 9000)
│                            /ws    → Node.js (porta 3000)
│                            /      → arquivos estáticos (build React)
├── php/Dockerfile       ← PHP-FPM com extensões necessárias
├── node/Dockerfile      ← Node.js 20 Alpine (WebSocket)
└── mysql/init.sql       ← Script de inicialização do banco
```

---

## Fluxo de Trabalho Obrigatório — Planejamento e Registro

Aplicar em toda tarefa que envolva criação, edição ou exclusão de arquivos,
queries ou execução de comandos.

### Passo 1 — Propor o plano verbalmente

Antes de executar qualquer ação, apresentar em texto:

- Título e objetivo
- Passos planejados (tipo, alvo, motivo)
- Critérios de sucesso
- Riscos e rollback (quando aplicável)

### Passo 2 — Aguardar autorização

- "Sim" (ou equivalente) → prosseguir
- Ajustes → reformular e voltar ao Passo 1

### Passo 3 — Criar `_plano.json`

Após autorização:
`C:\laragon\www\Claude\plano\AAAAMMDDHHMMSS_titulo_plano.json`
Seguindo o modelo: `C:\laragon\www\Claude\plano\MODELO_plano.json`

### Passo 4 — Registrar ações não planejadas

Para cada ação não prevista no plano:
`C:\laragon\www\Claude\plano\AAAAMMDDHHMMSS_titulo_no_plano.json`
Seguindo o modelo: `C:\laragon\www\Claude\plano\MODELO_no_plano.json`

### Passo 5 — Encerrar

Confirmar conclusão e listar os arquivos do plano gerados.

---

## Regras Gerais

- Não editar `src/system/` (core do CI4).
- Não commitar `src/writable/` nem `node_modules/`.
- Credenciais somente em `.env` — nunca em código ou arquivos versionados.
- Antes de qualquer comando destrutivo, pedir confirmação explícita.
- Preservar nomenclatura e convenções já adotadas no projeto.
