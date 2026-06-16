// JSON com atributos padrão do campo date
const defaultDateAttributes = {
    doubleField: false,
    label: "Título do Campo",
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

function normalizeBoolean(value, fallback = true) {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const parsed = value.trim().toLowerCase();

        if (parsed === 'true' || parsed === '1') {
            return true;
        }

        if (parsed === 'false' || parsed === '0') {
            return false;
        }
    }

    return Boolean(value);
}

function normalizeInputType(type) {
    if (!type) {
        return 'date';
    }

    const normalized = String(type).trim().toLowerCase();
    if (normalized === 'datetime' || normalized === 'datetime_local' || normalized === 'datetime-local') {
        return 'datetime-local';
    }

    return 'date';
}

function normalizeDatasetAttributes(dataset) {
    const normalized = {};

    for (let key in dataset) {
        let normalizedKey = key;

        if (key === 'readonly') {
            normalizedKey = 'ReadOnly';
        } else if (key === 'disabled') {
            normalizedKey = 'Disabled';
        } else if (key === 'required') {
            normalizedKey = 'Required';
        } else if (key === 'doublefield') {
            normalizedKey = 'doubleField';
        }

        normalized[normalizedKey] = dataset[key];
    }

    return normalized;
}

function padDateValue(value) {
    return String(value).padStart(2, '0');
}

function formatInputValue(date, inputType) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return '';
    }

    const yyyy = date.getFullYear();
    const mm = padDateValue(date.getMonth() + 1);
    const dd = padDateValue(date.getDate());

    if (inputType === 'datetime-local') {
        const hh = padDateValue(date.getHours());
        const mi = padDateValue(date.getMinutes());
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    }

    return `${yyyy}-${mm}-${dd}`;
}

function parseInputValue(value, inputType, endOfDayWhenOnlyDate = false) {
    if (!value) {
        return null;
    }

    if (inputType === 'datetime-local') {
        let normalized = String(value).trim().replace(' ', 'T');

        if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
            normalized += endOfDayWhenOnlyDate ? 'T23:59:59' : 'T00:00:00';
        } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalized)) {
            normalized += ':00';
        }

        const d = new Date(normalized);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    const dateOnly = new Date(String(value).trim() + 'T00:00:00');
    return Number.isNaN(dateOnly.getTime()) ? null : dateOnly;
}

function formatValidationDate(date, inputType) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return '';
    }

    return inputType === 'datetime-local'
        ? date.toLocaleString('pt-BR')
        : date.toLocaleDateString('pt-BR');
}

// Classe para criar campos date
class DateField {
    constructor(attributes) {
        this.attributes = { ...defaultDateAttributes, ...attributes };
    }

    render() {
        const {
            doubleField,
            label,
            label2,
            labelClass,
            wrapperClass,
            min,
            max,
            id2,
            name2,
            value2,
            ReadOnly,
            Disabled,
            Required,
            ...inputAttributes
        } = this.attributes;

        const isDoubleField = normalizeBoolean(doubleField, false);
        const isReadOnly = normalizeBoolean(ReadOnly, false);
        const isDisabled = normalizeBoolean(Disabled, false);
        const isRequired = normalizeBoolean(Required, false);
        const inputType = normalizeInputType(inputAttributes.type);

        // Calcula limites padrão de data
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        const oneYearAhead = new Date(today);
        oneYearAhead.setFullYear(today.getFullYear() + 1);

        const minDate = min || formatInputValue(oneYearAgo, inputType);
        const maxDate = max || formatInputValue(oneYearAhead, inputType);

        let htmlString = `<div class="${wrapperClass}">`;

        // Label do campo principal
        if (label) {
            const requiredMark = isRequired ? ' <span class="text-danger">*</span>' : '';
            htmlString += `<label for="${inputAttributes.id}" class="${labelClass}">${label}${requiredMark}</label>`;
        }

        // Monta os atributos do primeiro campo
        const firstInputAttrs = { ...inputAttributes };
        firstInputAttrs.type = inputType;

        if (isReadOnly) firstInputAttrs.readonly = 'readonly';
        if (isDisabled) firstInputAttrs.disabled = 'disabled';
        if (isRequired) firstInputAttrs.required = 'required';

        firstInputAttrs.min = minDate;
        firstInputAttrs.max = maxDate;

        htmlString += '<input';
        for (let key in firstInputAttrs) {
            htmlString += ` ${key}="${firstInputAttrs[key]}"`;
        }
        htmlString += '>';

        // Se doubleField, adiciona segundo campo de data
        if (isDoubleField) {
            const secondId = id2 || (inputAttributes.id + '2');
            const secondName = name2 || (inputAttributes.name + '2');
            const secondLabel = label2 || 'Segunda Data';

            const requiredMark = isRequired ? ' <span class="text-danger">*</span>' : '';
            htmlString += `<label for="${secondId}" class="${labelClass} mt-2">${secondLabel}${requiredMark}</label>`;

            htmlString += `<input type="${inputType}" id="${secondId}" name="${secondName}" class="${inputAttributes.class}" value="${value2}"`;

            // O segundo campo não tem min fixo — é dinâmico (> data principal)
            // mas iniciamos com o mesmo max do primeiro
            htmlString += ` max="${maxDate}"`;

            if (isReadOnly) htmlString += ' readonly="readonly"';
            if (isDisabled) htmlString += ' disabled="disabled"';
            if (isRequired) htmlString += ' required="required"';

            htmlString += '>';
        }

        htmlString += '</div>';

        return htmlString;
    }
}

function _escHtml(s) { return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function attachDateValidation(container, dateField) {
    const attributes = dateField.attributes;
    const isDoubleField = normalizeBoolean(attributes.doubleField, false);
    const isRequired = normalizeBoolean(attributes.Required, false);
    const fieldLabel = _escHtml(attributes.label || 'Data');
    const inputType = normalizeInputType(attributes.type);

    const today = new Date();
    if (inputType === 'date') {
        today.setHours(0, 0, 0, 0);
    }

    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const oneYearAhead = new Date(today);
    oneYearAhead.setFullYear(today.getFullYear() + 1);

    const minDate = attributes.min
        ? parseInputValue(attributes.min, inputType, false)
        : oneYearAgo;
    const maxDate = attributes.max
        ? parseInputValue(attributes.max, inputType, true)
        : oneYearAhead;

    const input1 = container.querySelector(`#${attributes.id}`);

    const secondId = attributes.id2 || (attributes.id + '2');
    const input2 = isDoubleField ? container.querySelector(`#${secondId}`) : null;
    const field2Label = _escHtml(attributes.label2 || 'Segunda Data');

    const feedback = document.createElement('small');
    feedback.className = 'text-danger d-block';
    feedback.style.margin = '0';
    feedback.style.padding = '0';
    feedback.style.fontSize = '0.7rem';
    feedback.style.lineHeight = '1.2';
    feedback.style.fontStyle = 'italic';
    feedback.style.marginTop = '0px';
    container.appendChild(feedback);

    function runValidation() {
        const messages = [];

        const val1 = input1 ? input1.value : '';
        const val2 = input2 ? input2.value : '';

        // --- Validação do campo principal ---
        if (isRequired && !val1) {
            messages.push(`Campo "${fieldLabel}" é obrigatório.`);
        } else if (val1) {
            const d1 = parseInputValue(val1, inputType, false);

            if (!d1) {
                messages.push(`"${fieldLabel}" deve ser uma data/hora válida.`);
            } else {
                if (minDate && d1 < minDate) {
                    messages.push(`"${fieldLabel}" não pode ser anterior a ${formatValidationDate(minDate, inputType)}.`);
                }

                if (maxDate && d1 > maxDate) {
                    messages.push(`"${fieldLabel}" não pode ser posterior a ${formatValidationDate(maxDate, inputType)}.`);
                }

                // --- Validação do campo secundário (doubleField) ---
                if (isDoubleField && input2) {
                    if (isRequired && !val2) {
                        messages.push(`Campo "${field2Label}" é obrigatório.`);
                    } else if (val2) {
                        const d2 = parseInputValue(val2, inputType, false);

                        if (!d2) {
                            messages.push(`"${field2Label}" deve ser uma data/hora válida.`);
                        } else {
                            if (maxDate && d2 > maxDate) {
                                messages.push(`"${field2Label}" não pode ser posterior a ${formatValidationDate(maxDate, inputType)}.`);
                            }

                            // Regra principal: data 1 deve ser SEMPRE menor que data 2
                            if (d1 >= d2) {
                                messages.push(`"${fieldLabel}" deve ser anterior a "${field2Label}".`);
                            }
                        }
                    }
                }
            }
        } else if (isDoubleField && input2 && isRequired && !val2) {
            messages.push(`Campo "${field2Label}" é obrigatório.`);
        }

        if (messages.length > 0) {
            feedback.innerHTML = messages.join('<br>');
            if (input1) input1.classList.add('is-invalid');
            if (input2) input2.classList.add('is-invalid');
            return;
        }

        feedback.innerHTML = '';
        if (input1) input1.classList.remove('is-invalid');
        if (input2) input2.classList.remove('is-invalid');
    }

    // Atualiza o min do segundo campo dinamicamente conforme o primeiro muda
    function syncSecondFieldMin() {
        if (!input2 || !input1.value) return;

        const d1 = parseInputValue(input1.value, inputType, false);
        if (!d1) return;

        if (inputType === 'datetime-local') {
            d1.setMinutes(d1.getMinutes() + 1);
        } else {
            // O min do segundo campo é sempre o dia seguinte ao do primeiro
            d1.setDate(d1.getDate() + 1);
        }

        input2.min = formatInputValue(d1, inputType);

        // Se o segundo campo já tem valor e fica inválido com o novo min, limpa
        const d2 = parseInputValue(input2.value, inputType, false);
        const currentD1 = parseInputValue(input1.value, inputType, false);
        if (d2 && currentD1 && d2 <= currentD1) {
            input2.value = '';
        }
    }

    if (input1) {
        input1.addEventListener('change', function () {
            syncSecondFieldMin();
            runValidation();
        });
        input1.addEventListener('blur', runValidation);
        input1.addEventListener('input', runValidation);
    }

    if (input2) {
        input2.addEventListener('change', runValidation);
        input2.addEventListener('blur', runValidation);
    }

    // Valida estado inicial
    runValidation();
}

// Executa automaticamente quando o script é carregado
(function () {

    // Procura por elementos com a classe "field_date" dentro do form
    const fieldContainers = document.querySelectorAll('form .field_date');

    fieldContainers.forEach(container => {

        const rawDataset = container.dataset;
        const customAttributes = normalizeDatasetAttributes(rawDataset);

        const dateField = new DateField(customAttributes);

        container.innerHTML = dateField.render();

        const isDisabled = normalizeBoolean(dateField.attributes.Disabled, false);
        const isReadOnly = normalizeBoolean(dateField.attributes.ReadOnly, false);

        if (!isDisabled && !isReadOnly) {
            attachDateValidation(container, dateField);
        } else {
            // Bloqueia interação em campos readonly/disabled
            const inputs = container.querySelectorAll('input[type="date"], input[type="datetime-local"]');
            inputs.forEach(input => {
                input.addEventListener('keypress', function (e) {
                    e.preventDefault();
                });
                input.addEventListener('input', function (e) {
                    e.preventDefault();
                });
            });
        }
    });
})();
