# CLAUDE.md — Frontend Web (React / TypeScript)

---

> ## ⚠️ FLUXO DE PLANEJAMENTO OBRIGATÓRIO
>
> Este arquivo é complementar ao **CLAUDE.md raiz** do projeto.
> O fluxo de planejamento e os modelos de JSON são definidos lá e devem ser
> seguidos **à risca** em qualquer tarefa que envolva criar, editar ou excluir arquivos.
>
> **Regras completas:**
> `C:\laragon\www\php\habilidade\projeto55100\CLAUDE.md`
> → Seção: *"Fluxo de Trabalho Obrigatório — Planejamento e Registro"*
>
> **Modelo do plano principal** (`_plano.json` — com estimativa APF/IFPUG):
> `src/writable/claude/AAAAMMDDHHMMSS_nome_plano.json`
>
> **Modelo do registro pós-execução** (`_no_plano.json` — ações não planejadas):
> `src/writable/claude/AAAAMMDDHHMMSS_nome_no_plano.json`
>
> **Sequência obrigatória:**
> 1. Criar `_plano.json` com estimativa em Pontos de Função
> 2. Apresentar o plano e aguardar aprovação explícita
> 3. Executar somente o que foi aprovado
> 4. Se surgir algo não previsto → criar `_no_plano.json`

---

Instruções específicas do frontend web Projeto55100App.
Carregado automaticamente ao trabalhar neste diretório.

---

## Separação Frontend / Backend

- Backend expõe **apenas APIs REST** sob `/api/v1/...`
- Frontend consome APIs via Bearer Token: `Authorization: Bearer {token}`
- Login: `POST /api/v1/auth/login` → token retornado e armazenado
- Rotas públicas: login, registro, recuperação de senha, `contact_us`
- Rotas privadas: guard verifica token antes de renderizar
- Frontend nunca contém lógica de banco de dados

---

## Estrutura de Diretórios

```
src/
├── components/   ← Componentes reutilizáveis (Bootstrap)
├── config/       ← constants.ts (variáveis fixas do projeto)
├── contexts/     ← Context API (auth, tenant, theme)
├── hooks/        ← Custom hooks reutilizáveis
├── pages/        ← Páginas por módulo
├── routes/       ← Rotas descentralizadas por módulo
├── services/     ← Chamadas à API (Axios/Fetch com token)
├── store/        ← Estado global (Redux/Zustand)
├── themes/       ← Temas visuais
├── types/        ← Tipos TypeScript globais
└── utils/        ← Funções utilitárias
```

---

## Convenções

### Estilo / CSS

- **Bootstrap 5.3.8** como framework CSS principal — 99.9% Bootstrap
- CSS customizado somente quando Bootstrap não atende — 0.01% máximo
- Bootstrap importado no `main.tsx` (CSS + JS bundle)
- Nunca estilos inline ou CSS redundante

### Componentes

- Componentes reutilizáveis em `components/` com props bem tipadas
- Nunca duplicar componentes entre módulos
- Nunca embutir lógica de negócio em componentes de UI — usar `hooks/` ou `services/`

### Rotas

- **Rotas descentralizadas** — cada módulo define seu próprio arquivo em `routes/`
- O roteador principal importa os arquivos de rota de cada módulo
- Facilita atualizações evolutivas sem impactar outros módulos

### API e Estado

- Chamadas à API centralizadas em `services/` com interceptors para injeção do token
- Variáveis fixas em `src/config/constants.ts`
- Variáveis de segurança/permissão vêm da sessão pós-login
- Sem `.env` no frontend
