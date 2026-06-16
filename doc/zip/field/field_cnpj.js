// JSON com atributos padrão do campo CNPJ
const defaultCnpjAttributes = {
    label: "CNPJ",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "text",
    id: "cnpj",
    name: "cnpj",
    value: "",
    placeholder: "00.000.000/0000-00",
    maxlength: "18",
    ReadOnly: false,
    Disabled: false,
    Required: false,
    allowLetters: false  // Novo formato com letras (vigor em julho/2026)
};

// Classe para criar campos CNPJ
class CnpjField {
    constructor(attributes) {
        this.attributes = { ...defaultCnpjAttributes, ...attributes };
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
            allowLetters,
            ...inputAttributes
        } = this.attributes;

        // Constrói a string HTML
        let htmlString = `<div class="${wrapperClass}">`;

        // Adiciona o label se existir
        if (label) {
            const required = normalizeBoolean(Required, false) ? ' <span class="text-danger">*</span>' : '';
            const letterInfo = normalizeBoolean(allowLetters, false) ? ' <small class="text-muted">(aceita letras)</small>' : '';
            htmlString += `<label for="${inputAttributes.id}" class="${labelClass}">${label}${required}${letterInfo}</label>`;
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
        } else if (key === 'allowletters') {
            normalizedKey = 'allowLetters';
        }
        
        normalized[normalizedKey] = dataset[key];
    }
    
    return normalized;
}

function formatCnpj(value, allowLetters = false) {
    if (allowLetters) {
        // Novo formato: permite letras e números (formato alfanumérico)
        // Remove apenas caracteres especiais, mantém letras e números
        const clean = value.replace(/[^\w]/gi, '').toUpperCase();
        
        // Limita a 14 caracteres
        const limited = clean.slice(0, 14);
        
        // Formata como XX.XXX.XXX/XXXX-XX
        if (limited.length <= 2) {
            return limited;
        } else if (limited.length <= 5) {
            return limited.slice(0, 2) + '.' + limited.slice(2);
        } else if (limited.length <= 8) {
            return limited.slice(0, 2) + '.' + limited.slice(2, 5) + '.' + limited.slice(5);
        } else if (limited.length <= 12) {
            return limited.slice(0, 2) + '.' + limited.slice(2, 5) + '.' + limited.slice(5, 8) + '/' + limited.slice(8);
        } else {
            return limited.slice(0, 2) + '.' + limited.slice(2, 5) + '.' + limited.slice(5, 8) + '/' + limited.slice(8, 12) + '-' + limited.slice(12);
        }
    } else {
        // Formato tradicional: apenas dígitos
        const digits = value.replace(/\D/g, '');
        
        // Limita a 14 dígitos
        const limited = digits.slice(0, 14);
        
        // Formata como XX.XXX.XXX/XXXX-XX
        if (limited.length <= 2) {
            return limited;
        } else if (limited.length <= 5) {
            return limited.slice(0, 2) + '.' + limited.slice(2);
        } else if (limited.length <= 8) {
            return limited.slice(0, 2) + '.' + limited.slice(2, 5) + '.' + limited.slice(5);
        } else if (limited.length <= 12) {
            return limited.slice(0, 2) + '.' + limited.slice(2, 5) + '.' + limited.slice(5, 8) + '/' + limited.slice(8);
        } else {
            return limited.slice(0, 2) + '.' + limited.slice(2, 5) + '.' + limited.slice(5, 8) + '/' + limited.slice(8, 12) + '-' + limited.slice(12);
        }
    }
}

function calculateCnpjCheckDigit(digits, multipliers) {
    let sum = 0;
    
    for (let i = 0; i < digits.length && i < multipliers.length; i++) {
        // Se for letra, converte para número (A=10, B=11, ..., Z=35)
        const char = digits[i];
        let value;
        
        if (/\d/.test(char)) {
            value = parseInt(char);
        } else if (/[A-Z]/.test(char)) {
            value = char.charCodeAt(0) - 55; // A=10, B=11, etc
        } else {
            value = 0;
        }
        
        sum += value * multipliers[i];
    }
    
    const remainder = sum % 11;
    const digit = remainder < 2 ? 0 : (11 - remainder);
    return digit;
}

function isValidCnpj(cnpj, allowLetters = false) {
    // Remove caracteres especiais
    let clean;
    
    if (allowLetters) {
        clean = cnpj.replace(/[^\w]/gi, '').toUpperCase();
    } else {
        clean = cnpj.replace(/\D/g, '');
    }
    
    // Verifica se tem 14 caracteres
    if (clean.length !== 14) {
        return false;
    }
    
    // Se não permite letras, verifica se tem apenas dígitos
    if (!allowLetters && !/^\d{14}$/.test(clean)) {
        return false;
    }
    
    // Verifica se todos os caracteres são iguais (CNPJ inválido tradicional)
    if (!allowLetters && /^(\d)\1{13}$/.test(clean)) {
        return false;
    }
    
    // Calcula primeiro dígito verificador
    const firstTwelve = clean.slice(0, 12);
    const firstMultipliers = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const firstCheckDigit = calculateCnpjCheckDigit(firstTwelve, firstMultipliers);
    
    // Converte o caractere 12 para comparação
    const char12 = clean[12];
    let digit12Value;
    if (/\d/.test(char12)) {
        digit12Value = parseInt(char12);
    } else if (/[A-Z]/.test(char12)) {
        digit12Value = char12.charCodeAt(0) - 55;
    } else {
        digit12Value = 0;
    }
    
    if (firstCheckDigit !== digit12Value) {
        return false;
    }
    
    // Calcula segundo dígito verificador
    const firstThirteen = clean.slice(0, 13);
    const secondMultipliers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const secondCheckDigit = calculateCnpjCheckDigit(firstThirteen, secondMultipliers);
    
    // Converte o caractere 13 para comparação
    const char13 = clean[13];
    let digit13Value;
    if (/\d/.test(char13)) {
        digit13Value = parseInt(char13);
    } else if (/[A-Z]/.test(char13)) {
        digit13Value = char13.charCodeAt(0) - 55;
    } else {
        digit13Value = 0;
    }
    
    if (secondCheckDigit !== digit13Value) {
        return false;
    }
    
    return true;
}

function _escHtml(s) { return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function attachCnpjValidation(container, inputElement, attributes) {
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

    const fieldLabel = _escHtml(attributes.label || 'CNPJ');
    const isRequired = normalizeBoolean(attributes.Required, false);
    const allowLetters = normalizeBoolean(attributes.allowLetters, false);

    const runValidation = () => {
        const messages = [];
        const cnpjValue = inputElement.value;

        // Valida campo obrigatório
        if (isRequired && !cnpjValue.trim()) {
            messages.push(`Campo "${fieldLabel}" é obrigatório.`);
        } else if (cnpjValue.trim()) {
            // Valida CNPJ apenas se houver valor
            if (!isValidCnpj(cnpjValue, allowLetters)) {
                if (allowLetters) {
                    messages.push(`CNPJ inválido. Formato alfanumérico: XX.XXX.XXX/XXXX-XX`);
                } else {
                    messages.push(`CNPJ inválido. Verifique os dígitos.`);
                }
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
        e.target.value = formatCnpj(e.target.value, allowLetters);
        runValidation();
    });

    inputElement.addEventListener('blur', runValidation);

    // Valida estado inicial
    runValidation();
}

// Executa automaticamente quando o script é carregado
(function () {

    // Procura por elementos com a classe "field_cnpj" dentro do form
    const fieldContainers = document.querySelectorAll('form .field_cnpj');

    fieldContainers.forEach(container => {

        // Normaliza os nomes de atributos
        const rawDataset = container.dataset;
        const customAttributes = normalizeDatasetAttributes(rawDataset);

        // Cria uma instância da classe CnpjField com os atributos customizados
        const cnpjField = new CnpjField(customAttributes);

        // Adiciona o HTML do input dentro do container usando innerHTML
        container.innerHTML = cnpjField.render();

        // Acopla validação por campo
        // Não valida campos desabilitados ou somente leitura
        const isDisabled = normalizeBoolean(cnpjField.attributes.Disabled, false);
        const isReadOnly = normalizeBoolean(cnpjField.attributes.ReadOnly, false);

        if (!isDisabled && !isReadOnly) {
            const inputElement = container.querySelector('input');
            attachCnpjValidation(container, inputElement, cnpjField.attributes);
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
