# Análise do Projeto React/TypeScript

> **Data da análise:** 2026-04-12

---

## Stack Tecnológica

| Categoria | Tecnologia | Versão |
|---|---|---|
| Framework | React | 19.2.4 |
| Linguagem | TypeScript | latest |
| Roteamento | React Router DOM | 7.14.0 |
| Build Tool | Vite | 8.0.4 |
| Gerenc. de Estado | Redux Toolkit | (planejado) |
| Cliente HTTP | Axios | (previsto) |
| Estilização | CSS + CSS Modules | nativo |
| Qualidade de Código | ESLint | 9.39.4 |

---

## Estrutura do Projeto

```
src/
├── assets/                   # Fontes, ícones, imagens, estilos globais
├── components/
│   ├── common/               # DataTable, FormBuilder, FilterPanel, StatusBadge, DocumentViewer
│   ├── layout/               # Header, Sidebar, Footer, Breadcrumb, PageContainer
│   └── ui/                   # Button, Input, Modal, Table, Select, DatePicker, FileUpload…
├── config/                   # apiConfig, appConfig, themeConfig
├── contexts/                 # AuthContext, ThemeContext, NotificationContext, LoadingContext
├── hooks/                    # useApi, useAuth, useForm, useDebounce, useLocalStorage, useModal, usePagination
├── pages/                    # Auth, Dashboard, Home, Tarefas, Usuarios, Estoque, Mecanica,
│                             # GestaoDocumental, Veterinaria, Configuracoes, ModuloTeste
├── routes/                   # AppRoutes.tsx + sub-rotas por módulo (PrivateRoutes / PublicRoutes)
│   └── components/           # PrivateRoute, PublicRoute, RouteGuard
├── services/
│   ├── api/                  # axiosConfig, interceptors
│   └── modules/              # authService, userService, estoqueService, tarefasService…
├── store/
│   ├── store.ts
│   └── slices/               # authSlice, userSlice, uiSlice + 1 slice por módulo de negócio
├── types/                    # api.types, user.types, global.types
├── utils/
│   ├── constants/            # apiEndpoints, permissions, routes, statusCodes
│   └── helpers/              # formatters, validators, dateHelpers, stringHelpers, fileHelpers
├── App.tsx
├── main.tsx
└── index.css
```

---

## Entrypoints

- **`index.html`** — SPA root com `<div id="root">`, carrega `/src/main.tsx`.
- **`main.tsx`** — `createRoot` + `<StrictMode>` renderiza `<App>`.
- **`App.tsx`** — Componente raiz mínimo, delega direto para `<AppRoutes />`.

---

## Roteamento

- Utiliza **`HashRouter`** (hash-based: `#/path`).
- Módulos possuem arquivos separados de `PrivateRoutes.tsx` e `PublicRoutes.tsx`.
- `RouteGuard` + hook `useRoutePermission` controlam acesso por permissão.
- Rotas ativas no momento: `/` (Home) e `/modulo-teste/ola-mundo` (OlaMundo).
- Módulos com estrutura de rotas criada (pendentes de implementação):
  Auth, Dashboard, Tarefas, Usuarios, Estoque, Mecanica, GestaoDocumental, Veterinaria, Configuracoes.

---

## Gerenciamento de Estado

| Mecanismo | Uso |
|---|---|
| **Redux Toolkit** (store + slices) | Estado global por domínio de negócio |
| **Context API** | Auth, Tema, Notificações, Loading |
| **Custom Hooks** | `useForm`, `useModal`, `useLocalStorage` |

---

## Estilização

- **CSS Modules** (`.module.css`) em cada componente para escopo local.
- **CSS Variables** em `assets/styles/variables.css` como design tokens.
- **Suporte a tema escuro** via variáveis CSS (`.home-page.dark`).
- **Responsividade** com media queries (`max-width: 1024px`).

---

## Integração com API

```
Page Component → Custom Hook (useApi) → Service Module → Axios (interceptors) → API
      ↑                                                          ↓
Redux Slice  ←←←←←←←←←←←←←←←←←←←←←←←←←←← Response
```

- Endpoints centralizados em `utils/constants/apiEndpoints.ts`.
- Interceptors tratam injeção de token, erros e transformação de resposta.

---

## Testes

- Diretórios criados: `tests/unit/`, `tests/integration/`, `tests/e2e/`.
- Nenhum teste implementado ainda. Framework de teste não definido no `package.json`.

---

## Padrões de Arquitetura

1. **Arquitetura modular** — organização por domínio de negócio.
2. **Separação de responsabilidades** — serviços, componentes, estado e rotas isolados.
3. **Hierarquia de componentes** — UI → Layout → Pages.
4. **Type safety** — arquivos `.types.ts` dedicados por camada.
5. **Abstração de API** — camada de serviços desacopla componentes do HTTP.
6. **Roteamento baseado em permissão** — guards e hooks de permissão.
7. **Configuração centralizada** — diretório `config/` para ajustes globais.

---

## Estado Atual do Desenvolvimento

| Área | Status |
|---|---|
| Estrutura de pastas e scaffold | Completo |
| Configuração de build (Vite + ESLint) | Completo |
| Página Home e ModuloTeste/OlaMundo | Implementado |
| Componentes UI/Layout/Common | Estrutura criada, implementação pendente |
| Contexts e Custom Hooks | Estrutura criada, implementação pendente |
| Services e Axios | Estrutura criada, implementação pendente |
| Redux Store e Slices | Estrutura criada, implementação pendente |
| Route Guards e Permissões | Estrutura criada, implementação pendente |
| Testes | Não iniciado |

> O projeto está em fase de **scaffolding concluído**. A infraestrutura central está montada; a maior parte da implementação de features está pendente.

---

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
