# field_radio.js — fabrica de grupo de botoes RADIO (frontend)

Factory especializada para grupos de **botoes radio** com:

- suporte a 1, 2 ou N opcoes no mesmo grupo
- selecao exclusiva por atributo `name` compartilhado
- layout empilhado (padrao) ou inline horizontal
- pre-selecao por opcao via `checked: true`
- validacao de selecao obrigatoria ao `change`
- modo desabilitado para o grupo inteiro

---

## 1) Atributos padrao

```js
const defaultRadioAttributes = {
    legend: "Titulo do Grupo",
    legendClass: "form-label fw-semibold d-block",
    wrapperClass: "mb-1",
    name: "radio_group",
    inline: false,
    Disabled: false,
    Required: false,
    options: [
        { id: "radio_1", value: "opcao1", label: "Opcao 1", checked: true },
        { id: "radio_2", value: "opcao2", label: "Opcao 2" }
    ]
};
```

### Significado de cada atributo

| Atributo | Tipo | Descricao |
|----------|------|-----------|
| `legend` | string | Texto do rotulo do grupo |
| `legendClass` | string | Classe CSS do `<label>` do grupo |
| `wrapperClass` | string | Classe CSS do container externo |
| `name` | string | NAME compartilhado entre todos os radios do grupo |
| `inline` | boolean | `true` = layout horizontal (`form-check-inline`) |
| `Disabled` | boolean | Desabilita todos os radios do grupo |
| `Required` | boolean | Exige selecao de ao menos uma opcao |
| `options` | array | Lista de opcoes (ver estrutura abaixo) |

### Estrutura de cada opcao

| Propriedade | Tipo | Obrigatoria | Descricao |
|-------------|------|-------------|-----------|
| `id` | string | sim | ID unico do `<input>` e `for` do `<label>` |
| `value` | string | sim | Valor enviado ao backend |
| `label` | string | sim | Texto visivel ao usuario |
| `checked` | boolean | nao | Pre-seleciona esta opcao (padrao: `false`) |

---

## 2) Regras de validacao

| Regra | Comportamento |
|-------|---------------|
| Obrigatorio | Exibe erro se nenhum radio estiver selecionado e `Required: true` |
| Validacao ao `change` | Roda imediatamente ao selecionar qualquer opcao |
| Estado inicial | Valida ao carregar; se `Required` e nenhum `checked`, erro aparece |
| Desabilitado | Sem validacao (grupo com `Disabled: true`) |

> **Nota HTML:** o atributo `required` e aplicado apenas no primeiro `<input>` do grupo.
> Isso e suficiente para o browser reconhecer a obrigatoriedade do grupo por `name`.

---

## 3) Como usar

### HTML basico (2 opcoes, obrigatorio)

```html
<form>
    <div class="field_radio"
         data-legend="Possui Veiculo Oficial?"
         data-name="veiculo_oficial"
         data-required="true"
         data-inline="true"
         data-options='[
             {"id":"veiculo_sim","value":"sim","label":"Sim"},
             {"id":"veiculo_nao","value":"nao","label":"Nao","checked":true}
         ]'>
    </div>
</form>
```

### HTML com N opcoes empilhadas

```html
<div class="field_radio"
     data-legend="Tipo de Transporte"
     data-name="transporte"
     data-required="true"
     data-options='[
         {"id":"transp_aereo","value":"aereo","label":"Aereo"},
         {"id":"transp_terrestre","value":"terrestre","label":"Terrestre","checked":true},
         {"id":"transp_maritimo","value":"maritimo","label":"Maritimo"},
         {"id":"transp_fluvial","value":"fluvial","label":"Fluvial"}
     ]'>
</div>
```

### HTML com opcao unica (aceite/confirmacao)

```html
<div class="field_radio"
     data-legend="Aceite os Termos"
     data-name="aceite"
     data-required="true"
     data-options='[{"id":"aceite_sim","value":"sim","label":"Sim, aceito os termos"}]'>
</div>
```

### HTML desabilitado

```html
<div class="field_radio"
     data-legend="Situacao"
     data-name="situacao"
     data-disabled="true"
     data-inline="true"
     data-options='[
         {"id":"sit_ativo","value":"ativo","label":"Ativo","checked":true},
         {"id":"sit_inativo","value":"inativo","label":"Inativo"}
     ]'>
</div>
```

---

## 4) Exemplos praticos

### Exemplo 1: Sim/Nao inline obrigatorio

```html
<div class="field_radio col-md-6"
     data-legend="Viagem Internacional?"
     data-name="internacional"
     data-required="true"
     data-inline="true"
     data-options='[{"id":"int_sim","value":"sim","label":"Sim"},{"id":"int_nao","value":"nao","label":"Nao","checked":true}]'>
</div>
```

### Exemplo 2: Categoria empilhada com pre-selecao

```html
<div class="field_radio col-md-6"
     data-legend="Categoria da Diaria"
     data-name="categoria"
     data-options='[
         {"id":"cat_a","value":"A","label":"Categoria A","checked":true},
         {"id":"cat_b","value":"B","label":"Categoria B"},
         {"id":"cat_c","value":"C","label":"Categoria C"}
     ]'>
</div>
```

### Exemplo 3: Obrigatorio sem pre-selecao (valida ao carregar)

```html
<div class="field_radio col-md-6"
     data-legend="Modalidade de Pagamento"
     data-name="modalidade_pgto"
     data-required="true"
     data-inline="true"
     data-options='[
         {"id":"pgto_credito","value":"credito","label":"Credito em Conta"},
         {"id":"pgto_cheque","value":"cheque","label":"Cheque"},
         {"id":"pgto_especie","value":"especie","label":"Especie"}
     ]'>
</div>
```

*Sem `checked` em nenhuma opcao: o feedback de erro aparece imediatamente ao carregar.*

---

## 5) Feedback visual

### Sem selecao (obrigatorio)
- Classe `.is-invalid` em todos os `<input>` do grupo
- Mensagem: *"Campo 'Titulo' e obrigatorio."*

### Opcao selecionada
- Remove `.is-invalid` de todos os radios
- Limpa mensagem de erro

### Estilo das mensagens

- Fonte: `0.7rem`
- Estilo: `italic`
- Cor: vermelho (`text-danger`)
- Margem superior: `2px`

---

## 6) Estrutura HTML gerada

### Layout empilhado (inline: false)

```html
<div class="mb-1">
    <label class="form-label fw-semibold d-block">
        Tipo de Transporte <span class="text-danger">*</span>
    </label>
    <div>
        <div class="form-check">
            <input class="form-check-input" type="radio" id="transp_aereo"
                   name="transporte" value="aereo" required>
            <label class="form-check-label" for="transp_aereo">Aereo</label>
        </div>
        <div class="form-check">
            <input class="form-check-input" type="radio" id="transp_terrestre"
                   name="transporte" value="terrestre" checked>
            <label class="form-check-label" for="transp_terrestre">Terrestre</label>
        </div>
    </div>
    <small class="text-danger d-block" style="font-size:0.7rem;..."></small>
</div>
```

### Layout inline (inline: true)

```html
<div class="mb-1">
    <label class="form-label fw-semibold d-block">Sim ou Nao?</label>
    <div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="opt_sim"
                   name="resposta" value="sim" required>
            <label class="form-check-label" for="opt_sim">Sim</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="opt_nao"
                   name="resposta" value="nao" checked>
            <label class="form-check-label" for="opt_nao">Nao</label>
        </div>
    </div>
    <small class="text-danger d-block" style="font-size:0.7rem;..."></small>
</div>
```

---

## 7) Integracao com formularios

### Valor enviado

```js
// Leitura via JS
const valor = document.querySelector('input[name="transporte"]:checked')?.value;
// => "terrestre"
```

### Validar no backend (PHP)

```php
$transporte = $_POST['transporte'] ?? '';

$opcoes_validas = ['aereo', 'terrestre', 'maritimo', 'fluvial'];

if (empty($transporte) || !in_array($transporte, $opcoes_validas, true)) {
    throw new Exception('Tipo de transporte invalido ou nao informado.');
}
```

---

## 8) Diferenca: `data-options` via HTML vs JS direto

### Via HTML (data-*)

```html
<div class="field_radio"
     data-name="tipo"
     data-options='[{"id":"t1","value":"a","label":"Opcao A","checked":true}]'>
</div>
```

> O valor de `data-options` deve ser JSON valido em aspas simples no atributo HTML.

### Via JavaScript (instanciacao direta)

```js
const campo = new RadioField({
    legend: "Tipo",
    name: "tipo",
    inline: true,
    Required: true,
    options: [
        { id: "t1", value: "a", label: "Opcao A", checked: true },
        { id: "t2", value: "b", label: "Opcao B" }
    ]
});

document.querySelector('#meu-container').innerHTML = campo.render();
```

---

## 9) Seguranca

### Validacoes frontend sao apenas UX

**SEMPRE valide no backend**. Usuarios podem:
- Desabilitar JavaScript
- Manipular o DOM via DevTools
- Enviar requisicoes diretas via cURL/Postman

---

## 10) Dependencias

- Bootstrap 5 (classes `form-check`, `form-check-inline`, `is-invalid`, `text-danger`)
- JavaScript ES6+ (classes, arrow functions, template literals, `forEach`)

---

## 11) Compatibilidade

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Internet Explorer 11 — Nao suportado (usa ES6)
