// JSON com atributos padrão do campo monetário
const defaultMonetaryAttributes = {
    label: 'Valor',
    labelClass: 'form-label',
    wrapperClass: 'mb-1',
    class: 'form-control',
    id: 'monetary_field',
    name: 'monetary_field',
    value: '',
    ReadOnly: false,
    Disabled: false,
    Required: false
};

// Classe para criar campos monetários (formato brasileiro: 1.000,00)
class MonetaryField {
    constructor(attributes) {
        this.attributes = { ...defaultMonetaryAttributes, ...attributes };
    }

    render() {
        const {
            label, labelClass, wrapperClass,
            class: inputClass,
            id, name,
            ReadOnly, Disabled, Required
        } = this.attributes;

        const displayId  = id + '_display';
        const isReadOnly = normalizeBoolean(ReadOnly, false);
        const isDisabled = normalizeBoolean(Disabled, false);
        const isRequired = normalizeBoolean(Required, false);

        let html = `<div class="${wrapperClass}">`;

        if (label) {
            const req = isRequired ? ' <span class="text-danger">*</span>' : '';
            html += `<label for="${displayId}" class="${labelClass}">${label}${req}</label>`;
        }

        let extra = '';
        if (isReadOnly) { extra += ' readonly="readonly"'; }
        if (isDisabled) { extra += ' disabled="disabled"'; }

        // Input visível: exibe formato BR (1.000,00) — sem name, não enviado pelo form
        html += `<input type="text" id="${displayId}" class="${inputClass} field-monetary-display" placeholder="0,00" autocomplete="off"${extra}>`;

        // Input hidden: armazena valor raw (1000.00) — enviado pelo form e encontrado por #id
        html += `<input type="hidden" id="${id}" name="${name}" class="field-monetary-raw">`;

        html += '</div>';
        return html;
    }
}

function normalizeBoolean(value, fallback) {
    if (fallback === undefined) { fallback = true; }
    if (value === undefined || value === null || value === '') { return fallback; }
    if (typeof value === 'boolean') { return value; }
    if (typeof value === 'string') {
        var p = value.trim().toLowerCase();
        if (p === 'true'  || p === '1') { return true; }
        if (p === 'false' || p === '0') { return false; }
    }
    return Boolean(value);
}

function normalizeDatasetAttributes(dataset) {
    var normalized = {};
    for (var key in dataset) {
        var normalizedKey = key;
        if (key === 'readonly')       { normalizedKey = 'ReadOnly'; }
        else if (key === 'disabled')  { normalizedKey = 'Disabled'; }
        else if (key === 'required')  { normalizedKey = 'Required'; }
        normalized[normalizedKey] = dataset[key];
    }
    return normalized;
}

// ── Conversores ──────────────────────────────────────────────────────────────

/**
 * String de dígitos → exibição BR (centavo primeiro).
 * '47340' → '473,40' | '122918' → '1.229,18' | '' → ''
 */
function digitsToDisplay(digits) {
    if (!digits) { return ''; }
    var padded  = digits.padStart(3, '0');
    var intPart = padded.slice(0, padded.length - 2).replace(/^0+/, '') || '0';
    var decPart = padded.slice(-2);
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return intPart + ',' + decPart;
}

/**
 * String de dígitos → valor raw para o backend.
 * '47340' → '473.40' | '122918' → '1229.18' | '' → ''
 */
function digitsToRaw(digits) {
    if (!digits) { return ''; }
    var padded  = digits.padStart(3, '0');
    var intPart = padded.slice(0, padded.length - 2).replace(/^0+/, '') || '0';
    var decPart = padded.slice(-2);
    return intPart + '.' + decPart;
}

/**
 * Valor raw da API → string de dígitos.
 * '171.14' → '17114' | '1000.00' → '100000' | '' | null → ''
 */
function rawToDigits(raw) {
    if (raw === '' || raw === null || raw === undefined) { return ''; }
    var num = parseFloat(String(raw).replace(',', '.'));
    if (isNaN(num) || num <= 0) { return ''; }
    return Math.round(num * 100).toString();
}

// ── Comportamento e validação ─────────────────────────────────────────────────

function _escHtml(s) { return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function attachMonetaryBehavior(container, displayInput, rawInput, attributes) {
    if (!displayInput || !rawInput) { return; }

    var feedback = document.createElement('small');
    feedback.className        = 'text-danger d-block';
    feedback.style.margin     = '0';
    feedback.style.padding    = '0';
    feedback.style.fontSize   = '0.7rem';
    feedback.style.lineHeight = '1.2';
    feedback.style.fontStyle  = 'italic';
    feedback.style.marginTop  = '0px';
    container.appendChild(feedback);

    var fieldLabel = _escHtml(attributes.label || attributes.name || 'Campo');
    var isRequired = normalizeBoolean(attributes.Required, false);
    var isDisabled = normalizeBoolean(attributes.Disabled, false);
    var isReadOnly = normalizeBoolean(attributes.ReadOnly, false);

    var _digits      = '';
    var _fromDisplay = false; // evita loop entre handlers

    function runValidation() {
        if (isRequired && !rawInput.value) {
            feedback.innerHTML = 'Campo "' + fieldLabel + '" é obrigatório.';
            displayInput.classList.add('is-invalid');
        } else {
            feedback.innerHTML = '';
            displayInput.classList.remove('is-invalid');
        }
    }

    // Inicializa a partir de data-value (valor raw da API, ex: '171.14')
    if (attributes.value) {
        _digits            = rawToDigits(attributes.value);
        displayInput.value = digitsToDisplay(_digits);
        rawInput.value     = digitsToRaw(_digits);
    }

    // Handler do rawInput: acionado por SadUtils.fillField(id, rawValue)
    // Atualiza o display a partir do raw value recebido da API
    rawInput.addEventListener('input', function () {
        if (_fromDisplay) { return; } // disparado pela nossa própria atualização — ignorar
        var newDigits      = rawToDigits(rawInput.value);
        _digits            = newDigits;
        displayInput.value = digitsToDisplay(newDigits);
        runValidation();
    });

    if (isDisabled || isReadOnly) {
        // Campo somente leitura: bloqueia digitação no display
        displayInput.addEventListener('keydown', function (e) { e.preventDefault(); });
        displayInput.addEventListener('input',   function (e) { e.preventDefault(); });
        return;
    }

    // Permite apenas dígitos e teclas de controle no display
    displayInput.addEventListener('keydown', function (e) {
        var ctrl = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight',
                    'ArrowUp', 'ArrowDown', 'Home', 'End'];
        if (ctrl.indexOf(e.key) !== -1) { return; }
        if (e.ctrlKey || e.metaKey)     { return; }
        if (/^\d$/.test(e.key))         { return; }
        e.preventDefault();
    });

    // Reformata ao digitar: extrai dígitos → centavo primeiro → atualiza raw
    displayInput.addEventListener('input', function () {
        var newDigits      = displayInput.value.replace(/\D/g, '');
        _digits            = newDigits;
        displayInput.value = digitsToDisplay(newDigits);
        rawInput.value     = digitsToRaw(newDigits);

        // Notifica listeners externos (ex: validarTotais em create.js / update.js)
        _fromDisplay = true;
        rawInput.dispatchEvent(new Event('input',  { bubbles: true }));
        rawInput.dispatchEvent(new Event('change', { bubbles: true }));
        _fromDisplay = false;

        runValidation();
    });

    displayInput.addEventListener('blur', runValidation);

    runValidation();
}

// Executa automaticamente quando o script é carregado
(function () {
    'use strict';

    var fieldContainers = document.querySelectorAll('form .field_monetary');

    fieldContainers.forEach(function (container) {
        var rawDataset       = container.dataset;
        var customAttributes = normalizeDatasetAttributes(rawDataset);

        var field           = new MonetaryField(customAttributes);
        container.innerHTML = field.render();

        var displayInput = container.querySelector('.field-monetary-display');
        var rawInput     = container.querySelector('.field-monetary-raw');

        attachMonetaryBehavior(container, displayInput, rawInput, field.attributes);
    });
}());
