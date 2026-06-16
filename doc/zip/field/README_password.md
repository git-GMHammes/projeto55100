# field_password.js — fábrica de campo PASSWORD (frontend)

Factory especializada para campos de **senha** com:

- toggle visual para mostrar/ocultar senha (👁️ / 🔒)
- validação de senha forte (letras + números + caracteres especiais)
- suporte a campo duplo (senha + confirmação)
- validação de igualdade entre campos
- feedback visual em tempo real
- controles de acesso (ReadOnly, Disabled, Required)

---

## 1) Atributos padrão

```js
const defaultPasswordAttributes = {
    label: "Senha",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "password",
    strongPassword: false,
    minlength: 6,
    maxlength: 32,
    special: true,
    number: true,
    letter: true,
    id: "password",
    name: "password",
    value: "",
    doubleField: false,
    equalFields: false,
    ReadOnly: false,
    Disabled: false,
    Required: false
};
```

### Significado de cada atributo

| Atributo | Tipo | Descrição |
|----------|------|-----------|
| `label` | string | Texto do rótulo do campo |
| `labelClass` | string | Classe CSS do `<label>` |
| `wrapperClass` | string | Classe CSS do container |
| `class` | string | Classe CSS do `<input>` |
| `type` | string | Sempre `password` (não editável) |
| `strongPassword` | boolean | Requer senha forte (letra+número+especial) |
| `minlength` | number | Tamanho mínimo da senha (padrão: 6) |
| `maxlength` | number | Tamanho máximo da senha (padrão: 32) |
| `special` | boolean | Permite caracteres especiais |
| `number` | boolean | Permite números |
| `letter` | boolean | Permite letras |
| `id` | string | Atributo ID do input |
| `name` | string | Atributo NAME do input |
| `value` | string | Senha inicial (use com cuidado!) |
| `doubleField` | boolean | Cria campo de confirmação |
| `equalFields` | boolean | Valida igualdade entre senha e confirmação |
| `ReadOnly` | boolean | Campo somente leitura |
| `Disabled` | boolean | Campo desabilitado |
| `Required` | boolean | Campo obrigatório |

---

## 2) Toggle de visibilidade

### Ícone de olho

Cada campo de senha possui um **ícone clicável** à direita:

- **👁️** (olho aberto) = senha está **oculta** (type="password")
- **🔒** (cadeado) = senha está **visível** (type="text")

### Comportamento

- Clique no ícone alterna entre mostrar/ocultar
- Funciona em ambos os campos quando `doubleField=true`
- Posicionamento: `position: absolute; right: 10px;`
- Não interfere na digitação

---

## 3) Como usar

### HTML básico (senha simples)

```html
<form>
    <div class="field_password" 
         data-label="Senha" 
         data-id="senha" 
         data-name="senha" 
         data-required="true">
    </div>
</form>
```

### HTML com senha forte

```html
<div class="field_password" 
     data-label="Senha Forte" 
     data-strongpassword="true" 
     data-minlength="8" 
     data-required="true">
</div>
```

### HTML com campo duplo

```html
<div class="field_password" 
     data-label="Nova Senha" 
     data-doublefield="true" 
     data-equalfields="true" 
     data-strongpassword="true" 
     data-minlength="8" 
     data-required="true">
</div>
```

---

## 4) Exemplos práticos

### Exemplo 1: Senha simples obrigatória

```html
<div class="field_password" 
     data-label="Senha de Acesso" 
     data-id="senha" 
     data-name="senha" 
     data-required="true">
</div>
```
*Aceita qualquer senha ≥ 6 caracteres*

### Exemplo 2: Senha forte (segura)

```html
<div class="field_password" 
     data-label="Senha Segura" 
     data-id="senha_forte" 
     data-name="senha_forte" 
     data-strongpassword="true" 
     data-minlength="8" 
     data-required="true">
</div>
```
*Requer: letra + número + caractere especial + mínimo 8 chars*

### Exemplo 3: Senha com confirmação

```html
<div class="field_password" 
     data-label="Nova Senha" 
     data-id="nova_senha" 
     data-name="nova_senha" 
     data-doublefield="true" 
     data-equalfields="true" 
     data-strongpassword="true" 
     data-minlength="8" 
     data-required="true">
</div>
```
*Renderiza 2 campos: "Nova Senha" + "Confirmar Nova Senha"*

### Exemplo 4: PIN numérico (4-6 dígitos)

```html
<div class="field_password" 
     data-label="PIN de Acesso" 
     data-id="pin" 
     data-name="pin" 
     data-minlength="4" 
     data-maxlength="6" 
     data-letter="false" 
     data-special="false" 
     data-required="true">
</div>
```
*Aceita apenas números, 4 a 6 dígitos*

### Exemplo 5: Senha somente leitura

```html
<div class="field_password" 
     data-label="Senha Temporária (somente leitura)" 
     data-id="senha_temp" 
     data-name="senha_temp" 
     data-value="Temp@2025" 
     data-readonly="true">
</div>
```

### Exemplo 6: Senha desabilitada

```html
<div class="field_password" 
     data-label="Senha do Sistema (desabilitada)" 
     data-id="senha_sistema" 
     data-name="senha_sistema" 
     data-value="********" 
     data-disabled="true">
</div>
```

---

## 5) Validação de senha forte

### Regras (quando strongPassword=true)

A senha deve conter **TODOS** os seguintes:

1. ✅ Pelo menos **1 letra** (a-z ou A-Z)
2. ✅ Pelo menos **1 número** (0-9)
3. ✅ Pelo menos **1 caractere especial** (@, #, $, !, etc)
4. ✅ Tamanho mínimo (padrão: 8 caracteres)

### Exemplos de senhas fortes

```
Senha@123 ✅
MyP@ssw0rd ✅
Str0ng#Pass ✅
C0mpl3x!ty ✅
```

### Exemplos de senhas fracas

```
senha123 ❌ (sem caractere especial)
Senha@abc ❌ (sem número)
123456@# ❌ (sem letra)
Pass@1 ❌ (menos de 8 caracteres)
```

---

## 6) Campo duplo (confirmação)

### Como funciona

Quando `doubleField=true`, o componente renderiza **2 campos**:

1. **Campo principal**: usa `id` e `name` fornecidos
2. **Campo de confirmação**: adiciona sufixo `_confirm`

```html
<!-- HTML gerado -->
<label>Nova Senha</label>
<input type="password" id="nova_senha" name="nova_senha">

<label>Confirmar Nova Senha</label>
<input type="password" id="nova_senha_confirm" name="nova_senha_confirm">
```

### Validação de igualdade

Quando `equalFields=true`, valida se os dois campos são **idênticos**:

```
Senha: Senha@123
Confirmação: Senha@123
✅ Válido
```

```
Senha: Senha@123
Confirmação: Senha@456
❌ "As senhas não coincidem."
```

---

## 7) Feedback visual

### Senha válida
- ✅ Borda padrão
- ✅ Sem mensagem de erro

### Senha inválida
- ❌ Classe `.is-invalid` (borda vermelha)
- ❌ Mensagens específicas:
  - *"Senha: mínimo 8 caracteres."*
  - *"Senha: deve conter letras."*
  - *"Senha: deve conter números."*
  - *"Senha: deve conter caracteres especiais (@, #, $, etc)."*
  - *"As senhas não coincidem."*

### Estilo das mensagens

- Fonte: `0.7rem`
- Estilo: `italic`
- Cor: vermelho
- Margem: `0px` (colada ao campo)

---

## 8) Validação em tempo real

### Eventos monitorados

- `input` — valida enquanto digita
- `blur` — valida ao sair do campo

### Comportamento

- **Durante digitação**: valida regras incrementalmente
- **Campos duplos**: valida igualdade em tempo real
- **Senha incompleta**: aguarda mínimo de caracteres

---

## 9) Estrutura HTML gerada

### Campo simples

```html
<div class="mb-1">
    <label for="senha" class="form-label">Senha <span class="text-danger">*</span></label>
    <div style="position: relative;">
        <input type="password" id="senha" name="senha" class="form-control" 
               minlength="8" maxlength="32" style="padding-right: 40px;" required>
        <span class="password-toggle" data-target="senha" 
              style="position: absolute; right: 10px; top: 50%; 
              transform: translateY(-50%); cursor: pointer; font-size: 1.2rem;">👁️</span>
    </div>
    <small class="text-danger d-block"></small>
</div>
```

### Campo duplo

```html
<div class="mb-1">
    <label for="nova_senha" class="form-label">Nova Senha <span class="text-danger">*</span></label>
    <div style="position: relative;">
        <input type="password" id="nova_senha" name="nova_senha" class="form-control" 
               minlength="8" maxlength="32" style="padding-right: 40px;" required>
        <span class="password-toggle" data-target="nova_senha">👁️</span>
    </div>
    
    <label for="nova_senha_confirm" class="form-label mt-2">Confirmar Nova Senha</label>
    <div style="position: relative;">
        <input type="password" id="nova_senha_confirm" name="nova_senha_confirm" 
               class="form-control" minlength="8" maxlength="32" 
               style="padding-right: 40px;" required>
        <span class="password-toggle" data-target="nova_senha_confirm">👁️</span>
    </div>
    
    <small class="text-danger d-block"></small>
</div>
```

---

## 10) Integração com formulários

### Valor enviado (campo simples)

```js
{
    senha: "Senha@123"
}
```

### Valor enviado (campo duplo)

```js
{
    nova_senha: "Senha@123",
    nova_senha_confirm: "Senha@123"
}
```

### Validar no backend

```php
// Exemplo PHP
$senha = $_POST['nova_senha'];
$confirmacao = $_POST['nova_senha_confirm'];

if ($senha !== $confirmacao) {
    throw new Exception('Senhas não coincidem');
}

// Valida senha forte
if (!preg_match('/[a-zA-Z]/', $senha)) {
    throw new Exception('Senha deve conter letras');
}

if (!preg_match('/\d/', $senha)) {
    throw new Exception('Senha deve conter números');
}

if (!preg_match('/[^\w\s]/', $senha)) {
    throw new Exception('Senha deve conter caracteres especiais');
}

if (strlen($senha) < 8) {
    throw new Exception('Senha deve ter no mínimo 8 caracteres');
}

// Hash antes de salvar
$senhaHash = password_hash($senha, PASSWORD_BCRYPT);
```

---

## 11) Segurança

### ⚠️ NUNCA armazene senhas em texto puro

```php
// ❌ ERRADO
$sql = "INSERT INTO users (senha) VALUES ('$senha')";

// ✅ CORRETO
$senhaHash = password_hash($senha, PASSWORD_BCRYPT);
$sql = "INSERT INTO users (senha_hash) VALUES ('$senhaHash')";
```

### ⚠️ Use HTTPS

Sempre transmita senhas por **HTTPS** (SSL/TLS).

### ⚠️ Não preencha value com senha real

```html
<!-- ❌ NUNCA FAÇA ISSO -->
<div class="field_password" data-value="SenhaDoUsuario123"></div>

<!-- ✅ Use apenas para demos ou placeholders -->
<div class="field_password" data-value="********" data-readonly="true"></div>
```

### ⚠️ Valide sempre no backend

Validação frontend é **apenas UX**, nunca segurança.

---

## 12) Dicas práticas

✅ **Use strongPassword** para contas críticas  
✅ **Use doubleField** em cadastros e redefinições  
✅ **Defina minlength ≥ 8** para senhas fortes  
✅ **Valide no backend** com bcrypt/argon2  
✅ **Use HTTPS** sempre  

❌ **Não armazene** senhas em texto puro  
❌ **Não exponha** senhas reais no value  
❌ **Não force** maxlength muito baixo  
❌ **Não confie** apenas no frontend  

---

## 13) Casos de uso

### Cadastro de usuário

```html
<div class="field_password" 
     data-label="Crie sua Senha" 
     data-doublefield="true" 
     data-equalfields="true" 
     data-strongpassword="true" 
     data-minlength="8" 
     data-required="true">
</div>
```

### Login simples

```html
<div class="field_password" 
     data-label="Senha de Acesso" 
     data-id="login_senha" 
     data-name="login_senha" 
     data-required="true">
</div>
```

### Alterar senha

```html
<div class="field_password" 
     data-label="Senha Atual" 
     data-id="senha_atual" 
     data-name="senha_atual" 
     data-required="true">
</div>

<div class="field_password" 
     data-label="Nova Senha" 
     data-id="nova_senha" 
     data-name="nova_senha" 
     data-doublefield="true" 
     data-equalfields="true" 
     data-strongpassword="true" 
     data-minlength="8" 
     data-required="true">
</div>
```

### PIN numérico (ATM style)

```html
<div class="field_password" 
     data-label="PIN de 4 dígitos" 
     data-id="pin" 
     data-name="pin" 
     data-minlength="4" 
     data-maxlength="4" 
     data-letter="false" 
     data-special="false" 
     data-required="true">
</div>
```

---

## 14) Limitações conhecidas

- ⚠️ Não verifica força contra dicionários (dictionary attack)
- ⚠️ Não bloqueia senhas comuns (123456, password, etc)
- ⚠️ Não valida contra senhas anteriores
- ⚠️ Toggle visual não impede screenshots/gravação

---

## 15) Dependências

- Bootstrap 5 (classes CSS)
- JavaScript ES6+ (arrow functions, template literals)
- Unicode emoji (👁️ 🔒)

---

## 16) Compatibilidade

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 não suportado (usa ES6)

---

## 17) Exemplos de senhas válidas (teste)

### Senha forte (strongPassword=true, minlength=8)
```
Senha@123 ✅
MyP@ssw0rd ✅
Str0ng#Pass ✅
C0mpl3x!ty2025 ✅
```

### Senha simples (strongPassword=false)
```
senha123 ✅
meugato ✅
abc12345 ✅
```

### PIN numérico (letter=false, special=false)
```
1234 ✅
9876 ✅
000000 ✅
```

---

## 18) Exemplos de senhas inválidas (teste)

### Com strongPassword=true
```
senha123 ❌ (sem caractere especial)
Senha@abc ❌ (sem número)
123456@# ❌ (sem letra)
Pass@1 ❌ (menos de 8 caracteres)
```

### Senhas não coincidentes (doubleField + equalFields)
```
Campo 1: Senha@123
Campo 2: Senha@456
❌ "As senhas não coincidem."
```

---

## 19) Acessibilidade

### Suporte a leitores de tela

- Labels associados via `for="id"`
- Atributo `required` para campos obrigatórios
- Mensagens de erro legíveis por screen readers

### Navegação por teclado

- Tab: navega entre campos
- Enter: submete formulário
- Esc: limpa campo (comportamento padrão)

---

## 20) Personalização visual

### Alterar ícones

Edite no arquivo `field_password.js`:

```js
// Trocar emojis por ícones Font Awesome
this.innerHTML = '<i class="fas fa-lock"></i>'; // Cadeado
this.textContent = '<i class="fas fa-eye"></i>'; // Olho
```

### Alterar posição do ícone

```js
// Mover para esquerda
style="position: absolute; left: 10px; ..."
```

### Alterar tamanho do ícone

```js
style="font-size: 1.5rem;" // Maior
style="font-size: 1rem;"   // Menor
```
