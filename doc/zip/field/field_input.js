// JSON com atributos padrão do campo input
const defaultInputAttributes = {
    label: "Título do Campo",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "text",
    special: true,
    number: true,
    letter: true,
    id: "fname",
    name: "fname",
    value: "John",
    ReadOnly: false,
    Disabled: false,
    Required: false,
    options: []              // array de strings para gerar <datalist> (ex: ['Opção 1', 'Opção 2'])
};

// Classe para criar campos input
class InputField {
    constructor(attributes) {
        this.attributes = { ...defaultInputAttributes, ...attributes };
    }

    render() {
        // Extrai atributos visuais/validação que não pertencem ao input em si
        const {
            label,
            labelClass,
            wrapperClass,
            special,
            number,
            letter,
            ReadOnly,
            Disabled,
            Required,
            options,
            ...inputAttributes
        } = this.attributes;

        // Constrói a string HTML
        let htmlString = `<div class="${wrapperClass}">`;

        // Adiciona o label se existir
        if (label) {
            const required = normalizeBoolean(Required, false) ? ' <span class="text-danger">*</span>' : '';
            htmlString += `<label for="${inputAttributes.id}" class="${labelClass}">${label}${required}</label>`;
        }

        // Adiciona atributos readonly, disabled e required ao input
        if (normalizeBoolean(ReadOnly, false)) {
            inputAttributes.readonly = 'readonly';
        }

        if (normalizeBoolean(Disabled, false)) {
            inputAttributes.disabled = 'disabled';
        }

        if (normalizeBoolean(Required, false)) {
            inputAttributes.required = 'required';
        }

        // Vincula datalist ao input se options for fornecido e não vazio
        const hasOptions = Array.isArray(options) && options.length > 0;
        const datalistId = hasOptions ? `${inputAttributes.id}_datalist` : null;

        if (hasOptions) {
            inputAttributes.list = datalistId;
        }

        // Cria o input com os atributos restantes
        htmlString += '<input';

        for (let key in inputAttributes) {
            htmlString += ` ${key}="${inputAttributes[key]}"`;
        }

        htmlString += '>';

        // Gera o <datalist> com as opções fornecidas
        if (hasOptions) {
            htmlString += `<datalist id="${datalistId}">`;
            options.forEach(opt => {
                htmlString += `<option value="${opt}"></option>`;
            });
            htmlString += '</datalist>';
        }

        htmlString += '</div>';

        return htmlString;
    }
}

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

function normalizeDatasetAttributes(dataset) {
    const normalized = {};
    
    for (let key in dataset) {
        // Converte data-* attributes para match defaultInputAttributes
        // data-readonly -> ReadOnly
        // data-disabled -> Disabled
        // data-required -> Required
        let normalizedKey = key;
        
        if (key === 'readonly') {
            normalizedKey = 'ReadOnly';
        } else if (key === 'disabled') {
            normalizedKey = 'Disabled';
        } else if (key === 'required') {
            normalizedKey = 'Required';
        }

        // data-options vem como string JSON — converte para array
        if (key === 'options') {
            try {
                normalized[normalizedKey] = JSON.parse(dataset[key]);
            } catch (e) {
                normalized[normalizedKey] = [];
            }
            continue;
        }

        normalized[normalizedKey] = dataset[key];
    }
    
    return normalized;
}

function _escHtml(s) { return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function validateInputValue(value, rules, label) {
    const messages = [];
    const fieldLabel = _escHtml(label || 'Campo');

    const hasSpecialChars = /[^\p{L}\p{N}\s]/u.test(value);
    const hasNumbers = /\d/.test(value);
    const hasLetters = /\p{L}/u.test(value);

    if (!rules.special && hasSpecialChars) {
        messages.push(`Campo "${fieldLabel}" não aceita caracteres especiais.`);
    }

    if (!rules.number && hasNumbers) {
        messages.push(`Campo "${fieldLabel}" não aceita números.`);
    }

    if (!rules.letter && hasLetters) {
        messages.push(`Campo "${fieldLabel}" não aceita letras.`);
    }

    return messages;
}

function attachValidation(container, inputElement, attributes) {
    if (!inputElement) {
        return;
    }

    const feedback = document.createElement('small');
    feedback.className = 'text-danger d-block';
    feedback.style.margin = '0';
    feedback.style.padding = '0';
    feedback.style.fontSize = '0.7rem';
    feedback.style.lineHeight = '1.2';
    feedback.style.fontStyle = 'italic';
    feedback.style.marginTop = '0px';
    container.appendChild(feedback);

    const rules = {
        special: normalizeBoolean(attributes.special, true),
        number: normalizeBoolean(attributes.number, true),
        letter: normalizeBoolean(attributes.letter, true)
    };

    const fieldLabel = _escHtml(attributes.label || attributes.name || attributes.id || 'Campo');
    const isRequired = normalizeBoolean(attributes.Required, false);

    const runValidation = () => {
        const messages = [];

        // Valida campo obrigatório
        if (isRequired && !inputElement.value.trim()) {
            messages.push(`Campo "${fieldLabel}" é obrigatório.`);
        } else {
            // Valida regras de caracteres apenas se houver valor
            if (inputElement.value) {
                messages.push(...validateInputValue(inputElement.value, rules, fieldLabel));
            }
        }

        if (messages.length > 0) {
            feedback.innerHTML = messages.join('<br>');
            inputElement.classList.add('is-invalid');
            return;
        }

        feedback.innerHTML = '';
        inputElement.classList.remove('is-invalid');
    };

    inputElement.addEventListener('input', runValidation);
    inputElement.addEventListener('blur', runValidation);

    // Valida estado inicial
    runValidation();
}

// Executa automaticamente quando o script é carregado
(function () {

    // Procura por elementos com a classe "field_input" dentro do form
    const fieldContainers = document.querySelectorAll('form .field_input');

    fieldContainers.forEach(container => {

        // Verifica se o container tem atributos data-* para sobrescrever o padrão
        // Normaliza os nomes de atributos (fieldreadonly -> fieldReadOnly, etc)
        const rawDataset = container.dataset;
        const customAttributes = normalizeDatasetAttributes(rawDataset);

        // Cria uma instância da classe InputField com os atributos customizados
        const inputField = new InputField(customAttributes);

        // Adiciona o HTML do input dentro do container usando innerHTML
        container.innerHTML = inputField.render();

        // Acopla validação por campo (special/number/letter)
        // Não valida campos desabilitados ou somente leitura
        const isDisabled = normalizeBoolean(inputField.attributes.Disabled, false);
        const isReadOnly = normalizeBoolean(inputField.attributes.ReadOnly, false);

        if (!isDisabled && !isReadOnly) {
            const inputElement = container.querySelector('input');
            attachValidation(container, inputElement, inputField.attributes);
        } else {
            // Se for readonly ou disabled, bloqueia eventos de digitação
            const inputElement = container.querySelector('input');
            if (inputElement) {
                inputElement.addEventListener('keypress', function (e) {
                    e.preventDefault();
                });
                inputElement.addEventListener('input', function (e) {
                    e.preventDefault();
                });
            }
        }
    });
})();