# field_input.js — fábrica de campos INPUT (frontend)

Factory minimalista que cria campos `<input type="text">` e `<input type="hidden">` automaticamente em elementos com classe `field_input`, aplicando:

- estrutura visual (label + input + feedback),
- classes de estilo (Bootstrap/default),
- validações de caracteres em tempo real,
- controles de acesso (ReadOnly, Disabled, Required).

---

## 1) Atributos padrão

O JSON padrão define:

```js
const defaultInputAttributes = {
    label: "Título do Campo",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "text",
    special: true,
    number: true,
    letter: true,
    id: "fname",
    name: "fname",
    value: "John",
    ReadOnly: false,
    Disabled: false,
    Required: false
};
```

### Significado de cada atributo

| Atributo       | Tipo    | Descrição                                      |
| -------------- | ------- | ---------------------------------------------- |
| `label`        | string  | Texto do rótulo do campo                       |
| `labelClass`   | string  | Classe CSS do `<label>`                        |
| `wrapperClass` | string  | Classe CSS do container                        |
| `class`        | string  | Classe CSS do `<input>`                        |
| `type`         | string  | Tipo do input: `text` ou `hidden`              |
| `special`      | boolean | Permite caracteres especiais (padrão: `true`)  |
| `number`       | boolean | Permite números (padrão: `true`)               |
| `letter`       | boolean | Permite letras (padrão: `true`)                |
| `id`           | string  | Atributo ID do input                           |
| `name`         | string  | Atributo NAME do input (importante para forms) |
| `value`        | string  | Valor inicial do campo                         |
| `ReadOnly`     | boolean | Campo somente leitura (padrão: `false`)        |
| `Disabled`     | boolean | Campo desabilitado (padrão: `false`)           |
| `Required`     | boolean | Campo obrigatório (padrão: `false`)            |

---

## 2) Como usar

### HTML simples

```html
<form>
    <div class="field_input" 
         data-label="Nome Completo" 
         data-id="nome" 
         data-name="nome" 
         data-required="true">
    </div>
</form>
```

O script encontra automaticamente elementos com classe `.field_input` e renderiza o campo completo.

---

## 3) Exemplos práticos

### Exemplo 1: Campo simples obrigatório

```html
<div class="field_input" 
     data-label="Nome" 
     data-id="nome" 
     data-name="nome" 
     data-required="true">
</div>
```

### Exemplo 2: Campo que não aceita números

```html
<div class="field_input" 
     data-label="Nome (sem números)" 
     data-id="nome_clean" 
     data-name="nome_clean" 
     data-number="false">
</div>
```

### Exemplo 3: Campo que só aceita números

```html
<div class="field_input" 
     data-label="Código Numérico" 
     data-id="codigo" 
     data-name="codigo" 
     data-letter="false" 
     data-special="false">
</div>
```

### Exemplo 4: Campo somente leitura

```html
<div class="field_input" 
     data-label="ID do Sistema" 
     data-id="system_id" 
     data-name="system_id" 
     data-value="12345" 
     data-readonly="true">
</div>
```

### Exemplo 5: Campo desabilitado

```html
<div class="field_input" 
     data-label="Campo Bloqueado" 
     data-id="blocked" 
     data-name="blocked" 
     data-value="Não editável" 
     data-disabled="true">
</div>
```

### Exemplo 6: Campo hidden

```html
<div class="field_input" 
     data-type="hidden" 
     data-id="token" 
     data-name="token" 
     data-value="abc123xyz">
</div>
```

### Exemplo 7: Campo sem caracteres especiais

```html
<div class="field_input" 
     data-label="Username" 
     data-id="username" 
     data-name="username" 
     data-special="false">
</div>
```

### Exemplo 8: Campo alfabético puro

```html
<div class="field_input" 
     data-label="Iniciais (somente letras)" 
     data-id="iniciais" 
     data-name="iniciais" 
     data-number="false" 
     data-special="false">
</div>
```

### Exemplo 9: Campo com classe customizada

```html
<div class="field_input" 
     data-label="Campo Destacado" 
     data-id="destaque" 
     data-name="destaque" 
     data-class="form-control form-control-lg border-primary">
</div>
```

---

## 4) Validação em tempo real

O componente adiciona validação nos eventos:
- `input` — valida enquanto o usuário digita
- `blur` — valida quando o campo perde foco

### Regras de validação

- **special=false**: bloqueia caracteres especiais
- **number=false**: bloqueia dígitos numéricos
- **letter=false**: bloqueia letras

### Feedback visual

- Mensagem de erro em vermelho (`text-danger`)
- Classe `.is-invalid` no input (borda vermelha Bootstrap)
- Estilo compacto: `font-size: 0.7rem`, `font-style: italic`

---

## 5) Normalização de atributos

Os atributos `data-*` são convertidos para lowercase pelo navegador. O componente normaliza:

- `data-readonly` → `ReadOnly`
- `data-disabled` → `Disabled`
- `data-required` → `Required`

---

## 6) Controle de acesso

### ReadOnly
- Permite selecionar e copiar texto
- Bloqueia edição via CSS e eventos
- Não impede submit do formulário

### Disabled
- Bloqueia totalmente a interação
- Campo não é enviado no submit
- Aparência visual acinzentada

### Required
- Adiciona asterisco vermelho (*) no label
- Atributo HTML5 `required` no input
- Validação nativa do navegador

---

## 7) Estrutura HTML gerada

```html
<div class="mb-1">
    <label for="nome" class="form-label">Nome <span class="text-danger">*</span></label>
    <input type="text" id="nome" name="nome" class="form-control" required>
    <small class="text-danger d-block"></small>
</div>
```

---

## 8) Dicas práticas

✅ **Use data-attributes** para configuração declarativa  
✅ **Combine validações** (ex: `data-special="false" data-number="false"`)  
✅ **Teste readonly vs disabled** conforme necessidade de envio no form  
✅ **Evite IDs duplicados** em campos múltiplos  

❌ **Não use** para campos complexos (select, textarea, etc)  
❌ **Não altere** a classe `.field_input` após renderização  
❌ **Não force** type diferente de `text` ou `hidden`  

---

## 9) Dependências

- Bootstrap 5 (classes CSS)
- JavaScript ES6+ (classes, spread operator, template literals)

---

## 10) Compatibilidade

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 não suportado (usa ES6)
