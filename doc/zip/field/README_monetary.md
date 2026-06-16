# field_monetary.js — fábrica de campo monetário (frontend)

Factory especializada para entrada de **valores monetários no formato brasileiro** com:

- formatação automática (R$ 1.000,00) durante a digitação
- dois inputs gerados: display visível (BR) e hidden raw (para o backend)
- integração com `SadUtils.fillField` para preenchimento via API
- propagação de eventos para listeners externos (ex: `validarTotais`)
- controles de acesso (ReadOnly, Disabled, Required)

---

## 1) Atributos padrão

```js
const defaultMonetaryAttributes = {
    label: 'Valor',
    labelClass: 'form-label',
    wrapperClass: 'mb-1',
    class: 'form-control',
    id: 'monetary_field',
    name: 'monetary_field',
    value: '',
    ReadOnly: false,
    Disabled: false,
    Required: false
};
```

### Significado de cada atributo

| Atributo       | Tipo    | Descrição                                          |
| -------------- | ------- | -------------------------------------------------- |
| `label`        | string  | Texto do rótulo do campo                           |
| `labelClass`   | string  | Classe CSS do `<label>`                            |
| `wrapperClass` | string  | Classe CSS do container                            |
| `class`        | string  | Classe CSS do `<input>` visível                    |
| `id`           | string  | ID base do campo (usado no hidden e no display)    |
| `name`         | string  | Atributo `name` do hidden (enviado pelo form)      |
| `value`        | string  | Valor inicial em formato raw da API (ex: `171.14`) |
| `ReadOnly`     | boolean | Campo somente leitura                              |
| `Disabled`     | boolean | Campo desabilitado                                 |
| `Required`     | boolean | Campo obrigatório                                  |

---

## 2) Dois inputs gerados por campo

O componente sempre renderiza **dois** elementos `<input>` para cada campo monetário:

| Input           | ID             | Name     | Finalidade                                           |
| --------------- | -------------- | -------- | ---------------------------------------------------- |
| Display (texto) | `{id}_display` | —        | Exibe o valor formatado (BR). Não é enviado no form. |
| Hidden (raw)    | `{id}`         | `{name}` | Armazena o valor `1000.00`. Enviado pelo form.       |

```html
<!-- Input visível: exibe formato BR — sem name, não enviado pelo form -->
<input type="text" id="valor_display" class="form-control field-monetary-display" placeholder="0,00">

<!-- Input hidden: armazena valor raw — enviado pelo form -->
<input type="hidden" id="valor" name="valor" class="field-monetary-raw">
```

**Regra:** ao recuperar o valor para envio à API, use sempre `document.getElementById(id).value` (o hidden), não o display.

---

## 3) Como usar

### HTML básico

```html
<form>
    <div class="field_monetary"
         data-label="Valor da Diária"
         data-id="valor_diaria"
         data-name="valor_diaria"
         data-required="true">
    </div>
</form>
```

O script encontra automaticamente elementos com classe `.field_monetary` dentro de `<form>` e renderiza o campo completo.

---

## 4) Exemplos práticos

### Exemplo 1: Campo obrigatório

```html
<div class="field_monetary"
     data-label="Valor de Alimentação"
     data-id="valor_alimentacao"
     data-name="valor_alimentacao"
     data-required="true">
</div>
```

### Exemplo 2: Campo com valor inicial (vindo da API)

```html
<div class="field_monetary"
     data-label="Valor de Pousada"
     data-id="valor_pousada"
     data-name="valor_pousada"
     data-value="171.14">
</div>
```

*O valor `171.14` será automaticamente exibido como `171,14` no display.*

### Exemplo 3: Campo somente leitura

```html
<div class="field_monetary"
     data-label="Total Geral (somente leitura)"
     data-id="total_geral"
     data-name="total_geral"
     data-value="1229.18"
     data-readonly="true">
</div>
```

### Exemplo 4: Campo desabilitado

```html
<div class="field_monetary"
     data-label="Valor Antigo"
     data-id="valor_antigo"
     data-name="valor_antigo"
     data-value="500.00"
     data-disabled="true">
</div>
```

### Exemplo 5: Campo sem label

```html
<div class="field_monetary"
     data-id="valor_traslado"
     data-name="valor_traslado">
</div>
```

---

## 5) Formatação automática

### Como funciona

O campo aceita apenas **dígitos numéricos** e formata automaticamente no padrão centavo-primeiro (à direita):

```
Usuário digita: 4 7 3 4 0
Campo exibe:    0,04 → 0,47 → 4,73 → 47,34 → 473,40
```

### Separadores

| Separador | Posição | Exemplo    |
| --------- | ------- | ---------- |
| `,`       | Decimal | `1.229,18` |
| `.`       | Milhar  | `1.229,18` |

### Teclas aceitas no display

- Dígitos `0–9`
- `Backspace`, `Delete`
- Teclas de navegação: `Tab`, setas, `Home`, `End`
- Atalhos com `Ctrl` / `Cmd` (ex: `Ctrl+A`, `Ctrl+C`)

Qualquer outra tecla é bloqueada via `preventDefault`.

---

## 6) Funções de conversão internas

### `digitsToDisplay(digits)`

Converte string de dígitos para exibição BR (centavo primeiro).

```js
digitsToDisplay('47340')   // → '473,40'
digitsToDisplay('122918')  // → '1.229,18'
digitsToDisplay('')        // → ''
```

### `digitsToRaw(digits)`

Converte string de dígitos para valor raw enviado ao backend.

```js
digitsToRaw('47340')   // → '473.40'
digitsToRaw('122918')  // → '1229.18'
digitsToRaw('')        // → ''
```

### `rawToDigits(raw)`

Converte valor raw da API para string de dígitos.

```js
rawToDigits('171.14')   // → '17114'
rawToDigits('1000.00')  // → '100000'
rawToDigits('')         // → ''
rawToDigits(null)       // → ''
```

---

## 7) Integração com SadUtils.fillField

Para preencher o campo programaticamente (ex: após receber dados da API), use `SadUtils.fillField` com o **ID do hidden** (sem `_display`):

```js
SadUtils.fillField('valor_alimentacao', '171.14');
```

Internamente, isso dispara um evento `input` no rawInput (`#valor_alimentacao`), que aciona o handler:

```
rawInput.input event
    → rawToDigits('171.14')     → '17114'
    → digitsToDisplay('17114')  → '171,14'
    → displayInput.value = '171,14'
```

**Nunca use** `SadUtils.fillField` com o ID do display (`{id}_display`) — ele não tem handler de atualização do raw.

---

## 8) Propagação de eventos para listeners externos

Ao digitar no display, após atualizar o rawInput, o componente dispara dois eventos no rawInput:

```js
rawInput.dispatchEvent(new Event('input',  { bubbles: true }));
rawInput.dispatchEvent(new Event('change', { bubbles: true }));
```

Isso permite que código externo (ex: `validarTotais` em `create.js` / `update.js`) reaja à mudança de valor:

```js
document.getElementById('valor_alimentacao').addEventListener('change', function () {
    validarTotais();
});
```

---

## 9) Feedback visual

### Campo obrigatório vazio

- Classe `.is-invalid` no input display (borda vermelha Bootstrap)
- Mensagem: *`Campo "Valor de Alimentação" é obrigatório.`*
- Estilo: `font-size: 0.7rem`, `font-style: italic`, cor vermelha

### Campo válido

- Sem classe `.is-invalid`
- Mensagem de feedback vazia

### Quando é validado

- `input` — valida enquanto digita
- `blur` — valida ao sair do campo
- Na inicialização (ao carregar o script)

---

## 10) Estrutura HTML gerada

```html
<div class="mb-1">
    <label for="valor_display" class="form-label">Valor <span class="text-danger">*</span></label>
    <input type="text"   id="valor_display" class="form-control field-monetary-display" placeholder="0,00" autocomplete="off">
    <input type="hidden" id="valor"         name="valor" class="field-monetary-raw">
    <small class="text-danger d-block" style="font-size:0.7rem; font-style:italic;"></small>
</div>
```

---

## 11) Integração com formulários

### Valor enviado pelo form

O hidden (`field-monetary-raw`) envia o valor no formato `1229.18` (ponto decimal, sem separador de milhar):

```js
// Exemplo de dados coletados no submit
{
    valor_alimentacao: "171.14",
    valor_pousada:     "1229.18",
    total_geral:       "2000.00"
}
```

### Leitura direta por JavaScript

```js
var raw = document.getElementById('valor_alimentacao').value; // '171.14'
```

### Preenchimento programático (get / update)

```js
// Após receber dados da API
SadUtils.fillField('valor_alimentacao_calc', response.data.valor_alimentacao_calc);
SadUtils.fillField('valor_pousada_calc',     response.data.valor_pousada_calc);
```

---

## 12) Dicas práticas

✅ **Use `data-value`** com o valor raw da API (ex: `"171.14"`) — o componente formata automaticamente  
✅ **Ouça `change` no hidden** para reagir a mudanças de valor via listeners externos  
✅ **Use `data-readonly="true"`** para campos calculados que não devem ser editados  
✅ **Use `SadUtils.fillField(id, raw)`** para preencher após retorno da API  

❌ **Não leia o display** (`{id}_display`) para enviar ao backend — use sempre o hidden (`{id}`)  
❌ **Não use `data-value`** no formato BR (ex: `"1.229,18"`) — informe sempre o raw (`"1229.18"`)  
❌ **Não chame `SadUtils.fillField`** com o ID do display  

---

## 13) Limitações conhecidas

- ⚠️ Não suporta valores negativos
- ⚠️ Não suporta mais de 2 casas decimais
- ⚠️ Não formata valores colados via `Ctrl+V` além do que é digitado (paste não é tratado separadamente)

---

## 14) Dependências

- Bootstrap 5 (classes CSS: `form-control`, `is-invalid`, `text-danger`)
- JavaScript ES5+ (compatível com IIFE do SAD v1)

---

## 15) Compatibilidade

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 não suportado

---

## 16) Exemplos de conversão (referência rápida)

| Usuário digita | Display exibe  | Hidden envia |
| -------------- | -------------- | ------------ |
| `100`          | `1,00`         | `1.00`       |
| `47340`        | `473,40`       | `473.40`     |
| `122918`       | `1.229,18`     | `1229.18`    |
| `100000`       | `1.000,00`     | `1000.00`    |
| `200000000`    | `2.000.000,00` | `2000000.00` |
