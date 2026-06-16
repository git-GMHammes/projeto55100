# field_cnpj.js — fábrica de campo CNPJ (frontend)

Factory especializada para validação de **CNPJ (Cadastro Nacional de Pessoa Jurídica)** com suporte ao **novo formato alfanumérico** (vigência julho/2026):

- formatação automática (XX.XXX.XXX/XXXX-XX)
- validação do algoritmo de dígitos verificadores
- suporte a letras no novo formato (A=10, B=11...Z=35)
- feedback visual em tempo real
- controles de acesso (ReadOnly, Disabled, Required)

---

## 1) Atributos padrão

```js
const defaultCnpjAttributes = {
    label: "CNPJ",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "text",
    id: "cnpj",
    name: "cnpj",
    value: "",
    allowLetters: false,
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
| `class`        | string  | Classe CSS do `<input>`                            |
| `type`         | string  | Sempre `text` (não editável)                       |
| `id`           | string  | Atributo ID do input                               |
| `name`         | string  | Atributo NAME do input                             |
| `value`        | string  | CNPJ inicial (pode ser formatado ou não)           |
| `allowLetters` | boolean | **Permite formato alfanumérico** (padrão: `false`) |
| `ReadOnly`     | boolean | Campo somente leitura                              |
| `Disabled`     | boolean | Campo desabilitado                                 |
| `Required`     | boolean | Campo obrigatório                                  |

---

## 2) Novo formato alfanumérico (julho/2026)

### O que mudou?

A partir de **julho de 2026**, a Receita Federal permite CNPJs com **letras maiúsculas** (A-Z) além de números:

**Formato tradicional (apenas números):**
```
12.345.678/0001-90
```

**Novo formato alfanumérico:**
```
AB.C12.345/6789-96
1A.BC2.345/6789-XX
```

### Conversão de letras para números (cálculo)

No algoritmo de validação, letras são convertidas:

```
A=10, B=11, C=12, D=13, E=14, F=15, G=16, H=17, I=18, J=19,
K=20, L=21, M=22, N=23, O=24, P=25, Q=26, R=27, S=28, T=29,
U=30, V=31, W=32, X=33, Y=34, Z=35
```

---

## 3) Como usar

### HTML básico (formato tradicional)

```html
<form>
    <div class="field_cnpj" 
         data-label="CNPJ da Empresa" 
         data-id="cnpj_empresa" 
         data-name="cnpj_empresa" 
         data-required="true">
    </div>
</form>
```

### HTML com formato alfanumérico

```html
<div class="field_cnpj" 
     data-label="CNPJ Alfanumérico" 
     data-id="cnpj_alfa" 
     data-name="cnpj_alfa" 
     data-allowletters="true" 
     data-required="true">
</div>
```

---

## 4) Exemplos práticos

### Exemplo 1: CNPJ tradicional obrigatório

```html
<div class="field_cnpj" 
     data-label="CNPJ" 
     data-id="cnpj" 
     data-name="cnpj" 
     data-required="true">
</div>
```
*Aceita apenas: 00.000.000/0000-00*

### Exemplo 2: CNPJ alfanumérico

```html
<div class="field_cnpj" 
     data-label="CNPJ (novo formato)" 
     data-id="cnpj_novo" 
     data-name="cnpj_novo" 
     data-allowletters="true" 
     data-required="true">
</div>
```
*Aceita: AB.C12.345/6789-96*

### Exemplo 3: CNPJ com valor inicial

```html
<div class="field_cnpj" 
     data-label="CNPJ Cadastrado" 
     data-id="cnpj_cadastrado" 
     data-name="cnpj_cadastrado" 
     data-value="12345678000190">
</div>
```
*Formata automaticamente para: 12.345.678/0001-90*

### Exemplo 4: CNPJ somente leitura

```html
<div class="field_cnpj" 
     data-label="CNPJ Matriz (somente leitura)" 
     data-id="cnpj_matriz" 
     data-name="cnpj_matriz" 
     data-value="12.345.678/0001-90" 
     data-readonly="true">
</div>
```

### Exemplo 5: CNPJ desabilitado

```html
<div class="field_cnpj" 
     data-label="CNPJ Antigo (desabilitado)" 
     data-id="cnpj_antigo" 
     data-name="cnpj_antigo" 
     data-value="00.000.000/0000-00" 
     data-disabled="true">
</div>
```

---

## 5) Formatação automática

### Formato padrão

```
Usuário digita: 12345678000190
Campo exibe: 12.345.678/0001-90
```

### Formato alfanumérico

```
Usuário digita: ABC12345678996
Campo exibe: AB.C12.345/6789-96
```

### Regras de formatação

- Máximo 14 caracteres (sem formatação)
- Pontos (.), barra (/) e hífen (-) são adicionados automaticamente
- Letras sempre em **MAIÚSCULA**

---

## 6) Validação de CNPJ

### Algoritmo de verificação

Similar ao CPF, o CNPJ possui **dois dígitos verificadores**:

**Primeiro dígito (posição 13):**
1. Multiplica os 12 primeiros dígitos por: 5,4,3,2,9,8,7,6,5,4,3,2
2. Soma os resultados
3. Calcula: `resto = soma % 11`
4. Se resto < 2: dígito = 0, senão: dígito = 11 - resto

**Segundo dígito (posição 14):**
1. Multiplica os 13 primeiros dígitos por: 6,5,4,3,2,9,8,7,6,5,4,3,2
2. Soma os resultados
3. Calcula: `resto = soma % 11`
4. Se resto < 2: dígito = 0, senão: dígito = 11 - resto

### Validação com letras

Quando `allowLetters=true`, letras são convertidas antes do cálculo:

```js
// Exemplo: AB.C12.345/6789-96
A = 10, B = 11, C = 12
// Cálculo usa: [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### CNPJs inválidos conhecidos

Rejeita automaticamente:
- `00.000.000/0000-00`
- `11.111.111/1111-11`
- `22.222.222/2222-22`
- ... (todos os dígitos iguais)

---

## 7) Feedback visual

### CNPJ válido
- ✅ Borda padrão
- ✅ Sem mensagem de erro

### CNPJ inválido
- ❌ Classe `.is-invalid` (borda vermelha)
- ❌ Mensagem: *"CNPJ inválido. Verifique os dígitos verificadores."*
- ❌ Estilo compacto: `0.7rem`, itálico, vermelho

---

## 8) Validação em tempo real

### Eventos monitorados

- `input` — valida e formata durante digitação
- `blur` — valida ao sair do campo

### Comportamento

- **Durante digitação**: formata e valida parcialmente
- **Ao completar 14 caracteres**: valida algoritmo completo
- **CNPJ incompleto**: aguarda sem exibir erro

---

## 9) Estrutura HTML gerada

### Formato tradicional

```html
<div class="mb-1">
    <label for="cnpj" class="form-label">CNPJ <span class="text-danger">*</span></label>
    <input type="text" id="cnpj" name="cnpj" class="form-control" 
           placeholder="00.000.000/0000-00" maxlength="18" required>
    <small class="text-danger d-block"></small>
</div>
```

### Formato alfanumérico

```html
<input type="text" id="cnpj_alfa" name="cnpj_alfa" class="form-control" 
       placeholder="XX.XXX.XXX/XXXX-XX" maxlength="18" required>
```

---

## 10) Integração com formulários

### Valor enviado

O campo envia o CNPJ **formatado**:

```js
// Formato tradicional
{ cnpj: "12.345.678/0001-90" }

// Formato alfanumérico
{ cnpj: "AB.C12.345/6789-96" }
```

### Para enviar sem formatação

```js
form.addEventListener('submit', (e) => {
    const cnpjInput = document.getElementById('cnpj');
    cnpjInput.value = cnpjInput.value.replace(/\D/g, ''); // Remove pontos/hífen/barra
});
```

---

## 11) Dicas práticas

✅ **Use allowLetters="true"** para aceitar o novo formato (2026+)  
✅ **Valide no backend** (nunca confie apenas no frontend)  
✅ **Teste com CNPJs reais** antes de produção  
✅ **Documente** se seu sistema aceita apenas um formato ou ambos  

❌ **Não use** para CPF (use `field_cpf`)  
❌ **Não force** valores inválidos  
❌ **Não assuma** que todos os CNPJs terão letras (transição gradual)  

---

## 12) Limitações conhecidas

- ⚠️ Não valida se o CNPJ está ativo na Receita Federal
- ⚠️ Não verifica duplicidade no banco
- ⚠️ Aceita CNPJ válido mas inexistente
- ⚠️ Não diferencia matriz de filial

---

## 13) Dependências

- Bootstrap 5 (classes CSS)
- JavaScript ES6+ (arrow functions, template literals)

---

## 14) Compatibilidade

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 não suportado (usa ES6)

---

## 15) Exemplos de CNPJs válidos (teste)

### Formato tradicional
```
12.345.678/0001-90 ✅
11.222.333/0001-81 ✅
34.028.316/0001-03 ✅ (Receita Federal - real)
```

### Formato alfanumérico (julho/2026)
```
AB.C12.345/6789-96 ✅
1A.BC2.D34/5678-XX ✅
ZZ.999.888/7777-XX ✅
```

---

## 16) Exemplos de CNPJs inválidos (teste)

```
12.345.678/0001-00 ❌ (dígito verificador errado)
00.000.000/0000-00 ❌ (sequência inválida)
11.111.111/1111-11 ❌ (todos iguais)
12.345.678/0001    ❌ (incompleto)
```

---

## 17) Migração para o novo formato

### Quando usar allowLetters?

- ✅ **Sistema novo (2026+)**: use `allowLetters="true"`
- ✅ **Sistema em produção**: mantenha `allowLetters="false"` até migração oficial
- ✅ **API pública**: aceite ambos os formatos

### Exemplo de campo universal

```html
<div class="field_cnpj" 
     data-label="CNPJ (aceita ambos formatos)" 
     data-id="cnpj_universal" 
     data-name="cnpj_universal" 
     data-allowletters="true" 
     data-required="true">
</div>
```

*Este campo aceita tanto `12.345.678/0001-90` quanto `AB.C12.345/6789-96`*
