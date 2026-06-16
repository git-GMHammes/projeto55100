# field_cpf.js — fábrica de campo CPF (frontend)

Factory especializada para validação de **CPF (Cadastro de Pessoa Física)** com:

- formatação automática (XXX.XXX.XXX-XX)
- validação do algoritmo de dígitos verificadores
- feedback visual em tempo real
- controles de acesso (ReadOnly, Disabled, Required)

---

## 1) Atributos padrão

```js
const defaultCpfAttributes = {
    label: "CPF",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "text",
    id: "cpf",
    name: "cpf",
    value: "",
    ReadOnly: false,
    Disabled: false,
    Required: false
};
```

### Significado de cada atributo

| Atributo       | Tipo    | Descrição                               |
| -------------- | ------- | --------------------------------------- |
| `label`        | string  | Texto do rótulo do campo                |
| `labelClass`   | string  | Classe CSS do `<label>`                 |
| `wrapperClass` | string  | Classe CSS do container                 |
| `class`        | string  | Classe CSS do `<input>`                 |
| `type`         | string  | Sempre `text` (não editável)            |
| `id`           | string  | Atributo ID do input                    |
| `name`         | string  | Atributo NAME do input                  |
| `value`        | string  | CPF inicial (pode ser formatado ou não) |
| `ReadOnly`     | boolean | Campo somente leitura                   |
| `Disabled`     | boolean | Campo desabilitado                      |
| `Required`     | boolean | Campo obrigatório                       |

---

## 2) Como usar

### HTML básico

```html
<form>
    <div class="field_cpf" 
         data-label="CPF do Titular" 
         data-id="cpf_titular" 
         data-name="cpf_titular" 
         data-required="true">
    </div>
</form>
```

---

## 3) Exemplos práticos

### Exemplo 1: CPF obrigatório

```html
<div class="field_cpf" 
     data-label="Seu CPF" 
     data-id="meu_cpf" 
     data-name="meu_cpf" 
     data-required="true">
</div>
```

### Exemplo 2: CPF com valor inicial

```html
<div class="field_cpf" 
     data-label="CPF Cadastrado" 
     data-id="cpf_cadastrado" 
     data-name="cpf_cadastrado" 
     data-value="12345678909">
</div>
```
*O valor será automaticamente formatado para: 123.456.789-09*

### Exemplo 3: CPF somente leitura

```html
<div class="field_cpf" 
     data-label="CPF do Responsável (somente leitura)" 
     data-id="cpf_responsavel" 
     data-name="cpf_responsavel" 
     data-value="123.456.789-09" 
     data-readonly="true">
</div>
```

### Exemplo 4: CPF desabilitado

```html
<div class="field_cpf" 
     data-label="CPF Antigo (desabilitado)" 
     data-id="cpf_antigo" 
     data-name="cpf_antigo" 
     data-value="000.000.000-00" 
     data-disabled="true">
</div>
```

---

## 4) Formatação automática

### Como funciona

O campo aceita apenas **dígitos numéricos** e formata automaticamente conforme o usuário digita:

```
Usuário digita: 12345678909
Campo exibe: 123.456.789-09
```

### Remoção de caracteres inválidos

- Remove pontos, hífens, espaços durante a digitação
- Aceita apenas números (0-9)
- Máximo 11 dígitos

---

## 5) Validação de CPF

### Algoritmo de verificação

O componente valida os **dois dígitos verificadores** usando o algoritmo oficial:

**Primeiro dígito (posição 10):**
1. Multiplica os 9 primeiros dígitos por (10, 9, 8, 7, 6, 5, 4, 3, 2)
2. Soma os resultados
3. Calcula: `resto = soma % 11`
4. Se resto < 2: dígito = 0, senão: dígito = 11 - resto

**Segundo dígito (posição 11):**
1. Multiplica os 10 primeiros dígitos por (11, 10, 9, 8, 7, 6, 5, 4, 3, 2)
2. Soma os resultados
3. Calcula: `resto = soma % 11`
4. Se resto < 2: dígito = 0, senão: dígito = 11 - resto

### CPFs inválidos conhecidos

O componente rejeita automaticamente:
- `000.000.000-00`
- `111.111.111-11`
- `222.222.222-22`
- ... (todos os dígitos iguais até 999.999.999-99)

---

## 6) Feedback visual

### CPF válido
- ✅ Borda padrão (sem classe de erro)
- ✅ Mensagem de feedback vazia

### CPF inválido
- ❌ Classe `.is-invalid` (borda vermelha Bootstrap)
- ❌ Mensagem: *"CPF inválido. Verifique os dígitos."*
- ❌ Estilo: `font-size: 0.7rem`, `font-style: italic`, cor vermelha

---

## 7) Validação em tempo real

### Eventos monitorados

- `input` — valida enquanto digita
- `blur` — valida ao sair do campo

### Comportamento

- **Durante digitação**: formata e valida parcialmente
- **Ao completar 11 dígitos**: valida algoritmo completo
- **CPF incompleto**: não exibe erro (aguarda completar)

---

## 8) Estrutura HTML gerada

```html
<div class="mb-1">
    <label for="cpf" class="form-label">CPF <span class="text-danger">*</span></label>
    <input type="text" id="cpf" name="cpf" class="form-control" 
           placeholder="000.000.000-00" maxlength="14" required>
    <small class="text-danger d-block"></small>
</div>
```

---

## 9) Integração com formulários

### Valor enviado

O campo envia o CPF **formatado** (com pontos e hífen):

```js
// Exemplo de dados do form
{
    cpf: "123.456.789-09"
}
```

### Para enviar apenas números

Se o backend precisa de CPF sem formatação, adicione este código no submit:

```js
form.addEventListener('submit', (e) => {
    const cpfInput = document.getElementById('cpf');
    cpfInput.value = cpfInput.value.replace(/\D/g, ''); // Remove formatação
});
```

---

## 10) Dicas práticas

✅ **Use data-required="true"** para campos obrigatórios  
✅ **Valide no backend** também (nunca confie apenas no frontend)  
✅ **Use readonly** para exibir CPF sem permitir edição  
✅ **Evite valores default** como `000.000.000-00`  

❌ **Não use** para outros documentos (use `field_cnpj` para CNPJ)  
❌ **Não altere** a máscara (formato é padrão oficial)  
❌ **Não force** valores inválidos via JavaScript (componente bloqueia)  

---

## 11) Limitações conhecidas

- ⚠️ Não valida se o CPF está ativo na Receita Federal
- ⚠️ Não verifica duplicidade no banco de dados
- ⚠️ Aceita CPF válido mas inexistente (ex: 111.444.777-35)

---

## 12) Dependências

- Bootstrap 5 (classes CSS)
- JavaScript ES6+ (arrow functions, template literals)

---

## 13) Compatibilidade

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 não suportado (usa ES6)

---

## 14) Exemplos de CPFs válidos (teste)

```
123.456.789-09 ✅
111.444.777-35 ✅
529.982.247-25 ✅
```

## 15) Exemplos de CPFs inválidos (teste)

```
123.456.789-00 ❌ (dígito verificador errado)
000.000.000-00 ❌ (sequência inválida)
111.111.111-11 ❌ (todos iguais)
123.456.789    ❌ (incompleto)
```
