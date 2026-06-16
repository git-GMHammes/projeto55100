# field_checkbox.js — fábrica de grupo de checkboxes (frontend)

Factory para criação de **grupos de checkboxes** com múltipla seleção simultânea, aplicando:

- N opções configuráveis via `data-options` (JSON inline)
- notação `name[]` para envio de múltiplos valores ao backend (PHP recebe array)
- layout empilhado (padrão) ou inline (`data-inline="true"`)
- pré-seleção independente por opção via `checked: true`
- validação: exige ao menos uma opção marcada quando `Required`
- controles de acesso (Disabled, Required)

---

## 1) Atributos padrão

```js
const defaultCheckboxAttributes = {
    legend: "Título do Grupo",
    legendClass: "form-check fw-semibold d-block",
    wrapperClass: "mb-1",
    name: "checkbox_group",
    inline: false,
    Disabled: false,
    Required: false,
    options: [
        { id: "check_1", value: "opcao1", label: "Opção 1", checked: true },
        { id: "check_2", value: "opcao2", label: "Opção 2" }
    ]
};
```

### Significado de cada atributo

| Atributo       | Tipo    | Descrição                                                      |
| -------------- | ------- | -------------------------------------------------------------- |
| `legend`       | string  | Texto da legenda/título do grupo                               |
| `legendClass`  | string  | Classe CSS do elemento de legenda (`<label>`)                  |
| `wrapperClass` | string  | Classe CSS do container externo                                |
| `name`         | string  | Nome base do grupo — enviado como `name[]` para o backend      |
| `inline`       | boolean | `true` = checkboxes lado a lado; `false` = empilhados (padrão) |
| `Disabled`     | boolean | Desabilita todos os checkboxes do grupo (padrão: `false`)      |
| `Required`     | boolean | Exige ao menos uma opção marcada (padrão: `false`)             |
| `options`      | array   | Array de objetos `{ id, value, label, checked? }` (ver abaixo) |

### Estrutura de cada opção (`options`)

| Campo     | Tipo    | Obrigatório | Descrição                                      |
| --------- | ------- | ----------- | ---------------------------------------------- |
| `id`      | string  | Sim         | ID único do `<input>` e do `<label for="...">` |
| `value`   | string  | Sim         | Valor enviado ao backend quando marcado        |
| `label`   | string  | Sim         | Texto exibido ao lado do checkbox              |
| `checked` | boolean | Não         | `true` para pré-marcar (padrão: `false`)       |

---

## 2) Notação `name[]` e envio ao backend

O componente gera automaticamente `name[]` (com colchetes) em todos os inputs:

```html
<input type="checkbox" name="categorias[]" value="A">
<input type="checkbox" name="categorias[]" value="B">
<input type="checkbox" name="categorias[]" value="C">
```

No submit do formulário, o PHP recebe:

```php
// Se A e C estão marcados:
$_POST['categorias'] = ['A', 'C'];
```

No CakePHP, via `$this->request->getData('categorias')`, retorna o array de valores marcados.

---

## 3) Como usar

### HTML mínimo

```html
<form>
    <div class="field_checkbox"
         data-legend="Selecione as opções"
         data-name="opcoes"
         data-required="true"
         data-options='[{"id":"op1","value":"a","label":"Opção A"},{"id":"op2","value":"b","label":"Opção B"}]'>
    </div>
</form>
```

**Atenção:** o atributo `data-options` deve ser JSON válido com aspas duplas internas. Use aspas simples no atributo HTML externo.

---

## 4) Exemplos práticos

### Exemplo 1: Grupo simples obrigatório

```html
<div class="field_checkbox col-md-6"
     data-legend="Tipo de Transporte"
     data-name="tipo_transporte"
     data-required="true"
     data-options='[
         {"id":"tr_aereo","value":"aereo","label":"Aéreo"},
         {"id":"tr_terrestre","value":"terrestre","label":"Terrestre"},
         {"id":"tr_maritimo","value":"maritimo","label":"Marítimo"}
     ]'>
</div>
```

### Exemplo 2: Grupo com pré-seleção de múltiplas opções

```html
<div class="field_checkbox col-md-6"
     data-legend="Documentos Apresentados"
     data-name="documentos"
     data-options='[
         {"id":"doc_rg","value":"rg","label":"RG","checked":true},
         {"id":"doc_cpf","value":"cpf","label":"CPF","checked":true},
         {"id":"doc_ctps","value":"ctps","label":"CTPS","checked":false}
     ]'>
</div>
```

### Exemplo 3: Layout inline (lado a lado)

```html
<div class="field_checkbox col-md-12"
     data-legend="Dias da Semana"
     data-name="dias"
     data-inline="true"
     data-options='[
         {"id":"dia_seg","value":"seg","label":"Seg"},
         {"id":"dia_ter","value":"ter","label":"Ter"},
         {"id":"dia_qua","value":"qua","label":"Qua"},
         {"id":"dia_qui","value":"qui","label":"Qui"},
         {"id":"dia_sex","value":"sex","label":"Sex"}
     ]'>
</div>
```

### Exemplo 4: Grupo desabilitado

```html
<div class="field_checkbox col-md-6"
     data-legend="Benefícios (somente leitura)"
     data-name="beneficios"
     data-disabled="true"
     data-options='[
         {"id":"ben_vale","value":"vale","label":"Vale Transporte","checked":true},
         {"id":"ben_plano","value":"plano","label":"Plano de Saúde","checked":true},
         {"id":"ben_ticket","value":"ticket","label":"Ticket Alimentação"}
     ]'>
</div>
```

### Exemplo 5: Checkbox com única opção (flag booleana)

```html
<div class="field_checkbox col-md-12"
     data-legend=""
     data-name="aceite_termos"
     data-required="true"
     data-options='[
         {"id":"aceite","value":"1","label":"Declaro que li e concordo com os termos e condições."}
     ]'>
</div>
```

### Exemplo 6: Formulário completo com checkbox + outros campos

```html
<form class="row">
    <div class="field_input col-md-6"
         data-label="Nome"
         data-id="nome"
         data-name="nome"
         data-required="true">
    </div>

    <div class="field_checkbox col-md-6"
         data-legend="Modalidades de Interesse"
         data-name="modalidades"
         data-required="true"
         data-inline="true"
         data-options='[
             {"id":"mod_1","value":"presencial","label":"Presencial"},
             {"id":"mod_2","value":"online","label":"Online"},
             {"id":"mod_3","value":"hibrido","label":"Híbrido"}
         ]'>
    </div>

    <div class="col-12 mt-3">
        <button type="submit" class="btn btn-primary">Enviar</button>
    </div>
</form>
```

---

## 5) Comportamento de validação

### Quando é validado

- `change` — a cada marcação/desmarcação de qualquer checkbox do grupo
- Na inicialização (ao carregar o script) — valida estado inicial

### Regra de validação

Quando `Required = true`, o componente verifica se ao menos um checkbox está marcado. Se nenhum estiver:

- Todos os checkboxes recebem a classe `.is-invalid` (borda vermelha)
- Mensagem exibida: `Selecione ao menos uma opção em "Título do Grupo".`
- Ao marcar qualquer opção, a classe `.is-invalid` é removida de todos

### Feedback visual

- Classe `.is-invalid` nos checkboxes com erro
- `<small class="text-danger">` com `font-size: 0.7rem`, `font-style: italic`
- Asterisco vermelho (`*`) na legenda quando `Required`

---

## 6) Estrutura HTML gerada

```html
<!-- data-legend="Tipo de Transporte", data-name="tipo_transporte", data-required="true" -->
<div class="mb-1">
    <label class="form-label fw-semibold d-block">
        Tipo de Transporte <span class="text-danger">*</span>
    </label>
    <div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox"
                   id="tr_aereo" name="tipo_transporte[]" value="aereo">
            <label class="form-check-label" for="tr_aereo">Aéreo</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="checkbox"
                   id="tr_terrestre" name="tipo_transporte[]" value="terrestre">
            <label class="form-check-label" for="tr_terrestre">Terrestre</label>
        </div>
    </div>
    <small class="text-danger d-block" style="font-size:0.7rem;font-style:italic;line-height:1.2;margin-top:2px"></small>
</div>
```

Com `data-inline="true"`, cada `<div class="form-check">` recebe a classe adicional `form-check-inline`.

---

## 7) Leitura dos valores marcados via JavaScript

```js
// Coletar todos os valores marcados de um grupo
var marcados = Array.from(
    document.querySelectorAll('input[name="tipo_transporte[]"]:checked')
).map(function (el) { return el.value; });

// marcados = ['aereo', 'terrestre']
```

---

## 8) Normalização de atributos

| `data-*`        | Propriedade interna |
| --------------- | ------------------- |
| `data-disabled` | `Disabled`          |
| `data-required` | `Required`          |
| `data-inline`   | `inline`            |
| `data-options`  | `options` (JSON)    |

Os atributos `Disabled` e `Required` aceitam: `"true"` / `"false"` / `"1"` / `"0"`.

---

## 9) Diferença entre Checkbox e Radio

| Característica        | `field_checkbox.js`    | `field_radio.js`            |
| --------------------- | ---------------------- | --------------------------- |
| Seleção simultânea    | Múltipla (N opções)    | Exclusiva (1 opção por vez) |
| Formato de envio      | `name[]` → array       | `name` → valor único        |
| PHP recebe            | `array`                | `string`                    |
| `checked` por opção   | Independente por opção | Independente por opção      |
| Validação obrigatória | Ao menos 1 marcada     | Obrigatório 1 marcado       |

---

## 10) Dicas práticas

✅ Use IDs únicos por opção — o `<label for="...">` depende do ID para funcionar  
✅ Use `data-inline="true"` para grupos com muitas opções curtas (dias, turnos)  
✅ Combine com `field_radio.js` quando precisar de seleção exclusiva no mesmo formulário  
✅ Para flags booleanas (aceite de termos), use um grupo com uma única opção  

❌ Não omita o campo `id` dentro de cada opção — a validação e o `<label>` dependem dele  
❌ Não use aspas duplas dentro do JSON do `data-options` sem escapar o atributo HTML externo  
❌ Não use para seleção exclusiva — use `field_radio.js` nesse caso  

---

## 11) Dependências

- Bootstrap 5 (`form-check`, `form-check-inline`, `form-check-input`, `form-check-label`, `is-invalid`, `text-danger`)
- JavaScript ES6+ (classes, spread operator, template literals, JSON.parse)

---

## 12) Compatibilidade

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 não suportado (usa ES6)

# 📋 CheckboxField Component

> Componente JavaScript leve para renderização dinâmica de grupos de checkboxes com validação integrada e estilo Bootstrap 5.

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap">
  <img src="https://img.shields.io/badge/PHP-Ready-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP Ready">
</p>

---

## 📑 Índice

- [Visão Geral](#-visão-geral)
- [Como Funciona](#-como-funciona)
- [Estrutura do Código](#-estrutura-do-código)
  - [1. Atributos Padrão](#1-objeto-de-atributos-padrão)
  - [2. Classe `CheckboxField`](#2-classe-checkboxfield)
  - [3. Método `render()`](#3-método-render)
  - [4. `normalizeCheckboxBoolean`](#4-normalizecheckboxboolean)
  - [5. `normalizeCheckboxDataset`](#5-normalizecheckboxdataset)
  - [6. `attachCheckboxValidation`](#6-attachcheckboxvalidation)
  - [7. IIFE de Inicialização](#7-iife-final--o-bootstrap-do-componente)
- [Exemplo de Uso](#-exemplo-de-uso)
- [Pontos de Atenção](#-pontos-de-atenção)

---

## 🎯 Visão Geral

Esse código é um componente JavaScript que renderiza dinamicamente grupos de checkboxes estilizados com **Bootstrap** a partir de elementos HTML marcados com a classe `field_checkbox`.

A ideia central é a mesma de um **Web Component caseiro**: você coloca um `<div class="field_checkbox" data-...="...">` no formulário, e o script transforma isso em HTML completo de checkboxes funcionais, com validação acoplada automaticamente.

---

## ⚙️ Como Funciona

O fluxo de execução pode ser resumido em três etapas:

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌──────────────────────────┐
│   HTML com data-*       │ ──▶ │  Script lê + normaliza  │ ──▶ │  HTML Bootstrap renderi- │
│  <div class="field_     │     │   atributos e options   │     │  zado com validação      │
│      checkbox" ...>     │     │                         │     │  acoplada                │
└─────────────────────────┘     └─────────────────────────┘     └──────────────────────────┘
```

---

## 🧩 Estrutura do Código

### 1. Objeto de atributos padrão

```js
const defaultCheckboxAttributes = { ... }
```

Funciona como um **fallback** — define os valores que serão usados caso o desenvolvedor não passe nada via `data-*`. Destaques importantes:

| Atributo                 | Função                                                                |
| ------------------------ | --------------------------------------------------------------------- |
| `name: "checkbox_group"` | Nome do campo no formulário                                           |
| `inline: false`          | Se `true`, renderiza os checkboxes lado a lado (`form-check-inline`)  |
| `Disabled` / `Required`  | Iniciais maiúsculas propositais (veja seção 5)                        |
| `options`                | Array de objetos com `id`, `value`, `label` e opcionalmente `checked` |

> ⚠️ A convenção `Disabled` e `Required` com inicial maiúscula é incomum, e isso explica a existência da função `normalizeCheckboxDataset` mais adiante — há uma conversão proposital para evitar conflito com atributos HTML nativos.

---

### 2. Classe `CheckboxField`

```js
class CheckboxField {
    constructor(attributes) {
        this.attributes = { ...defaultCheckboxAttributes, ...attributes };
        ...
    }
}
```

O construtor usa **spread operator** para mesclar os defaults com o que vier do usuário (o que vier depois sobrescreve).

Em seguida, faz uma proteção interessante:

```js
if (typeof this.attributes.options === 'string') {
    try {
        this.attributes.options = JSON.parse(this.attributes.options);
    } catch (e) { ... }
}
```

Isso é necessário porque, quando você lê `data-options='[{"id":"...",...}]'` do HTML, o navegador entrega uma **string**, não um array. O `JSON.parse` converte para o array de objetos esperado. O bloco `try/catch` garante que, se o JSON estiver malformado, o componente cai no padrão em vez de quebrar a página.

---

### 3. Método `render()`

É onde a mágica acontece — monta a string HTML do grupo. Ponto-chave a observar:

```js
const inputName = `${name}[]`;
```

Essa notação de **colchetes** é específica para o PHP receber múltiplos valores marcados como um array via `$_POST['checkbox_group']`. Se você omitisse `[]`, o PHP só veria o último checkbox marcado.

#### Camadas do HTML gerado

```
┌─ wrapper externo (mb-1)
│  ├─ <label> do grupo + asterisco vermelho (se required)
│  ├─ container interno
│  │   ├─ <div class="form-check"> com input + label  (× N opções)
│  │   └─ ...
│  └─ <small class="text-danger"> área de feedback de erro
└─
```

O asterisco vermelho de obrigatório só é adicionado quando `isRequired` é verdadeiro:

```js
const requiredMark = isRequired ? ' <span class="text-danger">*</span>' : '';
```

---

### 4. `normalizeCheckboxBoolean`

Função utilitária que resolve um problema **clássico** de `data-*` attributes: tudo que vem deles é **string**.

> 🐛 **O bug que essa função previne:** `data-required="false"` no HTML chega como a string `"false"`, que em JavaScript é **truthy** (porque qualquer string não vazia é truthy). Isso causaria comportamento absurdo — um campo marcado como `data-required="false"` seria tratado como obrigatório.

A função normaliza:

| Entrada                   | Saída               |
| ------------------------- | ------------------- |
| `"true"`, `"1"`, `true`   | `true`              |
| `"false"`, `"0"`, `false` | `false`             |
| `undefined`, `null`, `""` | valor do `fallback` |
| qualquer outro            | `Boolean(value)`    |

É uma defesa explícita contra esse comportamento traiçoeiro do JavaScript.

---

### 5. `normalizeCheckboxDataset`

```js
if (key === 'disabled') {
    normalized['Disabled'] = dataset[key];
} else if (key === 'required') {
    normalized['Required'] = dataset[key];
}
```

Aqui está a resposta para a inicial maiúscula estranha. O `dataset` do DOM converte `data-disabled` para `disabled` (camelCase). O autor renomeia para `Disabled` / `Required` provavelmente para:

- Evitar conflito com propriedades nativas do DOM
- Manter convenção interna do projeto

Os demais atributos passam direto sem alteração.

---

### 6. `attachCheckboxValidation`

Adiciona a lógica de **validação reativa**:

```js
container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', runValidation);
});
runValidation();
```

Cada checkbox dispara `runValidation` ao mudar de estado. A função verifica se existe **pelo menos um** marcado; se não:

- Escreve a mensagem na `<small>`
- Adiciona a classe `is-invalid` (Bootstrap pinta a borda de vermelho)

A chamada final fora do `forEach` valida o **estado inicial** — se carrega o formulário sem nada marcado e o campo é obrigatório, já mostra o erro imediatamente.

> 💡 A validação só é anexada se `Required` for `true`. Caso contrário, a função sai logo no início com `if (!isRequired) return;`.

---

### 7. IIFE final — o "bootstrap" do componente

```js
(function () {
    const fieldContainers = document.querySelectorAll('form .field_checkbox');
    fieldContainers.forEach(container => { ... });
})();
```

Uma **IIFE** (*Immediately Invoked Function Expression*) — função anônima que se executa sozinha assim que o script carrega. Ela:

1. Busca todos os `<div class="field_checkbox">` dentro de qualquer `<form>`
2. Lê os `data-*` de cada um (`container.dataset`)
3. Normaliza os atributos, instancia `CheckboxField` e substitui o conteúdo do container pelo HTML renderizado
4. Anexa a validação (se não estiver desabilitado)

O escopo da IIFE evita **poluir o escopo global** — `fieldContainers`, `rawDataset` etc. ficam isolados.

---

## 🚀 Exemplo de Uso

No HTML do seu formulário:

```html
<form>
    <div class="field_checkbox"
         data-legend="Selecione suas linguagens"
         data-name="linguagens"
         data-required="true"
         data-inline="true"
         data-options='[
             {"id":"l1","value":"php","label":"PHP"},
             {"id":"l2","value":"js","label":"JavaScript"},
             {"id":"l3","value":"py","label":"Python"}
         ]'>
    </div>

    <button type="submit" class="btn btn-primary">Enviar</button>
</form>

<script src="checkbox-field.js"></script>
```

O script lê isso e gera automaticamente todo o HTML Bootstrap com:

✅ Label do grupo + asterisco de obrigatório
✅ Checkboxes em linha
✅ Validação acoplada
✅ Área de feedback de erro
✅ Notação `name[]` pronta para o PHP

E no back-end PHP você recebe:

```php
$_POST['linguagens']; // ['php', 'js']  ← array com os valores marcados
```

---

## ⚠️ Pontos de Atenção

Algumas reflexões para evolução futura do componente:

### 🛡️ Sanitização de HTML

`legend`, `label` e `value` são interpolados direto na string HTML. Se algum desses valores vier de input não confiável, há risco de **XSS**.

```js
// ⚠️ valor de "legend" entra direto no HTML sem escape
html += `<label class="${legendClass}">${legend}${requiredMark}</label>`;
```

Como provavelmente são valores estáticos definidos por você no HTML/PHP, o risco é controlado — mas vale ter em mente para inputs vindos de banco de dados ou API externa.

### 🧹 `innerHTML` reescreve o container

Se precisar re-renderizar dinamicamente, os event listeners antigos ficam órfãos. Em SPA isso pode virar **memory leak**.

### 🔄 A IIFE roda só uma vez no load

Se você adicionar `.field_checkbox` dinamicamente depois (via AJAX, por exemplo), eles **não serão processados**. Daria pra extrair a lógica em uma função exportada e chamá-la sob demanda:

```js
// Sugestão de refator
window.initCheckboxFields = function (scope = document) {
    scope.querySelectorAll('form .field_checkbox').forEach(/* ... */);
};
initCheckboxFields(); // execução inicial
```

---

## 📝 Resumo

O código está **bem fatorado e modular**, com responsabilidades claramente separadas:

| Responsabilidade         | Onde mora                  |
| ------------------------ | -------------------------- |
| Renderização do HTML     | Classe `CheckboxField`     |
| Normalização de tipos    | `normalizeCheckboxBoolean` |
| Normalização de keys     | `normalizeCheckboxDataset` |
| Validação reativa        | `attachCheckboxValidation` |
| Inicialização automática | IIFE final                 |

É um excelente exemplo de como construir componentes reutilizáveis em JavaScript puro, sem depender de frameworks pesados, mantendo o HTML semântico e o back-end PHP feliz com a notação `name[]`.

---

<p align="center">
  <sub>Feito para concurso público e projetos full-stack 🇧🇷</sub>
</p>