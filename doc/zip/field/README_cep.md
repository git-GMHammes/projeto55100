# field_cep.js — fábrica de campo CEP (frontend)

Factory especializada para entrada de **CEP brasileiro** com:

- máscara automática `XX.XXX-XXX` durante a digitação
- consulta automática à API ao completar 8 dígitos
- variáveis globais `vgcep_*` preenchidas após consulta bem-sucedida
- eventos customizados `cep:sucesso` e `cep:limpo` para integração com outros campos
- controles de acesso (ReadOnly, Disabled, Required)

---

## 1) Atributos padrão

```js
const defaultCepAttributes = {
    label: "CEP",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "text",
    id: "cep",
    name: "cep",
    value: "",
    placeholder: "00.000-000",
    maxlength: "10",
    ReadOnly: false,
    Disabled: false,
    Required: false
};
```

### Significado de cada atributo

| Atributo       | Tipo    | Descrição                                                     |
| -------------- | ------- | ------------------------------------------------------------- |
| `label`        | string  | Texto do rótulo do campo                                      |
| `labelClass`   | string  | Classe CSS do `<label>`                                       |
| `wrapperClass` | string  | Classe CSS do container                                       |
| `class`        | string  | Classe CSS do `<input>`                                       |
| `type`         | string  | Sempre `"text"`                                               |
| `id`           | string  | ID do input                                                   |
| `name`         | string  | Atributo NAME do input (form)                                 |
| `value`        | string  | Valor inicial (pré-preenchido — 8 dígitos ou com máscara)     |
| `placeholder`  | string  | Placeholder `00.000-000`                                      |
| `maxlength`    | string  | Limite de 10 chars (máscara `XX.XXX-XXX`)                     |
| `ReadOnly`     | boolean | Campo somente leitura (padrão: `false`)                       |
| `Disabled`     | boolean | Campo desabilitado (padrão: `false`)                          |
| `Required`     | boolean | Campo obrigatório (padrão: `false`)                           |
| `apiUrl`       | string  | URL base da API de consulta (opcional — ver seção API abaixo) |

---

## 2) Máscara automática

O componente aplica a máscara `XX.XXX-XXX` progressivamente durante a digitação:

| Dígitos digitados | Exibição     |
| ----------------- | ------------ |
| `1`               | `1`          |
| `12`              | `12`         |
| `123`             | `12.3`       |
| `12345`           | `12.345`     |
| `123456`          | `12.345-6`   |
| `12345678`        | `12.345-678` |

**Atenção:** o separador decimal é ponto (`.`) e o separador de bloco é hífen (`-`), no formato padrão brasileiro de CEP.

---

## 3) API de consulta automática

Ao completar 8 dígitos, o campo dispara automaticamente uma consulta ao backend via `fetch`.

### Rota padrão

```
GET /api/v1/consulta-cep/{cep}
```

O backend funciona como **proxy** para a API externa (ex: SERPRO), evitando CORS no browser.

### Sobrescrever a URL da API

Há três formas de customizar a URL, em ordem de prioridade:

1. **Atributo `data-api-url`** no container HTML:
   ```html
   <div class="field_cep" data-api-url="/api/v2/cep">
   ```

2. **Variável global `window.vgcep_apiUrl`** (definida antes do script carregar):
   ```js
   window.vgcep_apiUrl = '/api/v2/cep';
   ```

3. **Padrão interno:** `/api/v1/consulta-cep`

### Formato da resposta esperada

O proxy pode retornar em dois formatos:

```json
// Formato 1: objeto direto
{
  "cep": "20040020",
  "tipoCep": "logradouro",
  "subTipoCep": "normal",
  "uf": "RJ",
  "cidade": "Rio de Janeiro",
  "bairro": "Centro",
  "endereco": "Avenida Rio Branco",
  "complemento": "",
  "codigoIBGE": "3304557"
}

// Formato 2: envelope { success, data }
{
  "success": true,
  "data": { ... }  // mesmo objeto acima
}
```

O componente trata ambos os formatos automaticamente via `json.data ?? json`.

### Tratamento de erros da API

| Status HTTP | Mensagem exibida                                 |
| ----------- | ------------------------------------------------ |
| `404`       | `CEP não encontrado. Verifique os dígitos informados.` |
| `400`       | `CEP inválido.`                                  |
| Outros      | `Erro ao consultar o CEP. Tente novamente.`       |

---

## 4) Variáveis globais `vgcep_*`

Após uma consulta bem-sucedida, as variáveis globais são preenchidas automaticamente:

```js
var vgcep_cep         = '20040020';
var vgcep_tipoCep     = 'logradouro';
var vgcep_subTipoCep  = 'normal';
var vgcep_uf          = 'RJ';
var vgcep_cidade      = 'Rio de Janeiro';
var vgcep_bairro      = 'Centro';
var vgcep_endereco    = 'Avenida Rio Branco';
var vgcep_complemento = '';
var vgcep_codigoIBGE  = '3304557';
```

Essas variáveis são limpas (`''`) quando:
- o campo é apagado ou alterado para um CEP incompleto
- a consulta falha (CEP não encontrado ou erro de rede)
- o evento `cep:limpo` é disparado

### Leitura das variáveis no código da página

```js
// Após o evento cep:sucesso, acesse diretamente:
document.getElementById('cep').addEventListener('cep:sucesso', function () {
    document.getElementById('cidade').value = vgcep_cidade;
    document.getElementById('uf').value     = vgcep_uf;
    document.getElementById('bairro').value = vgcep_bairro;
});
```

---

## 5) Eventos customizados

O componente dispara eventos no próprio `<input>` (com `bubbles: true`), permitindo escuta em qualquer ancestral.

| Evento        | Quando é disparado                                      | `event.detail`              |
| ------------- | ------------------------------------------------------- | --------------------------- |
| `cep:sucesso` | Consulta concluída com sucesso                          | `{ cep: '20040020', data: { ... } }` |
| `cep:limpo`   | Campo apagado, incompleto, ou consulta com erro          | `{}`                        |

### Exemplo de listener no formulário

```js
document.querySelector('form').addEventListener('cep:sucesso', function (e) {
    var data = e.detail.data;

    // Preenche campos do formulário com os dados do endereço
    document.getElementById('logradouro').value = data.endereco    || '';
    document.getElementById('bairro').value     = data.bairro      || '';
    document.getElementById('cidade').value     = data.cidade      || '';
    document.getElementById('uf').value         = data.uf          || '';
});

document.querySelector('form').addEventListener('cep:limpo', function () {
    // Limpa campos dependentes quando o CEP é apagado ou inválido
    document.getElementById('logradouro').value = '';
    document.getElementById('bairro').value     = '';
    document.getElementById('cidade').value     = '';
    document.getElementById('uf').value         = '';
});
```

---

## 6) Como usar

### HTML mínimo

```html
<form>
    <div class="field_cep"
         data-label="CEP"
         data-id="cep"
         data-name="cep"
         data-required="true">
    </div>
</form>
```

---

## 7) Exemplos práticos

### Exemplo 1: Campo obrigatório com preenchimento automático de endereço

```html
<form class="row">
    <div class="field_cep col-md-3"
         data-label="CEP"
         data-id="cep"
         data-name="cep"
         data-required="true">
    </div>

    <div class="field_input col-md-6"
         data-label="Logradouro"
         data-id="logradouro"
         data-name="logradouro">
    </div>

    <div class="field_input col-md-3"
         data-label="Bairro"
         data-id="bairro"
         data-name="bairro">
    </div>

    <div class="field_input col-md-4"
         data-label="Cidade"
         data-id="cidade"
         data-name="cidade">
    </div>

    <div class="field_input col-md-2"
         data-label="UF"
         data-id="uf"
         data-name="uf">
    </div>
</form>

<script>
    document.querySelector('form').addEventListener('cep:sucesso', function (e) {
        var d = e.detail.data;
        document.getElementById('logradouro').value = d.endereco || '';
        document.getElementById('bairro').value     = d.bairro   || '';
        document.getElementById('cidade').value     = d.cidade   || '';
        document.getElementById('uf').value         = d.uf       || '';
    });

    document.querySelector('form').addEventListener('cep:limpo', function () {
        ['logradouro', 'bairro', 'cidade', 'uf'].forEach(function (id) {
            document.getElementById(id).value = '';
        });
    });
</script>
```

### Exemplo 2: Pré-preenchimento com dígitos brutos (pré-cadastro / edição)

```html
<div class="field_cep col-md-3"
     data-label="CEP"
     data-id="cep"
     data-name="cep"
     data-value="20040020">
</div>
```

*O componente aplica a máscara (`20.040-020`) e dispara a consulta automaticamente.*

### Exemplo 3: API customizada

```html
<div class="field_cep col-md-3"
     data-label="CEP"
     data-id="cep"
     data-name="cep"
     data-api-url="/api/v2/consulta-cep"
     data-required="true">
</div>
```

### Exemplo 4: Campo somente leitura

```html
<div class="field_cep col-md-3"
     data-label="CEP"
     data-id="cep"
     data-name="cep"
     data-value="20040020"
     data-readonly="true">
</div>
```

### Exemplo 5: Campo desabilitado

```html
<div class="field_cep col-md-3"
     data-label="CEP Antigo"
     data-id="cep_antigo"
     data-name="cep_antigo"
     data-value="01001000"
     data-disabled="true">
</div>
```

---

## 8) Comportamento de validação

### Eventos observados

| Evento  | Ação                                                              |
| ------- | ----------------------------------------------------------------- |
| `input` | Aplica máscara; ao atingir 8 dígitos, dispara consulta à API      |
| `blur`  | Valida obrigatório; valida incompleto; garante consulta se pendente |
| carga   | Se `data-value` tiver 8 dígitos, consulta é executada na inicialização |

### Mensagens de erro

| Situação                  | Mensagem exibida                                              |
| ------------------------- | ------------------------------------------------------------- |
| Campo obrigatório vazio   | `Campo "CEP" é obrigatório.`                                  |
| Letras digitadas          | `CEP não pode conter letras. Use apenas números.`             |
| Caracteres inválidos      | `Caractere inválido. Permitido apenas números, "." e "-".`    |
| CEP incompleto (< 8 díg.) | `CEP incompleto. Informe todos os 8 dígitos.`                 |
| CEP não encontrado (404)  | `CEP não encontrado. Verifique os dígitos informados.`        |
| CEP inválido (400)        | `CEP inválido.`                                               |
| Erro de rede / servidor   | `Erro ao consultar o CEP. Tente novamente.`                   |

### Proteção contra consultas duplicadas

O componente rastreia o último CEP consultado (`ultimoCepConsultado`) e ignora novas chamadas para o mesmo valor, evitando requisições repetidas ao alterar foco.

---

## 9) Estrutura HTML gerada

```html
<div class="mb-1">
    <label for="cep" class="form-label">CEP <span class="text-danger">*</span></label>
    <input type="text" id="cep" name="cep" class="form-control"
           placeholder="00.000-000" maxlength="10" required>
    <small class="text-danger d-block" style="font-size:0.7rem;font-style:italic;"></small>
</div>
```

---

## 10) Normalização de atributos

| `data-*`         | Propriedade interna |
| ---------------- | ------------------- |
| `data-readonly`  | `ReadOnly`          |
| `data-disabled`  | `Disabled`          |
| `data-required`  | `Required`          |
| `data-api-url`   | `apiUrl`            |

---

## 11) Dicas práticas

✅ Escute `cep:sucesso` no `<form>` (não no input) para preencher campos dependentes  
✅ Escute `cep:limpo` para limpar os campos de endereço quando o CEP for apagado  
✅ Use `data-value` com 8 dígitos puros — a máscara e a consulta são disparadas automaticamente  
✅ Use `data-api-url` para ambientes com rota de proxy diferente  

❌ Não consulte as variáveis `vgcep_*` antes do evento `cep:sucesso` — podem estar vazias  
❌ Não use o campo para CEPs internacionais (apenas formato brasileiro de 8 dígitos)  

---

## 12) Dependências

- Bootstrap 5 (`form-control`, `is-invalid`, `text-danger`, `d-block`)
- JavaScript ES6+ (async/await, spread operator, CustomEvent)
- Backend com rota proxy `/api/v1/consulta-cep/{cep}` (ou URL customizada)

---

## 13) Compatibilidade

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 não suportado (usa async/await e CustomEvent)
