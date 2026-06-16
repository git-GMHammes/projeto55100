# field_date.js — fabrica de campo DATE (frontend)

Factory especializada para campos de **data** com:

- suporte a campo unico ou duplo (data inicial + data final)
- validacao de intervalo: minimo 1 ano atras, maximo 1 ano a frente
- regra de ordenacao: data principal sempre anterior a data secundaria
- sincronizacao dinamica do `min` do segundo campo
- feedback visual em tempo real
- controles de acesso (ReadOnly, Disabled, Required)

---

## 1) Atributos padrao

```js
const defaultDateAttributes = {
    doubleField: false,
    label: "Titulo do Campo",
    label2: "Segunda Data",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "date",
    min: "",
    max: "",
    id: "fname",
    id2: "fname2",
    name: "fname",
    name2: "fname2",
    value: "",
    value2: "",
    ReadOnly: false,
    Disabled: false,
    Required: false
};
```

### Significado de cada atributo

| Atributo | Tipo | Descricao |
|----------|------|-----------|
| `doubleField` | boolean | Exibe dois campos de data (ex: periodo) |
| `label` | string | Texto do rotulo do campo principal |
| `label2` | string | Texto do rotulo do campo secundario (doubleField) |
| `labelClass` | string | Classe CSS do `<label>` |
| `wrapperClass` | string | Classe CSS do container |
| `class` | string | Classe CSS do `<input>` |
| `type` | string | Sempre `date` |
| `min` | string | Data minima (YYYY-MM-DD). Padrao: 1 ano atras |
| `max` | string | Data maxima (YYYY-MM-DD). Padrao: 1 ano a frente |
| `id` | string | ID do campo principal |
| `id2` | string | ID do campo secundario (padrao: `{id}2`) |
| `name` | string | NAME do campo principal |
| `name2` | string | NAME do campo secundario (padrao: `{name}2`) |
| `value` | string | Valor inicial do campo principal |
| `value2` | string | Valor inicial do campo secundario |
| `ReadOnly` | boolean | Somente leitura |
| `Disabled` | boolean | Campo desabilitado |
| `Required` | boolean | Campo obrigatorio |

---

## 2) Regras de validacao

### Campo simples (doubleField: false)

| Regra | Comportamento |
|-------|--------------|
| Data minima | Nao pode ser anterior a 1 ano atras (ou `min` customizado) |
| Data maxima | Nao pode ser posterior a 1 ano a frente (ou `max` customizado) |
| Obrigatorio | Exibe erro se vazio e `Required: true` |

### Campo duplo (doubleField: true)

| Regra | Comportamento |
|-------|--------------|
| Data minima | Aplica-se apenas ao campo principal |
| Data maxima | Aplica-se a ambos os campos |
| Ordenacao | Data principal deve ser SEMPRE anterior a data secundaria |
| Min dinamico | O `min` do segundo campo e atualizado para o dia seguinte ao primeiro |
| Limpeza automatica | Se o segundo campo ja preenchido ficar invalido apos mudanca no primeiro, e limpo |

---

## 3) Como usar

### HTML basico (data simples)

```html
<form>
    <div class="field_date"
         data-label="Data de Nascimento"
         data-id="nascimento"
         data-name="nascimento"
         data-required="true">
    </div>
</form>
```

### HTML com campo duplo (periodo)

```html
<form>
    <div class="field_date"
         data-doublefield="true"
         data-label="Data Inicial"
         data-label2="Data Final"
         data-id="data_inicio"
         data-name="data_inicio"
         data-id2="data_fim"
         data-name2="data_fim"
         data-required="true">
    </div>
</form>
```

### HTML com min/max customizados

```html
<div class="field_date"
     data-label="Data do Evento"
     data-id="data_evento"
     data-name="data_evento"
     data-min="2025-01-01"
     data-max="2025-12-31"
     data-required="true">
</div>
```

---

## 4) Exemplos praticos

### Exemplo 1: Data simples obrigatoria

```html
<div class="field_date"
     data-label="Data de Referencia"
     data-id="data_ref"
     data-name="data_ref"
     data-required="true">
</div>
```

*Aceita datas entre 1 ano atras e 1 ano a frente.*

### Exemplo 2: Periodo (data inicial e final)

```html
<div class="field_date"
     data-doublefield="true"
     data-label="Data Inicial"
     data-label2="Data Final"
     data-id="periodo_inicio"
     data-name="periodo_inicio"
     data-id2="periodo_fim"
     data-name2="periodo_fim"
     data-required="true">
</div>
```

*Garante que a data inicial e sempre anterior a data final.*

### Exemplo 3: Data somente leitura

```html
<div class="field_date"
     data-label="Data de Emissao"
     data-id="data_emissao"
     data-name="data_emissao"
     data-value="2026-03-06"
     data-readonly="true">
</div>
```

### Exemplo 4: Data desabilitada

```html
<div class="field_date"
     data-label="Data de Vencimento"
     data-id="data_venc"
     data-name="data_venc"
     data-value="2026-06-30"
     data-disabled="true">
</div>
```

### Exemplo 5: Data com intervalo customizado

```html
<div class="field_date"
     data-label="Data da Diaria"
     data-id="data_diaria"
     data-name="data_diaria"
     data-min="2025-01-01"
     data-max="2026-12-31"
     data-required="true">
</div>
```

### Exemplo 6: Periodo com intervalo customizado

```html
<div class="field_date"
     data-doublefield="true"
     data-label="Inicio da Missao"
     data-label2="Fim da Missao"
     data-id="missao_inicio"
     data-name="missao_inicio"
     data-id2="missao_fim"
     data-name2="missao_fim"
     data-min="2025-01-01"
     data-max="2026-12-31"
     data-required="true">
</div>
```

---

## 5) Sincronizacao do campo secundario

Quando `doubleField: true`, o segundo campo e sincronizado automaticamente:

```
Usuario seleciona: Data Inicial = 2026-03-10
Sistema atualiza:  Data Final (min) = 2026-03-11

Usuario tenta:     Data Final = 2026-03-10
Resultado:         ❌ "Data Inicial deve ser anterior a Data Final."
```

Se o segundo campo ja estiver preenchido com valor menor ou igual ao primeiro apos uma mudanca, ele e limpo automaticamente.

---

## 6) Feedback visual

### Data valida
- Borda padrao
- Sem mensagem de erro

### Data invalida
- Classe `.is-invalid` (borda vermelha, Bootstrap)
- Mensagens possiveis:
  - *"Campo 'X' e obrigatorio."*
  - *"'X' nao pode ser anterior a DD/MM/AAAA."*
  - *"'X' nao pode ser posterior a DD/MM/AAAA."*
  - *"'Data Inicial' deve ser anterior a 'Data Final'."*

### Estilo das mensagens

- Fonte: `0.7rem`
- Estilo: `italic`
- Cor: vermelho (`text-danger`)
- Margem: `0px` (colada ao campo)

---

## 7) Estrutura HTML gerada

### Campo simples

```html
<div class="mb-1">
    <label for="data_ref" class="form-label">Data de Referencia <span class="text-danger">*</span></label>
    <input type="date" id="data_ref" name="data_ref" class="form-control"
           min="2025-03-06" max="2027-03-06" required>
    <small class="text-danger d-block"></small>
</div>
```

### Campo duplo

```html
<div class="mb-1">
    <label for="periodo_inicio" class="form-label">Data Inicial <span class="text-danger">*</span></label>
    <input type="date" id="periodo_inicio" name="periodo_inicio" class="form-control"
           min="2025-03-06" max="2027-03-06" required>

    <label for="periodo_fim" class="form-label mt-2">Data Final <span class="text-danger">*</span></label>
    <input type="date" id="periodo_fim" name="periodo_fim" class="form-control"
           max="2027-03-06" required>

    <small class="text-danger d-block"></small>
</div>
```

---

## 8) Integracao com formularios

### Valor enviado (campo simples)

```js
{ data_ref: "2026-03-10" }
```

### Valor enviado (campo duplo)

```js
{
    periodo_inicio: "2026-03-10",
    periodo_fim:    "2026-03-20"
}
```

### Validar no backend (PHP)

```php
$dataInicio = $_POST['periodo_inicio'] ?? '';
$dataFim    = $_POST['periodo_fim']    ?? '';

if (empty($dataInicio) || empty($dataFim)) {
    throw new Exception('Periodo obrigatorio.');
}

$d1 = new DateTime($dataInicio);
$d2 = new DateTime($dataFim);

if ($d1 >= $d2) {
    throw new Exception('Data inicial deve ser anterior a data final.');
}

$hoje    = new DateTime();
$minData = (clone $hoje)->modify('-1 year');
$maxData = (clone $hoje)->modify('+1 year');

if ($d1 < $minData || $d2 > $maxData) {
    throw new Exception('Datas fora do intervalo permitido.');
}
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

- Bootstrap 5 (classes CSS)
- JavaScript ES6+ (classes, arrow functions, template literals)

---

## 11) Compatibilidade

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Internet Explorer 11 — Nao suportado (usa ES6 e input[type=date]*)

> (*) `input[type=date]` nao e suportado no IE11. Use um datepicker como fallback se necessario.
