# README — Componente SEI (`field_sei.js` + `SadFmt.sei`)

## Visão Geral

O número SEI é o identificador de processo do Sistema Eletrônico de Informações.
Ele possui duas representações no sistema:

| Representação        | Formato                  | Chars | Exemplo                  |
| -------------------- | ------------------------ | ----- | ------------------------ |
| RAW (banco de dados) | `SEI15NNNNNNNNNN20NN`    | 19    | `SEI150016098306202026`  |
| DISPLAY (visual)     | `SEI-15NNNN/NNNNNN/20NN` | 22    | `SEI-150016/098306/2026` |

**Partes FIXAS** (nunca mudam):
- `SEI-15` → prefixo do órgão (raw: `SEI15`)
- `20` → início do ano (raw: `20`)

**Partes LIVRES** (dígitos inseridos pelo usuário):
- `NNNN` → 4 dígitos (ex: `0016`)
- `NNNNNN` → 6 dígitos (ex: `098306`)
- `NN` → 2 dígitos do ano (ex: `26` para 2026)

### Estrutura de posições — RAW (19 chars)

```
S E I 1 5 N N N N N N N N N N  2  0  N  N
0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18
└─────┘ └───────────────────┘ └──┘ └───────┘
 "SEI"    10 dígitos livres   "20"  2 dígitos
        └──────┘ └──────────┘
         4 dígitos  6 dígitos
```

### Estrutura de posições — DISPLAY (22 chars)

```
S E I - 1 5 N N N N  /  N  N  N  N  N  N  /  2  0  N  N
0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21
```

---

## Arquivos Envolvidos

| Arquivo                                             | Responsabilidade                                             |
| --------------------------------------------------- | ------------------------------------------------------------ |
| `webroot/js/sad/v1/form/field/field_sei.js`         | Componente de INPUT para formulários (create / update / get) |
| `webroot/js/sad/v1/core/fmt.js` → `SadFmt.sei(val)` | Formatação para exibição em listas e qualquer ponto da UI    |

---

## 1. Campo de Formulário — `field_sei.js`

### Como incluir no template PHP

Carregar o script **antes** do script da página, dentro do bloco de scripts:

```php
<?= $this->Html->script('sad/v1/form/field/field_sei', ['block' => 'scriptBottom']) ?>
```

### Estrutura HTML mínima

O componente é ativado automaticamente em qualquer `<div class="field_sei">` dentro de um `<form>`. Os dados de configuração são passados via atributos `data-*`.

```html
<div class="field_sei"
     data-id="numero_sei"
     data-name="numero_sei"
     data-label="Número SEI"
     data-required="true">
</div>
```

### HTML gerado pelo componente

```html
<div class="mb-1">
  <label for="numero_sei" class="form-label">
    Número SEI <span class="text-danger">*</span>
  </label>

  <!-- hidden: valor raw enviado ao backend / armazenado no BD -->
  <input type="hidden" id="numero_sei_raw" name="numero_sei"
         value="SEI150016098306202026">

  <!-- visível: input com máscara, NÃO enviado ao backend -->
  <input type="text" id="numero_sei" name="numero_sei_display"
         value="SEI-150016/098306/2026"
         placeholder="SEI-15____/______/20__"
         maxlength="22" autocomplete="off">

  <!-- feedback de validação (vazio quando válido) -->
  <small class="text-danger d-block" style="font-size:0.7rem;..."></small>
</div>
```

> **IMPORTANTE:**
> O `<input type="hidden">` carrega o `name` real do campo (ex: `numero_sei`) — esse vai para o backend.
> O `<input type="text">` visível usa o sufixo `_display` no `name` para **não conflitar** com o hidden no submit.
> O backend recebe apenas o hidden — valor raw, sem traço e sem barras.

### Atributos `data-*` disponíveis

| Atributo             | Tipo    | Padrão           | Descrição                        |
| -------------------- | ------- | ---------------- | -------------------------------- |
| `data-id`            | string  | `"fsei"`         | ID do input visível no DOM       |
| `data-name`          | string  | `"fsei"`         | `name` do hidden (enviado ao BD) |
| `data-label`         | string  | `"Número SEI"`   | Texto do `<label>`               |
| `data-label-class`   | string  | `"form-label"`   | Classe CSS do `<label>`          |
| `data-wrapper-class` | string  | `"mb-1"`         | Classe CSS do `<div>` externo    |
| `data-class`         | string  | `"form-control"` | Classe CSS do `<input>` visível  |
| `data-value`         | string  | `""`             | Valor raw inicial (pré-preenche) |
| `data-required`      | boolean | `false`          | Torna o campo obrigatório        |
| `data-readonly`      | boolean | `false`          | Campo somente leitura            |
| `data-disabled`      | boolean | `false`          | Campo desabilitado               |

Os booleanos aceitam: `"true"` / `"false"` / `"1"` / `"0"`

### Pré-preenchimento (páginas get / update)

Passar o valor raw via `data-value`. O componente converte automaticamente para a máscara no input visível e mantém o raw no hidden:

```html
<div class="field_sei"
     data-id="numero_sei"
     data-name="numero_sei"
     data-label="Número SEI"
     data-value="<?= h($entity->numero_sei) ?>">
</div>
```

### Campo readonly (páginas get / detalhes)

```html
<div class="field_sei"
     data-id="numero_sei"
     data-name="numero_sei"
     data-label="Número SEI"
     data-value="<?= h($entity->numero_sei) ?>"
     data-readonly="true">
</div>
```

### Campo desabilitado

```html
<div class="field_sei"
     data-id="numero_sei"
     data-name="numero_sei"
     data-label="Número SEI"
     data-disabled="true">
</div>
```

### Comportamento da máscara durante a digitação

1. Ao focar o campo vazio, o prefixo `SEI-15` é inserido automaticamente.
2. O usuário digita apenas os dígitos livres (`NNNN`, `NNNNNN` e `NN` do ano).
3. As barras `/` são inseridas automaticamente pela máscara.
4. As partes fixas `SEI-15` e `20` **não podem** ser apagadas com `Backspace` ou `Delete` — o `keydown` é bloqueado nessas posições.
5. A cada keystroke, o hidden input é atualizado com o valor raw.

### Validações automáticas

Aplicadas apenas em campos ativos (não `readonly` / `disabled`):

- **Campo obrigatório:** se `data-required="true"` e o campo estiver vazio.
- **Máscara incompleta:** se o usuário preencheu parcialmente (< 22 chars).
- O feedback aparece em `<small class="text-danger">` abaixo do input.
- A classe CSS `is-invalid` é adicionada ao input visível em caso de erro.
- A validação dispara nos eventos `input` e `blur`.

---

## 2. Formatação em Listas — `SadFmt.sei(val)`

### Como incluir no template PHP

O `fmt.js` é carregado globalmente na maioria das páginas via layout base.
Se não estiver disponível, incluir explicitamente:

```php
<?= $this->Html->script('sad/v1/core/fmt', ['block' => 'scriptBottom']) ?>
```

### Assinatura

```
SadFmt.sei(val: string) → string
```

| Entrada                   | Saída                                                 |
| ------------------------- | ----------------------------------------------------- |
| `'SEI150016098306202026'` | `'SEI-150016/098306/2026'`                            |
| `'SEI150001000001202099'` | `'SEI-150001/000001/2099'`                            |
| `''`                      | `'—'`                                                 |
| `null`                    | `'—'`                                                 |
| `undefined`               | `'—'`                                                 |
| `'INVALIDO'`              | `'INVALIDO'` *(retorna o original — fallback seguro)* |

### Uso típico em colunas de tabela

```js
// Dentro do callback de renderização de célula (ListFactory):
{
    data: 'numero_sei',
    render: function (val) {
        return SadFmt.sei(val);
    }
}

// Ou concatenado em template literal de linha:
'<td>' + SadFmt.sei(row.numero_sei) + '</td>'
```

---

## 3. Fluxo Completo — do Formulário ao Banco e de Volta à Lista

```
┌─────────────────────────────────────────────────────────────┐
│  FORMULÁRIO (create / update)                               │
│                                                             │
│  Usuário digita:  SEI-150016/098306/2026  (input visível)  │
│         ↓  [evento input → applySeiMask + seiMaskedToRaw]  │
│  Hidden sync:     SEI150016098306202026   (input hidden)   │
│         ↓  [form submit]                                    │
│  POST body:  numero_sei=SEI150016098306202026               │
│              (numero_sei_display ignorado pelo backend)     │
└─────────────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (CakePHP Request / Service)                        │
│                                                             │
│  Recebe:  numero_sei = "SEI150016098306202026"              │
│  Valida:  regex /^SEI15[0-9]{4}[0-9]{6}20[0-9]{2}$/       │
│  Salva:   BD armazena "SEI150016098306202026" (VARCHAR 19)  │
└─────────────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│  LISTAGEM (get_all)                                         │
│                                                             │
│  API retorna: { "numero_sei": "SEI150016098306202026" }     │
│  JS renderiza: SadFmt.sei('SEI150016098306202026')          │
│  Exibe: "SEI-150016/098306/2026"                            │
└─────────────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│  GET / UPDATE (pré-preenchimento)                           │
│                                                             │
│  Template PHP:  data-value="<?= h($entity->numero_sei) ?>" │
│  seiRawToMasked('SEI150016098306202026')                    │
│  Input visível exibe:  "SEI-150016/098306/2026"             │
│  Hidden mantém:        "SEI150016098306202026"              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Validação no Backend (CakePHP Request)

```php
$validator
    ->requirePresence('numero_sei', 'create')
    ->notEmptyString('numero_sei', 'Número SEI é obrigatório.')
    ->add('numero_sei', 'formatoSei', [
        'rule'    => ['custom', '/^SEI15[0-9]{4}[0-9]{6}20[0-9]{2}$/'],
        'message' => 'Número SEI inválido. Formato esperado: SEI15NNNNNNNNNN20NN.'
    ]);
```

O campo `numero_sei_display` **não deve** ser listado nos campos permitidos do Request (`allowedFields` / `_accessible`) — o backend deve ignorá-lo por completo.

**Tipo recomendado no banco:** `VARCHAR(19) NOT NULL`

---

## 5. Manutenção e Extensão

### 5.1 Alterar o prefixo fixo

O prefixo `SEI-15` / `SEI15` está hardcoded em múltiplos pontos.
Se precisar mudar, atualizar **todos** os locais:

| Arquivo        | Função                  | O que alterar                                       |
| -------------- | ----------------------- | --------------------------------------------------- |
| `field_sei.js` | `applySeiMask()`        | literal `'SEI-15'`                                  |
| `field_sei.js` | `seiMaskedToRaw()`      | literal `'SEI'` e `.replace('SEI-', '')`            |
| `field_sei.js` | `seiRawToMasked()`      | `.replace(/^SEI15/, '')`                            |
| `field_sei.js` | `handleSeiKeydown()`    | constante de posição (`pos <= 6`)                   |
| `field_sei.js` | `SeiField.render()`     | `placeholder` e literal `'SEI-15'`                  |
| `field_sei.js` | `attachSeiValidation()` | `SEI_FULL_LENGTH = 22`                              |
| `fmt.js`       | `sei()`                 | `.replace(/^SEI/i, '')` e `substring(0,2) !== '15'` |

### 5.2 Alterar o comprimento dos grupos de dígitos

Os grupos estão hardcoded como `4 / 6 / 2` dígitos livres.
Para alterá-los, ajustar os `slice` / `substring` em:

| Arquivo        | Função              | Trecho                                                          |
| -------------- | ------------------- | --------------------------------------------------------------- |
| `field_sei.js` | `applySeiMask()`    | `raw.slice(0,4)` / `raw.slice(4,10)` / `raw.slice(10,12)`       |
| `field_sei.js` | `seiRawToMasked()`  | idem                                                            |
| `field_sei.js` | `seiMaskedToRaw()`  | ajustar `stripped` conforme nova estrutura                      |
| `field_sei.js` | `SeiField.render()` | `maxlength` e `placeholder`                                     |
| `fmt.js`       | `sei()`             | `s.substring(2,6)` / `s.substring(6,12)` / `s.substring(12,16)` |

Lembrar de atualizar também `SEI_FULL_LENGTH` em `attachSeiValidation()` e o regex no Request CakePHP.

### 5.3 Adicionar novo formato de formatação global

Seguir o padrão de `fmt.js`:
1. Adicionar função privada dentro do IIFE: `function novaFuncao(val) { ... }`
2. Expor no objeto retornado: `return { ..., novaFuncao: novaFuncao };`
3. Documentar em `README_novoformato.md` seguindo este modelo

### 5.4 Adicionar novo tipo de campo input com máscara

Usar `field_sei.js` como modelo:
- Prefixar **todas** as funções internas com o nome do campo (ex: `cnj` → `cnjNormalize`, `cnjMask`, `cnjKeydown`…) — evita colisão de nomes no escopo global do navegador.
- Sempre gerar `<input type="hidden">` com o `name` real + input visível com `name_display`.
- Auto-inicializar via seletor `form .field_NOME` dentro de um IIFE.
- Nunca importar ou chamar funções de outros `field_*` diretamente.

---

## 6. Checklist de Integração em Novo Módulo

- [ ] **Template create:** incluir script `field_sei` + `div.field_sei` com `data-*`
- [ ] **Template update:** incluir `data-value="<?= h($entity->numero_sei) ?>"`
- [ ] **Template get:** incluir `data-readonly="true"` + `data-value`
- [ ] **Request CakePHP:** regex `/^SEI15[0-9]{4}[0-9]{6}20[0-9]{2}$/`
- [ ] **Request allowedFields:** **não** incluir `numero_sei_display`
- [ ] **Coluna no BD:** `VARCHAR(19) NOT NULL`
- [ ] **Listagem get_all:** renderizar coluna com `SadFmt.sei(val)`
- [ ] **fmt.js carregado:** confirmar que o template herda o script `core/fmt`
