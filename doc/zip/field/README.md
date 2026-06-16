# Field Factory System — Documentação Geral

Sistema modular de fábricas de campos (field factories) para construção declarativa de formulários HTML com validação em tempo real.

---

## 📚 Índice de Componentes

Cada componente possui sua própria documentação detalhada:

- **[README_input.md](README_input.md)** — Campos text e hidden com validação de caracteres
- **[README_textarea.md](README_textarea.md)** — Campo textarea com contador dinâmico, limites min/max e validação de caracteres
- **[README_cpf.md](README_cpf.md)** — Campo CPF com formatação e validação de dígitos verificadores
- **[README_cnpj.md](README_cnpj.md)** — Campo CNPJ com suporte ao novo formato alfanumérico (2026)
- **[README_email.md](README_email.md)** — Campo e-mail com validação de domínios permitidos
- **[README_password.md](README_password.md)** — Campo senha com força, confirmação e toggle visual
- **[README_date.md](README_date.md)** — Campo data simples ou duplo com validação de intervalo e ordenação
- **[README_time.md](README_time.md)** — Campo de hora com granularidade configurável via `step`
- **[README_radio.md](README_radio.md)** — Grupo de botões radio com suporte a N opções, layout inline e validação de seleção obrigatória
- **[README_checkbox.md](README_checkbox.md)** — Grupo de checkboxes com múltipla seleção, notação `name[]` e validação de seleção mínima
- **[README_field_select.md](README_field_select.md)** — Select com busca em tempo real, suporte a 60k+ registros, item selecionado fixado no topo e carregamento via JSON externo
- **[README_monetary.md](README_monetary.md)** — Campo monetário com formatação brasileira (R$), dois inputs (display + hidden raw) e integração com `SadUtils.fillField`
- **[README_celular_telefone.md](README_celular_telefone.md)** — Campo celular/telefone com máscara dinâmica (fixo 10 ou celular 11 dígitos) e validação de DDD ANATEL
- **[README_cep.md](README_cep.md)** — Campo CEP com máscara, consulta automática à API proxy, variáveis globais `vgcep_*` e eventos `cep:sucesso` / `cep:limpo`
- **[README_sei.md](README_sei.md)** — Campo SEI com máscara `SEI-15NNNN/NNNNNN/20NN`, input hidden (raw) + visível (display) e formatação via `SadFmt.sei()`

---

## 🏗️ Arquitetura do Sistema

### Padrão Factory

Cada tipo de campo segue o padrão **Factory**, encapsulando:

1. **Atributos padrão** (JSON de configuração)
2. **Classe de construção** (XxxField)
3. **Método render()** (geração de HTML)
4. **Validação em tempo real** (attachXxxValidation)
5. **Auto-execução** (IIFE no carregamento)

### Estrutura de arquivo

```
field/
├── README.md                 # Este arquivo (índice geral)
├── README_input.md           # Doc do field_input.js
├── README_textarea.md        # Doc do field_textarea.js
├── README_cpf.md             # Doc do field_cpf.js
├── README_cnpj.md            # Doc do field_cnpj.js
├── README_email.md                # Doc do field_email.js
├── README_password.md             # Doc do field_password.js
├── README_date.md                 # Doc do field_date.js
├── README_time.md                 # Doc do field_time.js
├── README_radio.md                # Doc do field_radio.js
├── README_checkbox.md             # Doc do field_checkbox.js
├── README_field_select.md         # Doc do field_select.js
├── README_monetary.md             # Doc do field_monetary.js
├── README_celular_telefone.md     # Doc do field_celular_telefone.js
├── README_cep.md                  # Doc do field_cep.js
├── README_sei.md                  # Doc do field_sei.js
├── field_input.js                 # Factory de campos text/hidden
├── field_textarea.js              # Factory de campo textarea
├── field_cpf.js                   # Factory de campo CPF
├── field_cnpj.js                  # Factory de campo CNPJ
├── field_email.js                 # Factory de campo e-mail
├── field_password.js              # Factory de campo senha
├── field_date.js                  # Factory de campo data (simples ou duplo)
├── field_time.js                  # Factory de campo de hora (type="time")
├── field_radio.js                 # Factory de grupo de botões radio
├── field_checkbox.js              # Factory de grupo de checkboxes (múltipla seleção)
├── field_select.js                # Factory de select com busca em tempo real (60k+ registros)
├── field_monetary.js              # Factory de campo monetário (R$, display + hidden raw)
├── field_celular_telefone.js      # Factory de campo celular/telefone com máscara dinâmica
├── field_cep.js                   # Factory de campo CEP com consulta automática à API
└── field_sei.js                   # Factory de campo SEI com máscara e hidden raw
```

---

## 🎯 Conceitos Fundamentais

### 1. Configuração declarativa (data-*)

Os campos são configurados via atributos `data-*` no HTML:

```html
<div class="field_input" 
     data-label="Nome Completo" 
     data-id="nome" 
     data-name="nome" 
     data-required="true">
</div>
```

### 2. Auto-renderização (IIFE)

Cada componente procura automaticamente por seus elementos na página:

```js
(function () {
    const fieldContainers = document.querySelectorAll('form .field_xxx');
    fieldContainers.forEach(container => {
        // Renderiza campo automaticamente
    });
})();
```

### 3. Validação em tempo real

Validação ocorre nos eventos:
- **input** — enquanto digita
- **blur** — ao sair do campo
- **change** — ao selecionar uma opção (radio/checkbox)

### 4. Normalização de atributos

Atributos HTML `data-*` são convertidos para lowercase pelo navegador. Os componentes normalizam:

```js
// data-readonly → ReadOnly
// data-disabled → Disabled
// data-required → Required
// data-doublefield → doubleField
```

### 5. Feedback visual consistente

Todos os componentes usam:
- Classe `.is-invalid` (Bootstrap) para borda vermelha
- Mensagens em `<small class="text-danger">` com estilo compacto
- Fonte: `0.7rem`, estilo: `italic`, margem: `0px`

---

## 🛠️ Como Usar o Sistema

### Passo 1: Incluir Bootstrap CSS

```html
<link href="../../css/bootstrap.min.css" rel="stylesheet">
```

### Passo 2: Incluir os componentes JavaScript

```html
<script src="../sad/form/field/field_input.js"></script>
<script src="../sad/form/field/field_textarea.js"></script>
<script src="../sad/form/field/field_cpf.js"></script>
<script src="../sad/form/field/field_cnpj.js"></script>
<script src="../sad/form/field/field_email.js"></script>
<script src="../sad/form/field/field_password.js"></script>
<script src="../sad/form/field/field_date.js"></script>
<script src="../sad/form/field/field_time.js"></script>
<script src="../sad/form/field/field_radio.js"></script>
<script src="../sad/form/field/field_checkbox.js"></script>
<script src="../sad/form/field/field_select.js"></script>
<script src="../sad/form/field/field_monetary.js"></script>
<script src="../sad/form/field/field_celular_telefone.js"></script>
<script src="../sad/form/field/field_cep.js"></script>
<script src="../sad/form/field/field_sei.js"></script>
```

### Passo 3: Criar elementos HTML

```html
<form class="row">
    <!-- Campo de texto -->
    <div class="field_input col-md-6" 
         data-label="Nome" 
         data-id="nome" 
         data-name="nome" 
         data-required="true">
    </div>

    <!-- Campo textarea -->
    <div class="field_textarea col-md-6" 
         data-label="Observações" 
         data-id="obs" 
         data-name="obs" 
         data-required="true"
         data-maxlength="500"
         data-minlength="10">
    </div>

    <!-- Campo CPF -->
    <div class="field_cpf col-md-6" 
         data-label="CPF" 
         data-id="cpf" 
         data-name="cpf" 
         data-required="true">
    </div>

    <!-- Campo e-mail -->
    <div class="field_email col-md-6" 
         data-label="E-mail" 
         data-id="email" 
         data-name="email" 
         data-required="true">
    </div>

    <!-- Campo senha -->
    <div class="field_password col-md-6"
         data-label="Senha"
         data-strongpassword="true"
         data-minlength="8"
         data-required="true">
    </div>

    <!-- Grupo radio -->
    <div class="field_radio col-md-6"
         data-legend="Tipo de Transporte"
         data-name="transporte"
         data-required="true"
         data-inline="true"
         data-options='[{"id":"t1","value":"aereo","label":"Aéreo","checked":true},{"id":"t2","value":"terrestre","label":"Terrestre"}]'>
    </div>
</form>
```

### Passo 4: Pronto!

Os campos são renderizados automaticamente ao carregar a página.

---

## 📋 Atributos Comuns

Todos os componentes compartilham estes atributos:

| Atributo       | Tipo    | Descrição               | Padrão           |
| -------------- | ------- | ----------------------- | ---------------- |
| `label`        | string  | Texto do rótulo         | Campo específico |
| `labelClass`   | string  | Classe CSS do label     | `"form-label"`   |
| `wrapperClass` | string  | Classe CSS do container | `"mb-1"`         |
| `class`        | string  | Classe CSS do input     | `"form-control"` |
| `id`           | string  | ID do input             | Campo específico |
| `name`         | string  | NAME do input (form)    | Campo específico |
| `value`        | string  | Valor inicial           | `""`             |
| `ReadOnly`     | boolean | Somente leitura         | `false`          |
| `Disabled`     | boolean | Campo desabilitado      | `false`          |
| `Required`     | boolean | Campo obrigatório       | `false`          |

---

## 🎨 Estilos Padrão (Bootstrap 5)

### Classes CSS utilizadas

- `form-label` — estilo do label
- `form-control` — estilo do input
- `is-invalid` — borda vermelha (erro)
- `text-danger` — texto vermelho (mensagem de erro)
- `mb-1` — margem inferior pequena (0.25rem)
- `d-block` — display block

### Personalização

Para alterar estilos globalmente, modifique:

```js
const defaultXxxAttributes = {
    labelClass: "form-label fw-bold",      // Label em negrito
    wrapperClass: "mb-3",                  // Mais espaçamento
    class: "form-control form-control-lg"  // Input grande
};
```

---

## ✅ Validações Disponíveis

### field_input.js
- ✅ Validação de caracteres especiais
- ✅ Validação de números
- ✅ Validação de letras

### field_cpf.js
- ✅ Formatação XXX.XXX.XXX-XX
- ✅ Validação de dígitos verificadores
- ✅ Rejeição de CPFs inválidos (000.000.000-00, etc)

### field_cnpj.js
- ✅ Formatação XX.XXX.XXX/XXXX-XX
- ✅ Validação de dígitos verificadores
- ✅ Suporte a formato alfanumérico (2026+)
- ✅ Rejeição de CNPJs inválidos

### field_email.js
- ✅ Validação de formato RFC
- ✅ Validação de domínios permitidos (whitelist)
- ✅ Suporte a subdomínios
- ✅ Conversão para lowercase

### field_password.js
- ✅ Validação de senha forte (letra+número+especial)
- ✅ Campo duplo (senha + confirmação)
- ✅ Validação de igualdade
- ✅ Toggle visual (mostrar/ocultar)
- ✅ Controle de minlength/maxlength

### field_date.js
- ✅ Campo simples ou duplo (data inicial + data final)
- ✅ Limite mínimo: 1 ano atrás
- ✅ Limite máximo: 1 ano à frente
- ✅ Regra de ordenação: data principal sempre anterior à secundária
- ✅ Sincronização dinâmica do `min` do segundo campo
- ✅ min/max customizáveis

### field_radio.js
- ✅ Suporta 1, 2 ou N opções no mesmo grupo
- ✅ Seleção exclusiva por `name` compartilhado
- ✅ Layout empilhado (padrão) ou inline (`data-inline="true"`)
- ✅ Pré-seleção via `checked: true` por opção
- ✅ Campo obrigatório com validação ao `change`
- ✅ Modo desabilitado para o grupo inteiro

### field_checkbox.js
- ✅ Suporta 1, 2 ou N opções com múltipla seleção simultânea
- ✅ Envia `name[]` ao backend (PHP recebe array de valores)
- ✅ Layout empilhado (padrão) ou inline (`data-inline="true"`)
- ✅ Pré-seleção independente por opção via `checked: true`
- ✅ Campo obrigatório: exige ao menos uma opção marcada
- ✅ Modo desabilitado para o grupo inteiro

### field_select.js
- ✅ Suporte a 60k+ registros com filtro em tempo real (debounce 200ms)
- ✅ Item selecionado fixado no topo da lista com destaque visual
- ✅ Carregamento via `data-src` (fetch JSON externo) ou `data-options` (inline)
- ✅ Busca em todos os campos string do objeto (não só no label)
- ✅ Submissão via `<input type="hidden">` (select não tem `name`)
- ✅ Contador dinâmico: "Exibindo N de M registros"
- ✅ Badge com botão de remoção da seleção atual
- ✅ Pré-seleção por `data-value` (resolve label automaticamente)
- ✅ Modo desabilitado; campo obrigatório com validação
- ✅ Proteção contra XSS nos valores renderizados

### field_monetary.js
- ✅ Formatação automática R$ centavo-primeiro (`0,04 → 0,47 → 4,73…`)
- ✅ Dois inputs: display visível (BR) + hidden raw (`1229.18`) para o backend
- ✅ Integração com `SadUtils.fillField(id, raw)` para preenchimento via API
- ✅ Propagação de eventos `input` e `change` no hidden para listeners externos
- ✅ Campo obrigatório com validação ao `blur` e `input`

### field_celular_telefone.js
- ✅ Máscara dinâmica: `(XX) XXXX-XXXX` (fixo, 10 dígitos) ou `(XX) XXXXX-XXXX` (celular, 11 dígitos)
- ✅ Validação de DDD contra lista completa ANATEL (todos os estados)
- ✅ Rejeição de letras e caracteres especiais em tempo real
- ✅ Pré-preenchimento com dígitos brutos (máscara aplicada automaticamente)
- ✅ Validação de número incompleto ao sair do campo (`blur`)

### field_cep.js
- ✅ Máscara automática `XX.XXX-XXX` durante a digitação
- ✅ Consulta automática à API proxy ao completar 8 dígitos
- ✅ Variáveis globais `vgcep_*` preenchidas após consulta bem-sucedida
- ✅ Eventos customizados `cep:sucesso` e `cep:limpo` (com `bubbles: true`)
- ✅ URL da API configurável via `data-api-url` ou `window.vgcep_apiUrl`
- ✅ Proteção contra consultas duplicadas e consultas concorrentes

### field_time.js
- ✅ Campo `<input type="time">` com granularidade configurável via `step`
- ✅ Pré-preenchimento via `data-value` no formato `HH:MM`
- ✅ Suporte a ReadOnly, Disabled e Required (obrigatório nativo HTML5)
- ✅ Compatível com ES5 (usa `Object.assign` em vez de spread)

### field_sei.js
- ✅ Máscara `SEI-15NNNN/NNNNNN/20NN` com partes fixas protegidas contra `Backspace`
- ✅ Dois inputs: visível com máscara + hidden raw (enviado ao backend)
- ✅ Pré-preenchimento com valor raw via `data-value`
- ✅ Validação de campo obrigatório e máscara incompleta
- ✅ Formatação em listas via `SadFmt.sei(val)` (`core/fmt.js`)

---

## 🔒 Segurança

### ⚠️ Validações frontend são apenas UX

**SEMPRE valide no backend**. Usuários podem:
- Desabilitar JavaScript
- Manipular DOM via DevTools
- Enviar requisições diretas via cURL/Postman

### Boas práticas

✅ **Valide no backend** com as mesmas regras  
✅ **Use HTTPS** para tráfego seguro  
✅ **Hash senhas** com bcrypt/argon2  
✅ **Sanitize inputs** para prevenir XSS/SQL Injection  
✅ **Limite taxa de requisições** (rate limiting)  

---

## 🧩 Extensibilidade

### Criar novo componente

Para adicionar um novo tipo de campo, siga o padrão:

```js
// 1. Defina atributos padrão
const defaultXxxAttributes = {
    label: "Meu Campo",
    type: "text",
    // ... outros atributos
};

// 2. Crie classe de construção
class XxxField {
    constructor(attributes) {
        this.attributes = { ...defaultXxxAttributes, ...attributes };
    }

    render() {
        // Gera HTML
        return htmlString;
    }
}

// 3. Implemente validação
function attachXxxValidation(container, inputElement, attributes) {
    // Lógica de validação
}

// 4. Auto-execução
(function () {
    const fieldContainers = document.querySelectorAll('form .field_xxx');
    fieldContainers.forEach(container => {
        const xxxField = new XxxField(container.dataset);
        container.innerHTML = xxxField.render();
        attachXxxValidation(container, inputElement, xxxField.attributes);
    });
})();
```

### Adicionar documentação

Crie `README_xxx.md` seguindo o padrão dos existentes.

---

## 📦 Dependências

### Obrigatórias
- **Bootstrap 5** — Framework CSS para estilos
- **JavaScript ES6+** — Classes, arrow functions, template literals

### Opcionais
- **jQuery** — Não é necessário (componentes em vanilla JS)

---

## 🌐 Compatibilidade

- ✅ **Chrome/Edge** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ⚠️ **Internet Explorer 11** — Não suportado (usa ES6)

---

## 📖 Exemplos Completos

### Formulário de cadastro

```html
<form class="row">
    <div class="field_input col-md-6" 
         data-label="Nome Completo" 
         data-id="nome" 
         data-name="nome" 
         data-required="true">
    </div>

    <div class="field_cpf col-md-6" 
         data-label="CPF" 
         data-id="cpf" 
         data-name="cpf" 
         data-required="true">
    </div>

    <div class="field_email col-md-6" 
         data-label="E-mail" 
         data-id="email" 
         data-name="email" 
         data-required="true">
    </div>

    <div class="field_password col-md-6"
         data-label="Senha"
         data-doublefield="true"
         data-equalfields="true"
         data-strongpassword="true"
         data-minlength="8"
         data-required="true">
    </div>

    <div class="field_radio col-md-6"
         data-legend="Como nos conheceu?"
         data-name="origem"
         data-required="true"
         data-options='[{"id":"orig_indicacao","value":"indicacao","label":"Indicação"},{"id":"orig_internet","value":"internet","label":"Internet"},{"id":"orig_outro","value":"outro","label":"Outro"}]'>
    </div>

    <div class="col-12 mt-3">
        <button type="submit" class="btn btn-primary">Cadastrar</button>
    </div>
</form>
```

### Formulário de empresa

```html
<form class="row">
    <div class="field_input col-md-6" 
         data-label="Razão Social" 
         data-id="razao_social" 
         data-name="razao_social" 
         data-required="true">
    </div>

    <div class="field_cnpj col-md-6" 
         data-label="CNPJ" 
         data-id="cnpj" 
         data-name="cnpj" 
         data-allowletters="true" 
         data-required="true">
    </div>

    <div class="field_email col-md-6" 
         data-label="E-mail Corporativo" 
         data-id="email_corp" 
         data-name="email_corp" 
         data-alloweddomains="empresa.com.br" 
         data-required="true">
    </div>

    <div class="col-12 mt-3">
        <button type="submit" class="btn btn-success">Salvar Empresa</button>
    </div>
</form>
```

---

## 🐛 Troubleshooting

### Campos não aparecem

1. Verifique se o script está incluído **após** o HTML
2. Confirme que a classe está correta (`field_input`, não `field-input`)
3. Abra o Console (F12) para ver erros JavaScript

### Validação não funciona

1. Verifique se o campo está dentro de um `<form>`
2. Confirme que os atributos estão em lowercase (`data-required`, não `data-Required`)
3. Teste remover `ReadOnly` e `Disabled`

### Estilo não aparece

1. Confirme que Bootstrap CSS está incluído
2. Verifique cache do navegador (Ctrl+F5)
3. Use inline styles como fallback

---

## 📝 Contribuindo

### Padrões de código

- Use **camelCase** para variáveis JavaScript
- Use **kebab-case** para atributos HTML (`data-my-attr`)
- Documente novos componentes em `README_xxx.md`
- Siga estrutura existente (JSON + Class + Validation + IIFE)

### Checklist para novo componente

- [ ] Criar arquivo `field_xxx.js`
- [ ] Criar documentação `README_xxx.md`
- [ ] Adicionar exemplo em `index.php`
- [ ] Testar validação em tempo real
- [ ] Testar atributos ReadOnly/Disabled/Required
- [ ] Testar doubleField (quando aplicável)
- [ ] Testar N opções e layout inline (para radio/checkbox)
- [ ] Validar compatibilidade cross-browser
- [ ] Adicionar link neste README.md
- [ ] Atualizar estrutura de arquivos e contagem de componentes neste README.md

---

## 📄 Licença

Este sistema é proprietário do projeto Detran — CakePHP.

---

## 🙋 Suporte

e-mail: gustavo.hammes@loglabdigital.com.br

Para dúvidas ou problemas:

1. Consulte o README específico do componente
2. Verifique exemplos em `index.php`
3. Abra o Console do navegador (F12) para erros
4. Entre em contato com a equipe de desenvolvimento

---

**Última atualização:** Maio 2026
**Versão do sistema:** 2.5
**Componentes disponíveis:** 15 (Input, Textarea, CPF, CNPJ, Email, Password, Date, Time, Radio, Checkbox, Select, Monetary, Celular/Telefone, CEP, SEI)




---

## 📌 Metadados do Autor

| Campo               | Informação                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Nome**            | Gustavo Hammes 🐼                                                                                                         |
| **Projeto**         | Registro e Cálculo de Diárias                                                                                            |
| **E-mail**          | [gustavo.hammes@loglabdigital.com.br](mailto:gustavo.hammes@loglabdigital.com.br)                                        |
| **Whatsapp**        | [(21) 9 8055-8545](https://wa.me/5521980558545)                                                                          |
| **Stack principal** | PHP (Laravel, Symfony, Cake, Codeigniter), Java Spring Boot, JS/TS (React, Vue, Node.js), Mobile (React Native, Flutter) |

> 🧠 *Este documento faz parte do projeto **Registro e Cálculo de Diárias** – desenvolvido por Gustavo Hammes.*
