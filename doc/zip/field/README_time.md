# field_time.js — fábrica de campo de hora (frontend)

Factory minimalista que cria campos `<input type="time">` automaticamente em elementos com classe `field_time`, aplicando:

- estrutura visual (label + input)
- classes de estilo (Bootstrap/default)
- controles de acesso (ReadOnly, Disabled, Required)
- intervalo de minutos configurável via `step`

Não possui formatação manual nem validação customizada — delega ao comportamento nativo do navegador para `type="time"`.

---

## 1) Atributos padrão

```js
const defaultTimeAttributes = {
    label: 'Título do Campo',
    labelClass: 'form-label',
    wrapperClass: 'mb-1',
    class: 'form-control',
    id: 'ftime',
    name: 'ftime',
    value: '',
    step: '60',
    ReadOnly: false,
    Disabled: false,
    Required: false
};
```

### Significado de cada atributo

| Atributo       | Tipo    | Descrição                                                  |
| -------------- | ------- | ---------------------------------------------------------- |
| `label`        | string  | Texto do rótulo do campo                                   |
| `labelClass`   | string  | Classe CSS do `<label>`                                    |
| `wrapperClass` | string  | Classe CSS do container                                    |
| `class`        | string  | Classe CSS do `<input>`                                    |
| `id`           | string  | ID do input                                                |
| `name`         | string  | Atributo NAME do input (form)                              |
| `value`        | string  | Valor inicial no formato `HH:MM` (ex: `"08:30"`)           |
| `step`         | string  | Incremento em **segundos** (padrão: `"60"` = 1 minuto)     |
| `ReadOnly`     | boolean | Campo somente leitura (padrão: `false`)                    |
| `Disabled`     | boolean | Campo desabilitado (padrão: `false`)                       |
| `Required`     | boolean | Campo obrigatório (padrão: `false`)                        |

### Atributo `step` — referência rápida

| `step` (segundos) | Granularidade   | Uso típico                         |
| ----------------- | --------------- | ---------------------------------- |
| `"60"`            | 1 minuto        | Padrão — maioria dos campos        |
| `"300"`           | 5 minutos       | Agendamentos com intervalos fixos  |
| `"900"`           | 15 minutos      | Horários comerciais                |
| `"1800"`          | 30 minutos      | Turnos / blocos de tempo           |
| `"3600"`          | 1 hora          | Apenas hora cheia                  |
| `"1"`             | 1 segundo       | Cronometragem, precisão máxima     |

---

## 2) Como usar

### HTML mínimo

```html
<form>
    <div class="field_time"
         data-label="Hora de Início"
         data-id="hora_inicio"
         data-name="hora_inicio"
         data-required="true">
    </div>
</form>
```

O script encontra automaticamente elementos com classe `.field_time` dentro de `<form>` e renderiza o campo.

---

## 3) Exemplos práticos

### Exemplo 1: Campo de hora simples obrigatório

```html
<div class="field_time col-md-3"
     data-label="Hora de Saída"
     data-id="hora_saida"
     data-name="hora_saida"
     data-required="true">
</div>
```

### Exemplo 2: Campo com valor pré-preenchido

```html
<div class="field_time col-md-3"
     data-label="Hora de Início"
     data-id="hora_inicio"
     data-name="hora_inicio"
     data-value="08:00">
</div>
```

### Exemplo 3: Campo com granularidade de 15 minutos

```html
<div class="field_time col-md-3"
     data-label="Horário da Reunião"
     data-id="hora_reuniao"
     data-name="hora_reuniao"
     data-step="900"
     data-required="true">
</div>
```

*O seletor nativo do navegador exibirá apenas opções em múltiplos de 15 minutos.*

### Exemplo 4: Campo com granularidade de 1 hora

```html
<div class="field_time col-md-3"
     data-label="Hora Cheia"
     data-id="hora_cheia"
     data-name="hora_cheia"
     data-step="3600">
</div>
```

### Exemplo 5: Par de campos hora início / hora fim

```html
<form class="row">
    <div class="field_time col-md-3"
         data-label="Hora de Início"
         data-id="hora_inicio"
         data-name="hora_inicio"
         data-value="08:00"
         data-required="true">
    </div>

    <div class="field_time col-md-3"
         data-label="Hora de Término"
         data-id="hora_fim"
         data-name="hora_fim"
         data-value="17:00"
         data-required="true">
    </div>
</form>
```

### Exemplo 6: Campo somente leitura

```html
<div class="field_time col-md-3"
     data-label="Hora Registrada"
     data-id="hora_reg"
     data-name="hora_reg"
     data-value="14:30"
     data-readonly="true">
</div>
```

### Exemplo 7: Campo desabilitado

```html
<div class="field_time col-md-3"
     data-label="Hora Original"
     data-id="hora_original"
     data-name="hora_original"
     data-value="09:00"
     data-disabled="true">
</div>
```

---

## 4) Valor enviado pelo formulário

O campo envia o valor no formato `HH:MM` (24 horas), conforme padrão do `<input type="time">`:

```
hora_inicio=08:00
hora_fim=17:30
```

No backend CakePHP, o campo é recebido como string e pode ser validado com:

```php
$validator->time('hora_inicio', 'Hora de início inválida.');
```

---

## 5) Estrutura HTML gerada

```html
<div class="mb-1">
    <label for="hora_inicio" class="form-label">
        Hora de Início <span class="text-danger">*</span>
    </label>
    <input type="time" id="hora_inicio" name="hora_inicio"
           class="form-control" step="60" value=""
           required="required">
</div>
```

---

## 6) Normalização de atributos

| `data-*`        | Propriedade interna |
| --------------- | ------------------- |
| `data-readonly` | `ReadOnly`          |
| `data-disabled` | `Disabled`          |
| `data-required` | `Required`          |

---

## 7) Comportamento em ReadOnly / Disabled

- `ReadOnly`: input recebe `readonly="readonly"` — valor visível, não editável, **enviado** no submit
- `Disabled`: input recebe `disabled="disabled"` — valor visível, não editável, **não enviado** no submit

---

## 8) Validação

O `field_time.js` **não adiciona validação customizada**. A validação é delegada ao navegador via atributo `required="required"` no input HTML5.

Para validação adicional (ex: garantir que hora fim > hora início), adicione listener manual na página:

```js
document.getElementById('hora_fim').addEventListener('blur', function () {
    var inicio = document.getElementById('hora_inicio').value;
    var fim    = document.getElementById('hora_fim').value;

    if (inicio && fim && fim <= inicio) {
        // exibir mensagem de erro manualmente
        console.warn('Hora de término deve ser posterior à hora de início.');
    }
});
```

---

## 9) Dicas práticas

✅ Use `data-value="HH:MM"` para pré-preencher (formato 24h)  
✅ Use `data-step` para limitar a granularidade disponível no seletor nativo  
✅ Para campos de duração (não horário), prefira `field_input.js` com validação manual  

❌ Não use para entrada de data — use `field_date.js`  
❌ Não use `data-value` com formato 12h (AM/PM) — o input nativo espera `HH:MM` em 24h  

---

## 10) Dependências

- Bootstrap 5 (`form-control`, `form-label`, `mb-1`)
- JavaScript ES5+ (compatível com IIFE do SAD v1 — usa `Object.assign`)

---

## 11) Compatibilidade

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+ (suporte nativo a `type="time"` desde iOS 12.2)
- ⚠️ IE11 — `type="time"` não é suportado nativamente; o campo degradará para `type="text"`
