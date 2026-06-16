# field_select.js — Análise Detalhada

## Visão Geral

Componente JavaScript vanilla que implementa um campo **combobox** (select com busca em tempo real). Substitui o `<select>` nativo por uma combinação de `<input type="text">` + dropdown flutuante, mantendo um `<input type="hidden">` como valor real submetido no formulário.

Sem dependências externas além do Bootstrap (classes CSS). Integra opcionalmente com `SadHttp` para requisições autenticadas via Bearer token (JWT).

---

## Estrutura do Arquivo

| Elemento | Tipo | Responsabilidade |
|---|---|---|
| `defaultSelectAttributes` | `const object` | Valores padrão de todos os atributos configuráveis |
| `SelectField` | `class` | Lógica central do componente |
| `normalizeSelectBoolean` | `function` | Normaliza valores booleanos vindos de `dataset` (strings `"true"/"false"/"1"/"0"`) |
| `normalizeSelectDataset` | `function` | Converte `dataset` do DOM em objeto de atributos, renomeando `disabled`→`Disabled` e `required`→`Required` |
| IIFE auto-init | `(function(){})()` | Escaneia `.field_select` no DOM e inicializa uma instância por container |

---

## Atributos Configuráveis (`defaultSelectAttributes`)

| Atributo | Padrão | Descrição |
|---|---|---|
| `legend` | `"Título do Campo"` | Texto do `<label>` acima do campo |
| `legendClass` | `"form-label fw-semibold"` | Classes CSS do label |
| `wrapperClass` | `"mb-1"` | Classes CSS do container externo |
| `name` | `"select_field"` | Name do `<input type="hidden">` submetido no form |
| `placeholder` | `"Digite para pesquisar..."` | Placeholder do input de busca |
| `valueKey` | `"id"` | Chave do objeto JSON usada como value no hidden input |
| `labelKey` | `"nome"` | Chave do objeto JSON exibida no input de texto |
| `labelTemplate` | `""` | Template de label composto: `"{campo1} - {campo2}"` — sobrepõe `labelKey` quando definido |
| `src` | `""` | URL para carregar dados remotos (suporta JWT via `SadHttp`) |
| `options` | `[]` | Array inline de dados (alternativa ao `src`) |
| `maxVisible` | `150` | Máximo de `<option>` renderizadas por vez no dropdown |
| `rows` | `8` | Altura visível do `<select>` interno (`size` attribute) |
| `value` | `""` | Valor pré-selecionado na inicialização |
| `Disabled` | `false` | Desabilita interação (campo só exibe valor) |
| `Required` | `false` | Ativa validação obrigatória com feedback visual |
| `findSrc` | `""` | URL do endpoint POST `find` — usado como fallback quando o filtro local retorna vazio |
| `findColumn` | `""` | Nome da coluna enviada no body do POST: `{ "coluna": "expressao" }` |

---

## Estrutura HTML Gerada por `render()`

```
div.{wrapperClass}
├── label.{legendClass}                  ← se legend definida
│     └── span.text-danger (*)          ← se Required
└── div[position:relative]              ← wrapper do campo + dropdown
      ├── input[type=text].field-select-search   ← input de busca (visível)
      ├── button.field-select-clear              ← botão [×] absoluto (oculto por padrão)
      └── div.field-select-dropdown              ← dropdown flutuante (oculto por padrão)
            ├── select.field-select-list[size=rows]  ← lista de opções
            └── div.field-select-count               ← rodapé com contagem
input[type=hidden].field-select-value    ← valor real para o form
small.text-danger                        ← feedback de validação
```

O dropdown usa `position:absolute` com `z-index:1050`, portanto não afeta o fluxo do documento. O botão [×] usa `position:absolute` dentro do wrapper relativo para não alterar a altura do input.

---

## Fluxo de Inicialização (`init(container)`)

```
init()
 ├── _loadData()               ← carrega dados (src remoto ou options inline)
 ├── pré-seleção               ← se value definido, resolve label e preenche input
 ├── runValidation()           ← valida imediatamente se Required
 ├── (early return se Disabled)
 └── registra eventos:
       ├── focus  → openDropdown()
       ├── input  → debounce 180ms → openDropdown() (limpa seleção prévia)
       ├── change (select) → selectItem()
       ├── click (clearBtn) → clearSelection()
       ├── click (document) → closeDropdown() se fora do container
       ├── keydown Escape → closeDropdown() + blur
       └── blur (select) → setTimeout 150ms → closeDropdown() se foco saiu
```

O `setTimeout(150ms)` no blur do select existe para que o evento `change` do clique em um item seja processado antes do fechamento do dropdown.

---

## Método `_loadData()`

Prioridade de fonte de dados:

1. **`src` definido** → fetch autenticado via `SadHttp.get(src)` (injeta Bearer token)
   - Fallback para `fetch()` nativo se `SadHttp` não estiver disponível
   - Suporta respostas como array raiz, `{ data: [] }` ou `{ items: [] }`
2. **`options` inline** → usa diretamente o array (ou faz parse de JSON string vinda de `dataset`)

Em caso de erro no fetch, loga `console.warn` e define `_allData = []` sem lançar exceção.

---

## Método `_filterData(query)`

Busca **client-side** e **síncrona** sobre `_allData` (dados já em memória). Case-insensitive em:
1. Label resolvido (`_getLabel`)
2. Valor (`valueKey`)
3. Qualquer campo string do objeto (busca ampla)

Retorna todos os itens quando `query` é vazia/nula.

> **Importante:** `_filterData` opera exclusivamente sobre o cache local (`_allData`).
> - **Tabelas pequenas:** `src = get-no-pagination` traz tudo em memória — filtro client-side é suficiente, `findSrc` desnecessário.
> - **Tabelas grandes:** `src = get-all` (paginado, carga inicial limitada) — o filtro client-side cobre apenas os registros já carregados; quando retorna vazio, o fallback `_findData` busca no servidor via POST.

---

## Método `_findData(query)` ← fallback remoto

Disparado automaticamente por `renderOptions` quando `_filterData` retorna vazio **e** `findSrc` + `findColumn` estão configurados.

**Fluxo:**
```
_filterData(query) retornou [] ?
 └── sim + query não vazia + findSrc + findColumn definidos
       ├── exibe "Buscando..." no rodapé do dropdown
       ├── POST {findSrc}  body: { "{findColumn}": "query" }
       │     via SadHttp.post() (Bearer token) ou fetch() nativo
       ├── injeta os resultados em _allData (deduplicados por valueKey)
       │     → garante que _findByValue() funcione ao selecionar
       └── renderiza as opções encontradas
```

**Endpoint esperado:**
```
POST /api/v1/{modulo}/find?page=1&limit=3&sort=id&order=desc
Content-Type: application/json

{ "nome": "expressao digitada" }
```

Resposta aceita: array raiz, `{ data: [] }` ou `{ items: [] }`.

Os itens retornados pelo `find` são **persistidos em `_allData`** durante a sessão (cache incremental), portanto buscas subsequentes pelo mesmo valor já serão resolvidas client-side.

---

## Método `_getLabel(item)`

Se `labelTemplate` estiver definido, interpola `{campo}` com os valores do objeto:
```js
// labelTemplate: "{nome} - {codigo}"
// item: { nome: "João", codigo: "001" }
// resultado: "João - 001"
```
Caso contrário, retorna `item[labelKey]`.

---

## Renderização do Dropdown (`renderOptions`) — `async`

Função assíncrona que decide a origem dos dados antes de renderizar:

```
renderOptions(query)
 ├── _filterData(query)          → busca local em _allData
 ├── se vazio + findSrc/findColumn → _findData(query)  (POST remoto)
 └── renderiza <option> no selectEl
```

O item selecionado é **fixado no topo** com fundo azul claro (`#dbeafe`) e prefixo `✓`, seguido de um separador `disabled`. Os demais itens filtrados são renderizados até o limite `maxVisible`. O rodapé exibe:
- `"Buscando..."` enquanto aguarda resposta do `findSrc`
- `"X registros"` quando todos cabem
- `"Exibindo X de Y registros"` quando há truncamento

---

## API Pública

### `render() → string`
Retorna o HTML do componente. Deve ser inserido no container antes de `init()`.

### `async init(container)`
Inicializa eventos e carrega dados. Retorna uma Promise (exposta como `container._sfReady`).

### `setValue(val)`
Define o valor programaticamente após a inicialização. Busca o item em `_allData`, atualiza o hidden input e o input de busca. Não faz nada se o valor não for encontrado.

### `async reload()`
Recarrega os dados remotos via `_loadData()` sem perder a seleção atual. Re-resolve o label do item selecionado (útil após criar/renomear um registro).

---

## Auto-inicialização (IIFE)

```html
<!-- CASO 1 — Tabelas auxiliares pequenas (ex: tipos, status, categorias)
     Todos os registros cabem em memória sem problema.
     get-no-pagination traz tudo de uma vez → filtro client-side é suficiente.
     NÃO usar findSrc aqui. -->
<div class="field_select"
     data-name="tipo_id"
     data-legend="Tipo"
     data-src="/api/v1/tipos/get-no-pagination?sort=id&order=desc"
     data-value-key="id"
     data-label-key="nome"
     data-required="true">
</div>

<!-- CASO 2 — Tabelas grandes (ex: municípios, servidores, fornecedores)
     get-all carrega apenas os primeiros registros (carga inicial leve).
     Quando o filtro client-side retorna vazio, o findSrc (POST) busca no servidor.
     NÃO usar get-no-pagination aqui — travaria o navegador com milhares de registros. -->
<div class="field_select"
     data-name="municipio_id"
     data-legend="Município"
     data-src="/api/v1/municipios/get-all?page=1&limit=20&sort=id&order=desc"
     data-find-src="/api/v1/municipios/find?page=1&limit=3&sort=id&order=desc"
     data-find-column="nome"
     data-value-key="id"
     data-label-key="nome"
     data-required="true">
</div>
```

A IIFE varre todos os `.field_select` no DOM no momento em que o script é carregado. Para cada container:
- Expõe a instância em `container._sf`
- Expõe a Promise de inicialização em `container._sfReady`

Isso permite que scripts externos aguardem a inicialização antes de chamar `setValue`:
```js
await container._sfReady;
container._sf.setValue(123);
```

---

## Segurança

O método `_esc(str)` escapa `&`, `"`, `<`, `>` antes de inserir qualquer dado no HTML das `<option>`, prevenindo XSS via dados remotos maliciosos.

---

## Dependências

| Dependência | Obrigatória | Uso |
|---|---|---|
| Bootstrap 5 (CSS) | Sim | Classes `form-control`, `form-select`, `is-invalid`, `text-danger`, etc. |
| `SadHttp` | Não | Requisições autenticadas com Bearer token; fallback para `fetch` nativo |

---

## Pontos de Atenção / Possíveis Melhorias Futuras

- **Múltiplos campos na mesma página:** o listener `document.addEventListener('click', ...)` é registrado uma vez por instância; com muitos campos simultâneos acumula handlers no documento.
- **`rows` vs altura real:** o `size` do `<select>` controla linhas, mas a altura visual depende do font-size do browser. Considerar altura fixa em px para consistência cross-browser.
- **`labelTemplate` no filtro:** a busca filtra pelo label resolvido, mas não permite busca direta em campos não presentes em `labelKey` quando `labelTemplate` está ativo — a busca ampla em `Object.values` cobre isso parcialmente.
- **Accessibilidade:** o componente não implementa `aria-*` attributes (role combobox, aria-expanded, aria-activedescendant). Melhoria possível para conformidade WCAG.
- **`options` como JSON string:** o parse de `data-options` aceita JSON inline no HTML, mas strings grandes podem poluir o markup — preferir `src` para listas extensas.
