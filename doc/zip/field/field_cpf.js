// JSON com atributos padrão do campo CPF
const defaultCpfAttributes = {
    label: "CPF",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "text",
    id: "cpf",
    name: "cpf",
    value: "",
    placeholder: "000.000.000-00",
    maxlength: "14",
    ReadOnly: false,
    Disabled: false,
    Required: false
};

// Classe para criar campos CPF
class CpfField {
    constructor(attributes) {
        this.attributes = { ...defaultCpfAttributes, ...attributes };
    }

    render() {
        // Extrai atributos visuais que não pertencem ao input em si
        const {
            label,
            labelClass,
            wrapperClass,
            ReadOnly,
            Disabled,
            Required,
            placeholder,
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

        // Adiciona placeholder
        if (placeholder) {
            inputAttributes.placeholder = placeholder;
        }

        // Cria o input com os atributos restantes
        htmlString += '<input';

        for (let key in inputAttributes) {
            htmlString += ` ${key}="${inputAttributes[key]}"`;
        }

        htmlString += '>';
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
        let normalizedKey = key;
        
        if (key === 'readonly') {
            normalizedKey = 'ReadOnly';
        } else if (key === 'disabled') {
            normalizedKey = 'Disabled';
        } else if (key === 'required') {
            normalizedKey = 'Required';
        }
        
        normalized[normalizedKey] = dataset[key];
    }
    
    return normalized;
}

function formatCpf(value) {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limited = digits.slice(0, 11);
    
    // Formata como XXX.XXX.XXX-XX
    if (limited.length <= 3) {
        return limited;
    } else if (limited.length <= 6) {
        return limited.slice(0, 3) + '.' + limited.slice(3);
    } else if (limited.length <= 9) {
        return limited.slice(0, 3) + '.' + limited.slice(3, 6) + '.' + limited.slice(6);
    } else {
        return limited.slice(0, 3) + '.' + limited.slice(3, 6) + '.' + limited.slice(6, 9) + '-' + limited.slice(9);
    }
}

function calculateCheckDigit(digits) {
    if (digits.length === 0) return '0';
    
    let sum = 0;
    let multiplier = digits.length + 1;
    
    for (let i = 0; i < digits.length; i++) {
        sum += parseInt(digits[i]) * multiplier;
        multiplier--;
    }
    
    const remainder = sum % 11;
    return remainder < 2 ? '0' : (11 - remainder).toString();
}

function isValidCpf(cpf) {
    // Remove caracteres especiais
    const digits = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (digits.length !== 11) {
        return false;
    }
    
    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1{10}$/.test(digits)) {
        return false;
    }
    
    // Calcula primeiro dígito verificador
    const firstNine = digits.slice(0, 9);
    const firstCheckDigit = calculateCheckDigit(firstNine);
    
    if (firstCheckDigit !== digits[9]) {
        return false;
    }
    
    // Calcula segundo dígito verificador
    const firstTen = digits.slice(0, 10);
    const secondCheckDigit = calculateCheckDigit(firstTen);
    
    if (secondCheckDigit !== digits[10]) {
        return false;
    }
    
    return true;
}

function _escHtml(s) { return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function attachCpfValidation(container, inputElement, attributes) {
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

    const fieldLabel = _escHtml(attributes.label || 'CPF');
    const isRequired = normalizeBoolean(attributes.Required, false);

    const runValidation = () => {
        const messages = [];
        const cpfValue = inputElement.value;

        // Valida campo obrigatório
        if (isRequired && !cpfValue.trim()) {
            messages.push(`Campo "${fieldLabel}" é obrigatório.`);
        } else if (cpfValue.trim()) {
            // Valida CPF apenas se houver valor
            if (!isValidCpf(cpfValue)) {
                messages.push(`CPF inválido. Verifique os dígitos.`);
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

    inputElement.addEventListener('input', function (e) {
        // Formata enquanto digita
        e.target.value = formatCpf(e.target.value);
        runValidation();
    });

    inputElement.addEventListener('blur', runValidation);

    // Valida estado inicial
    runValidation();
}

// Executa automaticamente quando o script é carregado
(function () {

    // Procura por elementos com a classe "field_cpf" dentro do form
    const fieldContainers = document.querySelectorAll('form .field_cpf');

    fieldContainers.forEach(container => {

        // Normaliza os nomes de atributos
        const rawDataset = container.dataset;
        const customAttributes = normalizeDatasetAttributes(rawDataset);

        // Aplica máscara no value pré-preenchido (ex: valor bruto vindo da API)
        if (customAttributes.value) {
            customAttributes.value = formatCpf(customAttributes.value);
        }

        // Cria uma instância da classe CpfField com os atributos customizados
        const cpfField = new CpfField(customAttributes);

        // Adiciona o HTML do input dentro do container usando innerHTML
        container.innerHTML = cpfField.render();

        // Acopla validação por campo
        // Não valida campos desabilitados ou somente leitura
        const isDisabled = normalizeBoolean(cpfField.attributes.Disabled, false);
        const isReadOnly = normalizeBoolean(cpfField.attributes.ReadOnly, false);

        if (!isDisabled && !isReadOnly) {
            const inputElement = container.querySelector('input');
            attachCpfValidation(container, inputElement, cpfField.attributes);
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
