# field_textarea.js — fábrica de campos TEXTAREA (frontend)

Factory que cria campos `<textarea>` automaticamente em elementos com classe `field_textarea`, aplicando:

- estrutura visual (label + textarea + contador de caracteres + feedback),
- classes de estilo (Bootstrap/default),
- validações de caracteres em tempo real,
- limites de caracteres mínimo e máximo,
- contador dinâmico com barra de progresso colorida,
- controles de acesso (ReadOnly, Disabled, Required).

---

## 1) Atributos padrão

O JSON padrão define:

```js
const defaultTextareaAttributes = {
    label: "Descrição",
    labelClass: "form-label",
    wrapperClass: "mb-3",
    class: "form-control",
    id: "description",
    name: "description",
    value: "",
    rows: 4,
    cols: 50,
    maxlength: 500,
    minlength: 10,
    special: true,
    number: true,
    letter: true,
    showCounter: true,
    ReadOnly: false,
    Disabled: false,
    Required: false
};
```

### Significado de cada atributo

| Atributo | Tipo | Descrição | Padrão |
|----------|------|-----------|--------|
| `label` | string | Texto do rótulo do campo | `"Descrição"` |
| `labelClass` | string | Classe CSS do `<label>` | `"form-label"` |
| `wrapperClass` | string | Classe CSS do container | `"mb-3"` |
| `class` | string | Classe CSS do `<textarea>` | `"form-control"` |
| `id` | string | Atributo ID do textarea | `"description"` |
| `name` | string | Atributo NAME do textarea (importante para forms) | `"description"` |
| `value` | string | Valor inicial do campo | `""` |
| `rows` | number | Número de linhas visíveis | `4` |
| `cols` | number | Número de colunas | `50` |
| `maxlength` | number | Limite máximo de caracteres | `500` |
| `minlength` | number | Limite mínimo de caracteres | `10` |
| `special` | boolean | Permite caracteres especiais | `true` |
| `number` | boolean | Permite números | `true` |
| `letter` | boolean | Permite letras | `true` |
| `showCounter` | boolean | Exibe contador dinâmico e barra de progresso | `true` |
| `ReadOnly` | boolean | Campo somente leitura | `false` |
| `Disabled` | boolean | Campo desabilitado | `false` |
| `Required` | boolean | Campo obrigatório | `false` |

---

## 2) Como usar

### HTML simples

```html
<form>
    <div class="field_textarea" 
         data-label="Descrição do Produto" 
         data-id="descricao" 
         data-name="descricao" 
         data-required="true"
         data-maxlength="1000"
         data-minlength="50">
    </div>
</form>
```

O script encontra automaticamente elementos com classe `.field_textarea` e renderiza o campo completo.

---

## 3) Exemplos práticos

### Exemplo 1: Campo obrigatório com contador

```html
<div class="field_textarea" 
     data-label="Observações" 
     data-id="obs" 
     data-name="obs" 
     data-required="true"
     data-maxlength="500"
     data-minlength="10"
     data-rows="5">
</div>
```

**Resultado:**
- Campo com 5 linhas
- Máximo 500 caracteres
- Mínimo 10 caracteres
- Obrigatório
- Contador dinâmico visível

### Exemplo 2: Descrição longa sem validação mínima

```html
<div class="field_textarea" 
     data-label="Descrição do Serviço" 
     data-id="desc_serv" 
     data-name="desc_serv" 
     data-maxlength="2000"
     data-minlength="0"
     data-rows="6"
     data-showcounter="true">
</div>
```

### Exemplo 3: Campo somente leitura (visualização)

```html
<div class="field_textarea" 
     data-label="Histórico de Atendimento" 
     data-id="historico" 
     data-name="historico" 
     data-value="Conteúdo pré-carregado..."
     data-readonly="true"
     data-rows="4">
</div>
```

### Exemplo 4: Campo desabilitado

```html
<div class="field_textarea" 
     data-label="Justificativa" 
     data-id="justif" 
     data-name="justif" 
     data-disabled="true"
     data-rows="3">
</div>
```

### Exemplo 5: Sem caracteres especiais

```html
<div class="field_textarea" 
     data-label="Texto Simples" 
     data-id="texto_clean" 
     data-name="texto_clean" 
     data-special="false"
     data-maxlength="300"
     data-required="true">
</div>
```

**Resultado:**
- Rejeita caracteres especiais (!@#$%^&*, etc.)
- Aceita letras e números
- Máximo 300 caracteres

### Exemplo 6: Somente números

```html
<div class="field_textarea" 
     data-label="Números de Série" 
     data-id="numeros" 
     data-name="numeros" 
     data-letter="false"
     data-special="false"
     data-rows="2">
</div>
```

**Resultado:**
- Aceita apenas números
- Rejeita letras e caracteres especiais

---

## 4) Validações em tempo real

### 4.1) Validação de caracteres

A validação ocorre em tempo real enquanto o usuário digita:

```js
const rules = {
    special: normalizeBoolean(attributes.special, true),    // Permite especiais?
    number: normalizeBoolean(attributes.number, true),      // Permite números?
    letter: normalizeBoolean(attributes.letter, true)       // Permite letras?
};
```

**Mensagens de erro possíveis:**
- `"Campo "Nome" não aceita caracteres especiais."`
- `"Campo "Nome" não aceita números."`
- `"Campo "Nome" não aceita letras."`

### 4.2) Validação de comprimento

```js
// Validação mínima
if (minlength && currentLength > 0 && currentLength < minlength) {
    messages.push(`Campo "${fieldLabel}" deve ter no mínimo ${minlength} caracteres. (${currentLength}/${minlength})`);
}

// Validação máxima
if (maxlength && currentLength >= maxlength * 0.9) {
    if (currentLength >= maxlength) {
        messages.push(`Campo "${fieldLabel}" atingiu o limite máximo de ${maxlength} caracteres.`);
    } else {
        messages.push(`Campo "${fieldLabel}" próximo ao limite máximo.`);
    }
}
```

### 4.3) Validação obrigatória

Se `required="true"`:

```js
if (isRequired && !textareaElement.value.trim()) {
    messages.push(`Campo "${fieldLabel}" é obrigatório.`);
}
```

---

## 5) Contador dinâmico com barra de progresso

Quando `showCounter="true"` (padrão), exibe:

1. **Texto do contador:** `15 / 500`
2. **Barra de progresso colorida:**
   - 🟢 **Verde** (< 70%): Espaço disponível
   - 🟡 **Amarelo** (70-90%): Atenção, aproximando do limite
   - 🔴 **Vermelho** (> 90% ou máximo atingido): Limite próximo ou atingido

**HTML renderizado:**

```html
<div class="d-flex justify-content-between align-items-center mt-2" style="font-size: 0.85rem;">
    <div>
        <span class="char-count">15</span> / <span class="char-max">500</span>
    </div>
    <div class="progress" style="flex: 1; margin: 0 10px; height: 4px;">
        <div class="progress-bar bg-success" role="progressbar" 
             style="width: 3%;" aria-valuenow="15" aria-valuemin="0" aria-valuemax="500"></div>
    </div>
</div>
```

---

## 6) Comportamento de campos ReadOnly, Disabled e Required

### ReadOnly (somente leitura)

```html
<div class="field_textarea" 
     data-label="Histórico" 
     data-readonly="true"
     data-value="Conteúdo não editável">
</div>
```

- Usuário **pode ler** o conteúdo
- Usuário **não pode editar** o conteúdo
- Campo é **enviado no formulário**
- Eventos de digitação são **bloqueados**

### Disabled (desabilitado)

```html
<div class="field_textarea" 
     data-label="Futuro" 
     data-disabled="true">
</div>
```

- Campo aparece **visualmente desabilitado** (cinzento)
- Usuário **não pode interagir**
- Campo **não é enviado** no formulário
- Eventos de digitação são **bloqueados**

### Required (obrigatório)

```html
<div class="field_textarea" 
     data-label="Descrição" 
     data-required="true">
</div>
```

- Rótulo exibe **asterisco vermelho** `*`
- Validação **rejeita envio** se vazio
- Mensagem de erro: `"Campo é obrigatório."`

---

## 7) Validação de tipo de caracteres

### Permitir APENAS letras

```html
<div class="field_textarea" 
     data-label="Nome do Responsável" 
     data-number="false"
     data-special="false">
</div>
```

### Permitir APENAS números

```html
<div class="field_textarea" 
     data-label="Sequência Numérica" 
     data-letter="false"
     data-special="false">
</div>
```

### Permitir letras e números (sem especiais)

```html
<div class="field_textarea" 
     data-label="Código Alfanumérico" 
     data-special="false">
</div>
```

### Permitir tudo

```html
<div class="field_textarea" 
     data-label="Comentário Livre" 
     data-special="true"
     data-number="true"
     data-letter="true">
</div>
```

---

## 8) Integração com Bootstrap 5

O componente usa **Bootstrap 5** por padrão:

- Classe `.form-control` — estilo padrão
- Classe `.form-label` — rótulo
- Classe `.mb-3` — margem inferior
- Classe `.is-invalid` — borda vermelha em erro
- Classe `.text-danger` — mensagens em vermelho
- Classe `.progress-bar` — barra dinâmica colorida

**CSS esperado:**

```css
.form-control {
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
}

.form-control.is-invalid {
    border-color: #dc3545;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.progress-bar {
    transition: width 0.3s ease;
}

.progress-bar.bg-success { background-color: #198754 !important; }
.progress-bar.bg-warning { background-color: #ffc107 !important; }
.progress-bar.bg-danger { background-color: #dc3545 !important; }
```

---

## 9) Estrutura do HTML gerado

Quando você cria um campo textarea:

```html
<div class="field_textarea" 
     data-label="Observações" 
     data-required="true"
     data-maxlength="500">
</div>
```

É renderizado como:

```html
<div class="mb-3">
    <label for="description" class="form-label">
        Observações 
        <span class="text-danger">*</span>
        <small class="text-muted">(máx: 500 caracteres)</small>
        <small class="text-muted">(mín: 10 caracteres)</small>
    </label>
    
    <textarea id="description" name="description" class="form-control" 
              rows="4" cols="50" maxlength="500" minlength="10" required>
    </textarea>
    
    <div class="d-flex justify-content-between align-items-center mt-2" style="font-size: 0.85rem;">
        <div>
            <span class="char-count">0</span> / <span class="char-max">500</span>
        </div>
        <div class="progress" style="flex: 1; margin: 0 10px; height: 4px;">
            <div class="progress-bar bg-success" role="progressbar" style="width: 0%;" 
                 aria-valuenow="0" aria-valuemin="0" aria-valuemax="500"></div>
        </div>
    </div>
    
    <small class="text-danger" style="margin: 5px 0 0 0; padding: 0; font-size: 0.75rem;">
        <!-- Mensagens de erro aparecem aqui -->
    </small>
</div>
```

---

## 10) Normalizando atributos data-*

O navegador converte automaticamente todos os atributos data-* para lowercase:

```html
<!-- Você escreve: -->
<div class="field_textarea" data-showCounter="true"></div>

<!-- O navegador normaliza para: -->
dataset.showcounter = "true"

<!-- O script converte para: -->
normalizedKey = "showCounter"
```

Isso permite usar qualquer formato no HTML.

---

## 11) Validação automática no carregamento

Ao renderizar o campo, a validação é executada **imediatamente**:

```js
const runValidation = () => {
    // Verifica valor inicial
    // Valida min/max
    // Valida caracteres
    // Exibe mensagens se necessário
};

// Executa no render:
runValidation();
```

---

## 12) Integração com formulário

Para capturar o valor do textarea em um formulário:

```html
<form id="meuForm" method="POST" action="/enviar">
    <div class="field_textarea" 
         data-label="Comentário" 
         data-id="comentario" 
         data-name="comentario"
         data-required="true">
    </div>
    
    <button type="submit" class="btn btn-primary">Enviar</button>
</form>

<script>
document.getElementById('meuForm').addEventListener('submit', function(e) {
    // O valor está em: input.value
    // O name está em: input.name
    // O form envia automaticamente se validações passarem
});
</script>
```

---

## 13) Resumo de validadores

| Validador | Rejeita | Aceita |
|-----------|---------|--------|
| `special: false` | `!@#$%^&*()` | Letras, números, espaços |
| `number: false` | `0-9` | Letras, especiais, espaços |
| `letter: false` | `a-zA-Z` | Números, especiais, espaços |
| `minlength: 10` | `< 10 caracteres` | `>= 10 caracteres` |
| `maxlength: 500` | `> 500 caracteres` | `<= 500 caracteres` |
| `required: true` | Campo vazio | Campo preenchido |

---

## 14) Exemplos completos

### Exemplo A: Formulário de feedback

```html
<form>
    <div class="field_textarea" 
         data-label="Seu Feedback" 
         data-id="feedback" 
         data-name="feedback" 
         data-required="true"
         data-minlength="20"
         data-maxlength="1000"
         data-rows="5"
         data-showcounter="true">
    </div>
</form>
```

### Exemplo B: Relatório técnico

```html
<form>
    <div class="field_textarea" 
         data-label="Descrição do Problema" 
         data-id="relatorio" 
         data-name="relatorio" 
         data-required="true"
         data-minlength="100"
         data-maxlength="5000"
         data-rows="8"
         data-special="true">
    </div>
</form>
```

### Exemplo C: Campo de código

```html
<form>
    <div class="field_textarea" 
         data-label="Código" 
         data-id="codigo" 
         data-name="codigo" 
         data-minlength="0"
         data-maxlength="2000"
         data-rows="10"
         data-showcounter="true">
    </div>
</form>
```

---

## 15) Suporte a navegadores

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 📝 Notas Importantes

1. **Bootstrap 5 é obrigatório** para que o campo renderize corretamente
2. **JavaScript precisa estar ativo** para que os campos sejam criados
3. **Validação em tempo real** só funciona se ReadOnly e Disabled forem `false`
4. **Atributos data-*** são case-insensitive, mas o script normaliza para PascalCase
5. **O contador dinâmico** atualiza a cada keystroke
