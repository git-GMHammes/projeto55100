# field_email.js — fábrica de campo EMAIL (frontend)

Factory especializada para validação de **endereços de e-mail** com:

- formatação automática (lowercase)
- validação de formato padrão (RFC)
- validação de domínios permitidos (whitelist)
- feedback visual em tempo real
- controles de acesso (ReadOnly, Disabled, Required)

---

## 1) Atributos padrão

```js
const defaultEmailAttributes = {
    label: "E-mail",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "email",
    id: "email",
    name: "email",
    value: "",
    allowedDomains: "",
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
| `type` | string | Sempre `email` (HTML5) |
| `id` | string | Atributo ID do input |
| `name` | string | Atributo NAME do input |
| `value` | string | E-mail inicial |
| `allowedDomains` | string | Lista de domínios permitidos (separados por vírgula) |
| `ReadOnly` | boolean | Campo somente leitura |
| `Disabled` | boolean | Campo desabilitado |
| `Required` | boolean | Campo obrigatório |

---

## 2) Lista de domínios padrão

O componente possui uma **whitelist de domínios** configurável:

```js
const allowedEmailDomains = [
    "rj.gov.br",
    "gov.br",
    "com",
    "com.br",
    "extreme.digital"
];
```

### Comportamento

- Se o e-mail termina com um domínio da lista → **Válido** ✅
- Se o e-mail não termina com domínio permitido → **Inválido** ❌

### Sobrescrever domínios por campo

Use o atributo `data-alloweddomains`:

```html
<div class="field_email" 
     data-alloweddomains="gmail.com,outlook.com">
</div>
```

---

## 3) Como usar

### HTML básico

```html
<form>
    <div class="field_email" 
         data-label="Seu E-mail" 
         data-id="email" 
         data-name="email" 
         data-required="true">
    </div>
</form>
```

---

## 4) Exemplos práticos

### Exemplo 1: E-mail obrigatório (domínios padrão)

```html
<div class="field_email" 
     data-label="E-mail Profissional" 
     data-id="email_profissional" 
     data-name="email_profissional" 
     data-required="true">
</div>
```
*Aceita: usuario@rj.gov.br, nome@empresa.com.br*

### Exemplo 2: E-mail com domínios customizados

```html
<div class="field_email" 
     data-label="E-mail Corporativo" 
     data-id="email_corp" 
     data-name="email_corp" 
     data-alloweddomains="minhaempresa.com.br,gov.br" 
     data-required="true">
</div>
```
*Aceita apenas: @minhaempresa.com.br ou @gov.br*

### Exemplo 3: E-mail sem restrição de domínio

```html
<div class="field_email" 
     data-label="E-mail (qualquer provedor)" 
     data-id="email_livre" 
     data-name="email_livre" 
     data-alloweddomains="*">
</div>
```
*Aceita qualquer domínio válido*

### Exemplo 4: E-mail somente leitura

```html
<div class="field_email" 
     data-label="E-mail Cadastrado (somente leitura)" 
     data-id="email_cadastrado" 
     data-name="email_cadastrado" 
     data-value="usuario@empresa.com.br" 
     data-readonly="true">
</div>
```

### Exemplo 5: E-mail desabilitado

```html
<div class="field_email" 
     data-label="E-mail Antigo (desabilitado)" 
     data-id="email_antigo" 
     data-name="email_antigo" 
     data-value="antigo@email.com" 
     data-disabled="true">
</div>
```

### Exemplo 6: E-mail governamental

```html
<div class="field_email" 
     data-label="E-mail Institucional" 
     data-id="email_gov" 
     data-name="email_gov" 
     data-alloweddomains="rj.gov.br,gov.br" 
     data-required="true">
</div>
```

---

## 5) Formatação automática

### Conversão para lowercase

O componente converte automaticamente para minúsculas:

```
Usuário digita: Usuario@Empresa.COM
Campo armazena: usuario@empresa.com
```

### Remoção de espaços

Espaços no início/fim são removidos:

```
Usuário digita: " usuario@email.com "
Campo armazena: "usuario@email.com"
```

---

## 6) Validação de e-mail

### Formato básico (RFC)

Valida padrão: `usuario@dominio.extensao`

**Exemplos válidos:**
```
joao@empresa.com ✅
maria.silva@gov.br ✅
contato+vendas@site.com.br ✅
user_123@example.co.uk ✅
```

**Exemplos inválidos:**
```
usuario@dominio ❌ (sem extensão)
@dominio.com ❌ (sem nome de usuário)
usuario@@dominio.com ❌ (duplo @)
usuario dominio.com ❌ (sem @)
```

### Validação de domínio

Além do formato, valida se o domínio está na whitelist:

```html
<!-- allowedDomains padrão: rj.gov.br, gov.br, com, com.br, extreme.digital -->

usuario@rj.gov.br ✅
usuario@empresa.com ✅
usuario@teste.com.br ✅
usuario@gmail.com ❌ (não está na lista padrão)
```

### Suporte a subdomínios

O componente aceita subdomínios:

```
usuario@detran.rj.gov.br ✅ (termina com rj.gov.br)
usuario@portal.gov.br ✅ (termina com gov.br)
usuario@mail.empresa.com.br ✅ (termina com com.br)
```

---

## 7) Feedback visual

### E-mail válido
- ✅ Borda padrão
- ✅ Sem mensagem de erro

### E-mail inválido
- ❌ Classe `.is-invalid` (borda vermelha)
- ❌ Mensagem: *"E-mail inválido ou domínio não permitido."*
- ❌ Estilo: `font-size: 0.7rem`, `font-style: italic`, vermelho

---

## 8) Validação em tempo real

### Eventos monitorados

- `input` — valida enquanto digita
- `blur` — valida ao sair do campo

### Comportamento

- **Durante digitação**: valida formato parcialmente
- **Ao completar**: valida formato + domínio
- **E-mail incompleto**: aguarda sem exibir erro

---

## 9) Estrutura HTML gerada

```html
<div class="mb-1">
    <label for="email" class="form-label">E-mail <span class="text-danger">*</span></label>
    <input type="email" id="email" name="email" class="form-control" 
           placeholder="usuario@dominio.com" required>
    <small class="text-danger d-block"></small>
</div>
```

---

## 10) Integração com formulários

### Valor enviado

O campo envia o e-mail em **lowercase**:

```js
{
    email: "usuario@empresa.com.br"
}
```

---

## 11) Configuração personalizada

### Alterar domínios padrão no arquivo

Edite a constante no início do arquivo:

```js
const allowedEmailDomains = [
    "minhaempresa.com.br",
    "parceiro.com",
    "gov.br"
];
```

### Alterar domínios por campo (HTML)

Use `data-alloweddomains`:

```html
data-alloweddomains="gmail.com,outlook.com,yahoo.com"
```

### Aceitar qualquer domínio

```html
data-alloweddomains="*"
```

---

## 12) Dicas práticas

✅ **Use whitelist de domínios** para e-mails institucionais  
✅ **Valide no backend** (nunca confie apenas no frontend)  
✅ **Teste com domínios reais** da sua organização  
✅ **Use type="email"** para teclado mobile otimizado  

❌ **Não bloqueie** domínios comuns sem necessidade (Gmail, Outlook)  
❌ **Não force** uppercase (padrão é lowercase)  
❌ **Não valide** apenas no frontend (usuário pode burlar)  

---

## 13) Casos de uso

### E-mail institucional (governo)

```html
<div class="field_email" 
     data-label="E-mail Institucional" 
     data-alloweddomains="rj.gov.br,gov.br">
</div>
```

### E-mail corporativo (empresa)

```html
<div class="field_email" 
     data-label="E-mail Corporativo" 
     data-alloweddomains="empresa.com.br">
</div>
```

### E-mail público (qualquer provedor)

```html
<div class="field_email" 
     data-label="E-mail Pessoal" 
     data-alloweddomains="*">
</div>
```

---

## 14) Limitações conhecidas

- ⚠️ Não verifica se o e-mail realmente existe (DNS/SMTP)
- ⚠️ Não valida se caixa de entrada está ativa
- ⚠️ Não impede e-mails descartáveis (temp-mail.org)
- ⚠️ Validação de formato básica (RFC simplificado)

---

## 15) Dependências

- Bootstrap 5 (classes CSS)
- JavaScript ES6+ (arrow functions, template literals)

---

## 16) Compatibilidade

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 não suportado (usa ES6)

---

## 17) Exemplos de e-mails válidos (teste)

### Com domínios padrão
```
joao.silva@rj.gov.br ✅
contato@empresa.com ✅
vendas@site.com.br ✅
suporte@sistema.extreme.digital ✅
```

### Com subdomínios
```
usuario@detran.rj.gov.br ✅
admin@portal.gov.br ✅
info@mail.empresa.com.br ✅
```

---

## 18) Exemplos de e-mails inválidos (teste)

```
usuario@gmail.com ❌ (domínio não está na lista padrão)
@empresa.com ❌ (sem nome de usuário)
usuario@dominio ❌ (sem extensão)
usuario dominio.com ❌ (sem @)
usuario@@empresa.com ❌ (duplo @)
```

---

## 19) Segurança

### Validação backend obrigatória

**NUNCA** confie apenas na validação frontend:

```php
// Exemplo PHP (backend)
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    throw new Exception('E-mail inválido');
}

$allowedDomains = ['rj.gov.br', 'gov.br', 'com.br'];
$domain = substr(strrchr($email, "@"), 1);

if (!in_array($domain, $allowedDomains)) {
    throw new Exception('Domínio não permitido');
}
```

### Proteção contra injeção

O componente escapa caracteres HTML automaticamente via `textContent`.

---

## 20) Internacionalização

### Suporte a caracteres especiais

O componente aceita caracteres Unicode (acentos, ç, etc):

```
joão@empresa.com.br ✅
maría@site.com ✅
andré.ñ@portal.com.br ✅
```

**Nota:** Alguns servidores de e-mail antigos podem não aceitar caracteres especiais. Considere normalizar para ASCII se necessário.
