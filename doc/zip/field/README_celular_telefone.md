# field_celular_telefone.js — fábrica de campo Celular / Telefone (frontend)

Factory especializada para entrada de **números de telefone brasileiros** com:

- máscara dinâmica: telefone fixo `(XX) XXXX-XXXX` (10 dígitos) ou celular `(XX) XXXXX-XXXX` (11 dígitos)
- validação de DDD contra a lista oficial ANATEL
- rejeição de letras e caracteres inválidos em tempo real
- controles de acesso (ReadOnly, Disabled, Required)

---

## 1) Atributos padrão

```js
const defaultCelularTelefoneAttributes = {
    label: "Celular / Telefone",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "text",
    id: "celular_telefone",
    name: "celular_telefone",
    value: "",
    placeholder: "(XX) XXXXX-XXXX",
    maxlength: "15",
    ReadOnly: false,
    Disabled: false,
    Required: false
};
```

### Significado de cada atributo

| Atributo       | Tipo    | Descrição                                             |
| -------------- | ------- | ----------------------------------------------------- |
| `label`        | string  | Texto do rótulo do campo                              |
| `labelClass`   | string  | Classe CSS do `<label>`                               |
| `wrapperClass` | string  | Classe CSS do container                               |
| `class`        | string  | Classe CSS do `<input>`                               |
| `type`         | string  | Sempre `"text"`                                       |
| `id`           | string  | ID do input                                           |
| `name`         | string  | Atributo NAME do input (form)                         |
| `value`        | string  | Valor inicial (pré-preenchido — formatado ou só dígitos) |
| `placeholder`  | string  | Placeholder padrão `(XX) XXXXX-XXXX`                 |
| `maxlength`    | string  | Limite de 15 chars (máscara completa com formatação)  |
| `ReadOnly`     | boolean | Campo somente leitura (padrão: `false`)               |
| `Disabled`     | boolean | Campo desabilitado (padrão: `false`)                  |
| `Required`     | boolean | Campo obrigatório (padrão: `false`)                   |

---

## 2) Máscara dinâmica

O componente aplica a máscara automaticamente durante a digitação, detectando o tipo pelo total de dígitos:

| Total de dígitos | Tipo           | Formato resultante      | Exemplo               |
| ---------------- | -------------- | ----------------------- | --------------------- |
| 10               | Telefone fixo  | `(XX) XXXX-XXXX`        | `(21) 3030-4040`      |
| 11               | Celular        | `(XX) XXXXX-XXXX`       | `(21) 98055-8545`     |

A máscara é aplicada progressivamente enquanto o usuário digita — não bloqueia a digitação intermediária.

### Valor enviado ao backend

O campo envia o número **com máscara** (`(21) 98055-8545`). Para obter apenas os dígitos, use a função interna `getCelularTelefoneDigits(value)`, disponível no escopo do script:

```js
// Leitura manual do valor puro (sem máscara)
var raw = document.getElementById('celular_telefone').value;
var digits = raw.replace(/\D/g, ''); // '21980558545'
```

---

## 3) Validação de DDD (ANATEL)

O componente valida o DDD assim que os dois primeiros dígitos são digitados. A lista cobre todos os DDDs válidos do Brasil por estado:

| Região       | DDDs                                          |
| ------------ | --------------------------------------------- |
| São Paulo    | 11, 12, 13, 14, 15, 16, 17, 18, 19           |
| Rio de Janeiro | 21, 22, 24                                  |
| Espírito Santo | 27, 28                                      |
| Minas Gerais | 31, 32, 33, 34, 35, 37, 38                    |
| Paraná       | 41, 42, 43, 44, 45, 46                        |
| Santa Catarina | 47, 48, 49                                  |
| Rio Grande do Sul | 51, 53, 54, 55                           |
| DF / Centro-Oeste | 61, 62, 63, 64, 65, 66, 67, 68, 69      |
| Nordeste     | 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89 |
| Norte        | 91, 92, 93, 94, 95, 96, 97, 98, 99            |

---

## 4) Como usar

### HTML mínimo

```html
<form>
    <div class="field_celular_telefone"
         data-label="Celular"
         data-id="celular"
         data-name="celular"
         data-required="true">
    </div>
</form>
```

O script encontra automaticamente elementos com classe `.field_celular_telefone` dentro de `<form>` e renderiza o campo.

---

## 5) Exemplos práticos

### Exemplo 1: Campo obrigatório simples

```html
<div class="field_celular_telefone col-md-6"
     data-label="Celular"
     data-id="celular"
     data-name="celular"
     data-required="true">
</div>
```

### Exemplo 2: Campo com label personalizado e IDs distintos

```html
<div class="field_celular_telefone col-md-6"
     data-label="Telefone de Contato"
     data-id="telefone_contato"
     data-name="telefone_contato">
</div>
```

### Exemplo 3: Pré-preenchimento com dígitos brutos (vindo da API)

O componente aplica a máscara automaticamente sobre o valor informado em `data-value`:

```html
<div class="field_celular_telefone col-md-6"
     data-label="Celular"
     data-id="celular"
     data-name="celular"
     data-value="21980558545">
</div>
```

*Exibe: `(21) 98055-8545`*

### Exemplo 4: Campo somente leitura

```html
<div class="field_celular_telefone col-md-6"
     data-label="Telefone (somente leitura)"
     data-id="telefone_ro"
     data-name="telefone_ro"
     data-value="2130304040"
     data-readonly="true">
</div>
```

### Exemplo 5: Campo desabilitado

```html
<div class="field_celular_telefone col-md-6"
     data-label="Telefone Antigo"
     data-id="telefone_old"
     data-name="telefone_old"
     data-value="2130304040"
     data-disabled="true">
</div>
```

### Exemplo 6: Dois campos no mesmo formulário (celular + fixo)

```html
<form class="row">
    <div class="field_celular_telefone col-md-6"
         data-label="Celular"
         data-id="celular"
         data-name="celular"
         data-required="true">
    </div>

    <div class="field_celular_telefone col-md-6"
         data-label="Telefone Fixo (opcional)"
         data-id="telefone_fixo"
         data-name="telefone_fixo">
    </div>
</form>
```

---

## 6) Comportamento de validação

### Eventos observados

| Evento  | Ação                                              |
| ------- | ------------------------------------------------- |
| `input` | Aplica máscara; valida DDD ao atingir 2 dígitos  |
| `blur`  | Validação completa (obrigatório, incompleto, DDD) |
| carga   | Valida valor pré-preenchido ao inicializar        |

### Mensagens de erro

| Situação                       | Mensagem exibida                                                 |
| ------------------------------ | ---------------------------------------------------------------- |
| Campo obrigatório vazio        | `Campo "Celular" é obrigatório.`                                 |
| Letras digitadas               | `Número não pode conter letras. Use apenas dígitos.`             |
| Caracteres inválidos           | `Caractere inválido. Use apenas números.`                        |
| Número incompleto (< 10 díg.)  | `Número incompleto. Informe DDD + número (8 ou 9 dígitos).`      |
| DDD inválido                   | `DDD "00" não é válido. Verifique o código de área.`             |

### Feedback visual

- Classe `.is-invalid` no input (borda vermelha Bootstrap)
- `<small class="text-danger">` com `font-size: 0.7rem`, `font-style: italic`

---

## 7) Estrutura HTML gerada

```html
<div class="mb-1">
    <label for="celular" class="form-label">Celular <span class="text-danger">*</span></label>
    <input type="text" id="celular" name="celular" class="form-control"
           placeholder="(XX) XXXXX-XXXX" maxlength="15" required>
    <small class="text-danger d-block" style="font-size:0.7rem;font-style:italic;"></small>
</div>
```

---

## 8) Normalização de atributos

Os atributos `data-*` são convertidos para lowercase pelo navegador. O componente normaliza:

| `data-*`        | Propriedade interna |
| --------------- | ------------------- |
| `data-readonly` | `ReadOnly`          |
| `data-disabled` | `Disabled`          |
| `data-required` | `Required`          |

---

## 9) Comportamento em ReadOnly / Disabled

- Campos `readonly` ou `disabled` **não recebem** o handler de validação.
- Eventos `keypress` e `input` são bloqueados via `preventDefault` para impedir edição.
- O valor pré-preenchido é exibido com a máscara aplicada.

---

## 10) Dicas práticas

✅ Use `data-value` com dígitos puros (sem máscara) — o componente formata automaticamente  
✅ Use IDs distintos quando houver dois ou mais campos de telefone na mesma página  
✅ Combine com `field_cep.js` para formulários de endereço completo  

❌ Não use para números internacionais (não suporta DDI)  
❌ Não force `maxlength` acima de 15 — a máscara usa exatamente 15 chars para celular  

---

## 11) Dependências

- Bootstrap 5 (`form-control`, `is-invalid`, `text-danger`, `d-block`)
- JavaScript ES6+ (classes, spread operator, template literals)

---

## 12) Compatibilidade

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 não suportado (usa ES6)
