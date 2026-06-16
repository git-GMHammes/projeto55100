# Projeto55100App — Guia de Desenvolvimento

Projeto frontend React localizado em:

```
C:\laragon\www\php\habilidade\projeto55100\src\public\frontend\Projeto55100App\
```

---

## Quick Start

```bash
cd C:\laragon\www\php\habilidade\projeto55100\src\public\frontend\Projeto55100App
npm install
cp .env.example .env
npm run dev
```

Acesse: **http://localhost:5173**

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js    | 18.x          |
| npm        | 9.x           |

Verificar versões instaladas:

```bash
node -v
npm -v
```

---

## Instalação

```bash
cd C:\laragon\www\php\habilidade\projeto55100\src\public\frontend\Projeto55100App
npm install
```

---

## Variáveis de ambiente

Copiar o arquivo de exemplo e ajustar os valores:

```bash
cp .env.example .env
```

Editar `.env` conforme o ambiente local. As variáveis definem, no mínimo, a URL base da API backend.

---

## Scripts disponíveis

| Comando           | Descrição                                     | URL padrão              |
|-------------------|-----------------------------------------------|-------------------------|
| `npm run dev`     | Servidor de desenvolvimento com HMR           | http://localhost:5173   |
| `npm run build`   | Build de produção em `dist/`                  | —                       |
| `npm run preview` | Visualizar o build de produção localmente     | http://localhost:4173   |
| `npm run lint`    | Verificar erros de lint com ESLint            | —                       |

### Desenvolvimento

```bash
npm run dev
```

O Vite inicia na porta **5173** por padrão. Qualquer alteração nos arquivos `.tsx`, `.ts` ou `.css` é refletida automaticamente no browser (HMR).

### Build de produção

```bash
npm run build
```

Gera os arquivos otimizados em `dist/`. Usar esse diretório para deploy.

### Preview do build

```bash
npm run preview
```

Serve o conteúdo de `dist/` localmente na porta **4173** para validar o build antes do deploy.

---

## Stack

| Tecnologia       | Versão | Finalidade                       |
|------------------|--------|----------------------------------|
| React            | 19.2.4 | Framework UI                     |
| TypeScript       | 6.x    | Tipagem estática                 |
| Vite             | 8.x    | Bundler e dev server             |
| React Router DOM | 7.x    | Roteamento client-side (SPA)     |
| Bootstrap        | 5.3.8  | Framework CSS principal          |
| D3               | 7.x    | Visualização de dados / mapa RJ  |
| shpjs            | 6.x    | Leitura de arquivos Shapefile    |

---

## Estrutura de pastas

```
Projeto55100App/
├── public/                  # Arquivos estáticos (favicon, manifest, maparj/)
├── src/
│   ├── assets/              # Imagens e estilos globais (variables.css, mixins.css)
│   ├── components/
│   │   ├── common/          # DataTable (com hook próprio)
│   │   ├── layout/          # Componentes de layout
│   │   └── ui/              # Button, Modal, FormGrid, MapaRJ
│   ├── config/              # apiConfig, appConfig, themeConfig, constants
│   ├── contexts/            # AuthContext, CepContext, LoadingContext, ThemeContext...
│   ├── hooks/               # useApi, useAuth, useForm, useDebounce, useModal...
│   ├── pages/
│   │   ├── Auth/            # Login, Register, ForgotPassword
│   │   ├── Dashboard/
│   │   ├── Home/
│   │   └── Usuarios/
│   ├── routes/              # AppRoutes.tsx + rotas por módulo (Auth, Dashboard...)
│   ├── services/
│   │   ├── api/             # axiosConfig, interceptors
│   │   └── modules/V1/      # authService, userService, cepService
│   ├── store/               # Redux: authSlice, uiSlice, userSlice
│   ├── themes/global/       # themeLight, themeDark, themeBlue, themeGreen...
│   ├── types/               # api.types, user.types, global.types
│   ├── utils/
│   │   ├── constants/       # apiEndpoints, permissions, routes, statusCodes
│   │   └── helpers/         # formatters, validators, dateHelpers, stringHelpers
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
├── .env
└── .env.example
```

---

## Integração com backend

A comunicação com o backend é feita via REST API. A URL base é configurada em `.env`.

- Todas as requisições autenticadas usam **Bearer Token** no header `Authorization`.
- Os interceptors do Axios (em `src/services/api/interceptors.ts`) injetam o token automaticamente.
- Os endpoints estão centralizados em `src/utils/constants/apiEndpoints.ts`.

Rotas da API seguem o padrão:

```
/api/v1/{recurso}
```

---

## Autenticação e rotas

- Rotas **públicas**: acessíveis sem token (ex.: `/login`, `/register`).
- Rotas **privadas**: protegidas pelo `RouteGuard` — redirecionam para `/login` se não autenticado.
- O estado de autenticação é gerenciado via `AuthContext` + `authSlice` (Redux).

---

## Temas

Seis variantes disponíveis, configuradas em `src/themes/global/`:

| Tema   | Arquivo        |
|--------|----------------|
| Light  | themeLight.ts  |
| Dark   | themeDark.ts   |
| Blue   | themeBlue.ts   |
| Green  | themeGreen.ts  |
| Purple | themePurple.ts |
| Red    | themeRed.ts    |

O tema ativo é controlado pelo `ThemeContext` e persiste via `localStorage`.

---

## Componentes de formulário com validação brasileira

O `FormGrid` em `src/components/ui/FormGrid/` inclui campos prontos para:
CEP, CPF, CNPJ, CNH, PIS, Placa, RENAVAM, Processo, Título Eleitoral, Telefone, Moeda, Data e Hora.

---

## Observações

- O projeto usa **CSS Modules** para escopo de estilos por componente.
- Variáveis CSS globais estão em `src/assets/styles/variables.css`.
- A pasta `src/data/ods/` contém arquivos de dados para o mapa RJ (D3 + shpjs).
- Nenhum framework de testes está configurado ainda.
