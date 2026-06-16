// JSON com domínios de e-mail permitidos (configurável)
const allowedEmailDomains = [
    "rj.gov.br",
    "gov.br",
    "com",
    "com.br",
];
// "extreme.digital"

// JSON com atributos padrão do campo email
const defaultEmailAttributes = {
    label: "E-mail",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "email",
    id: "email",
    name: "email",
    value: "",
    placeholder: "usuario@dominio.com.br",
    ReadOnly: false,
    Disabled: false,
    Required: false,
    allowedDomains: null  // Se null, usa allowedEmailDomains global
};

// Classe para criar campos email
class EmailField {
    constructor(attributes) {
        this.attributes = { ...defaultEmailAttributes, ...attributes };
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
            allowedDomains,
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

        // Força type="email"
        inputAttributes.type = 'email';

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
        } else if (key === 'alloweddomains') {
            normalizedKey = 'allowedDomains';
        }
        
        normalized[normalizedKey] = dataset[key];
    }
    
    return normalized;
}

function isValidEmailFormat(email) {
    // Validação básica de formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getDomainFromEmail(email) {
    if (!email || !email.includes('@')) {
        return '';
    }
    
    return email.split('@')[1].toLowerCase();
}

function isAllowedDomain(domain, allowedList) {
    if (!domain) {
        return false;
    }
    
    // Verifica se o domínio está na lista permitida
    // Suporta match exato ou subdomínio
    return allowedList.some(allowed => {
        // Match exato
        if (domain === allowed.toLowerCase()) {
            return true;
        }
        
        // Match de subdomínio (ex: email@detran.rj.gov.br aceita se "rj.gov.br" está na lista)
        if (domain.endsWith('.' + allowed.toLowerCase())) {
            return true;
        }
        
        return false;
    });
}

function _escHtml(s) { return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function attachEmailValidation(container, inputElement, attributes) {
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

    const fieldLabel = _escHtml(attributes.label || 'E-mail');
    const isRequired = normalizeBoolean(attributes.Required, false);
    
    // Define lista de domínios permitidos
    let allowedList = allowedEmailDomains;
    
    // Se foi passado allowedDomains via data-*, usa essa lista
    if (attributes.allowedDomains) {
        try {
            // Tenta parsear como JSON ou split por vírgula
            if (attributes.allowedDomains.startsWith('[')) {
                allowedList = JSON.parse(attributes.allowedDomains);
            } else {
                allowedList = attributes.allowedDomains.split(',').map(d => d.trim());
            }
        } catch (e) {
            console.warn('Erro ao parsear allowedDomains, usando lista padrão');
        }
    }

    const runValidation = () => {
        const messages = [];
        const emailValue = inputElement.value.trim();

        // Valida campo obrigatório
        if (isRequired && !emailValue) {
            messages.push(`Campo "${fieldLabel}" é obrigatório.`);
        } else if (emailValue) {
            // Valida formato básico de e-mail
            if (!isValidEmailFormat(emailValue)) {
                messages.push(`Formato de e-mail inválido.`);
            } else {
                // Valida domínio permitido
                const domain = getDomainFromEmail(emailValue);
                
                if (!isAllowedDomain(domain, allowedList)) {
                    messages.push(`Domínio "${domain}" não permitido. Permitidos: ${allowedList.join(', ')}`);
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

    inputElement.addEventListener('input', runValidation);
    inputElement.addEventListener('blur', runValidation);

    // Valida estado inicial
    runValidation();
}

// Executa automaticamente quando o script é carregado
(function () {

    // Procura por elementos com a classe "field_email" dentro do form
    const fieldContainers = document.querySelectorAll('form .field_email');

    fieldContainers.forEach(container => {

        // Normaliza os nomes de atributos
        const rawDataset = container.dataset;
        const customAttributes = normalizeDatasetAttributes(rawDataset);

        // Cria uma instância da classe EmailField com os atributos customizados
        const emailField = new EmailField(customAttributes);

        // Adiciona o HTML do input dentro do container usando innerHTML
        container.innerHTML = emailField.render();

        // Acopla validação por campo
        // Não valida campos desabilitados ou somente leitura
        const isDisabled = normalizeBoolean(emailField.attributes.Disabled, false);
        const isReadOnly = normalizeBoolean(emailField.attributes.ReadOnly, false);

        if (!isDisabled && !isReadOnly) {
            const inputElement = container.querySelector('input');
            attachEmailValidation(container, inputElement, emailField.attributes);
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
