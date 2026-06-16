// JSON com atributos padrão do campo SEI
const defaultSeiAttributes = {
    label: "Número SEI",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "text",
    id: "fsei",
    name: "fsei",
    value: "",
    ReadOnly: false,
    Disabled: false,
    Required: false
};

// Componente de input com máscara SEI-15NNNN/NNNNNN/20NN
// Storage (hidden): SEI15NNNNNNNNNN20NN — 19 chars, sem separadores
// Display (visible): SEI-15NNNN/NNNNNN/20NN — 22 chars, com separadores
class SeiField {
    constructor(attributes) {
        this.attributes = { ...defaultSeiAttributes, ...attributes };
    }

    render() {
        const {
            label,
            labelClass,
            wrapperClass,
            ReadOnly,
            Disabled,
            Required,
            value,
            ...inputAttributes
        } = this.attributes;

        const isReadOnly = seiNormalizeBoolean(ReadOnly, false);
        const isDisabled = seiNormalizeBoolean(Disabled, false);
        const isRequired = seiNormalizeBoolean(Required, false);

        const rawValue = value || '';
        const maskedValue = seiRawToMasked(rawValue);

        let htmlString = `<div class="${wrapperClass}">`;

        if (label) {
            const requiredMark = isRequired ? ' <span class="text-danger">*</span>' : '';
            htmlString += `<label for="${inputAttributes.id}" class="${labelClass}">${label}${requiredMark}</label>`;
        }

        // Hidden: armazena SEI15NNNNNNNNNN20NN para envio ao backend
        htmlString += `<input type="hidden" id="${inputAttributes.id}_raw" name="${inputAttributes.name}" value="${rawValue}">`;

        // Visível: exibe SEI-15NNNN/NNNNNN/20NN — name sufixado _display para não conflitar
        const visibleAttrs = { ...inputAttributes };
        visibleAttrs.name = inputAttributes.name + '_display';
        visibleAttrs.id = inputAttributes.id;
        visibleAttrs.value = maskedValue;
        visibleAttrs.placeholder = 'SEI-15____/______/20__';
        visibleAttrs.maxlength = '22';
        visibleAttrs.autocomplete = 'off';

        if (isReadOnly) visibleAttrs.readonly = 'readonly';
        if (isDisabled) visibleAttrs.disabled = 'disabled';
        if (isRequired) visibleAttrs.required = 'required';

        htmlString += '<input';
        for (let key in visibleAttrs) {
            htmlString += ` ${key}="${visibleAttrs[key]}"`;
        }
        htmlString += '>';
        htmlString += '</div>';

        return htmlString;
    }
}

// raw SEI15NNNNNNNNNN20NN → display SEI-15NNNN/NNNNNN/20NN
function seiRawToMasked(raw) {
    if (!raw || raw.length < 19) return '';
    const body = String(raw).replace(/^SEI15/i, ''); // remove prefixo fixo → 14 chars: 4d+6d+20+2d
    if (body.length < 14) return '';
    const g1 = body.slice(0, 4);    // 4 dígitos livres
    const g2 = body.slice(4, 10);   // 6 dígitos livres
    const g3 = body.slice(12, 14);  // 2 dígitos do ano (posições 10-11 = "20" fixo)
    return 'SEI-15' + g1 + '/' + g2 + '/20' + g3;
}

// display SEI-15NNNN/NNNNNN/20NN → raw SEI15NNNNNNNNNN20NN
function seiMaskedToRaw(masked) {
    if (!masked) return '';
    const stripped = masked.replace(/^SEI-/i, '').replace(/\//g, '');
    return stripped.length > 0 ? 'SEI' + stripped : '';
}

// Aplica máscara no input visível e sincroniza o hidden com o valor raw
// Lógica: extrai os 12 dígitos livres (4+6+2) e formata com separadores e o "20" fixo do ano
function applySeiMask(visibleInput, hiddenInput) {
    const allDigits = visibleInput.value.replace(/\D/g, '');

    // Remove o prefixo fixo "15" do início para obter os dígitos livres
    const freeDigits = (allDigits.length >= 2 && allDigits.slice(0, 2) === '15')
        ? allDigits.slice(2, 14)
        : allDigits.slice(0, 12);

    const g1 = freeDigits.slice(0, 4);
    const g2 = freeDigits.slice(4, 10);
    const g3 = freeDigits.slice(10, 12);

    let masked = '';
    if (allDigits.length > 0) {
        masked = 'SEI-15' + g1;
        if (freeDigits.length > 4) { masked += '/' + g2; }
        if (freeDigits.length > 10) { masked += '/20' + g3; }
    }

    visibleInput.value = masked;
    hiddenInput.value = seiMaskedToRaw(masked);
}

function seiNormalizeBoolean(value, fallback) {
    if (value === undefined || value === null || value === '') return fallback;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        const p = value.trim().toLowerCase();
        if (p === 'true' || p === '1') return true;
        if (p === 'false' || p === '0') return false;
    }
    return Boolean(value);
}

function seiNormalizeDatasetAttributes(dataset) {
    const normalized = {};
    for (let key in dataset) {
        let normalizedKey = key;
        if (key === 'readonly') normalizedKey = 'ReadOnly';
        else if (key === 'disabled') normalizedKey = 'Disabled';
        else if (key === 'required') normalizedKey = 'Required';
        normalized[normalizedKey] = dataset[key];
    }
    return normalized;
}

function _escHtml(s) { return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function attachSeiValidation(container, visibleInput, hiddenInput, attributes) {
    if (!visibleInput) return;

    const feedback = document.createElement('small');
    feedback.className = 'text-danger d-block';
    feedback.style.margin = '0';
    feedback.style.padding = '0';
    feedback.style.fontSize = '0.7rem';
    feedback.style.lineHeight = '1.2';
    feedback.style.fontStyle = 'italic';
    feedback.style.marginTop = '0px';
    container.appendChild(feedback);

    const fieldLabel = _escHtml(attributes.label || attributes.name || attributes.id || 'Campo');
    const isRequired = seiNormalizeBoolean(attributes.Required, false);
    const SEI_FULL = 22;

    const runValidation = function () {
        const messages = [];
        const val = visibleInput.value;

        if (isRequired && val.length === 0) {
            messages.push(`Campo "${fieldLabel}" é obrigatório.`);
        } else if (val.length > 0 && val.length < SEI_FULL) {
            messages.push(`Campo "${fieldLabel}" está incompleto.`);
        }

        if (messages.length > 0) {
            feedback.innerHTML = messages.join('<br>');
            visibleInput.classList.add('is-invalid');
            return;
        }

        feedback.innerHTML = '';
        visibleInput.classList.remove('is-invalid');
    };

    visibleInput.addEventListener('input', function () {
        applySeiMask(visibleInput, hiddenInput);
        runValidation();
    });

    visibleInput.addEventListener('blur', runValidation);
    runValidation();
}

// Auto-inicialização
(function () {
    const fieldContainers = document.querySelectorAll('form .field_sei');

    fieldContainers.forEach(function (container) {
        const customAttributes = seiNormalizeDatasetAttributes(container.dataset);
        const seiField = new SeiField(customAttributes);
        container.innerHTML = seiField.render();

        const isDisabled = seiNormalizeBoolean(seiField.attributes.Disabled, false);
        const isReadOnly = seiNormalizeBoolean(seiField.attributes.ReadOnly, false);
        const visibleInput = container.querySelector('input[type="text"], input:not([type="hidden"])');
        const hiddenInput = container.querySelector('input[type="hidden"]');

        if (!isDisabled && !isReadOnly) {
            attachSeiValidation(container, visibleInput, hiddenInput, seiField.attributes);
        } else {
            if (visibleInput) {
                visibleInput.addEventListener('keypress', function (e) { e.preventDefault(); });
                visibleInput.addEventListener('input', function (e) { e.preventDefault(); });
            }
        }
    });
})();
