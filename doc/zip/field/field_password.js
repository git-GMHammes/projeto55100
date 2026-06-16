// JSON com atributos padrão do campo password
const defaultPasswordAttributes = {
    label: "Senha",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "password",
    strongPassword: false,
    minlength: 6,
    maxlength: 32,
    special: true,
    number: true,
    letter: true,
    id: "password",
    name: "password",
    value: "",
    doubleField: false,
    equalFields: false,
    ReadOnly: false,
    Disabled: false,
    Required: false
};

// Classe para criar campos password
class PasswordField {
    constructor(attributes) {
        this.attributes = { ...defaultPasswordAttributes, ...attributes };
    }

    render() {
        const {
            label,
            labelClass,
            wrapperClass,
            special,
            number,
            letter,
            strongPassword,
            minlength,
            maxlength,
            ReadOnly,
            Disabled,
            Required,
            doubleField,
            equalFields,
            ...inputAttributes
        } = this.attributes;

        let htmlString = `<div class="${wrapperClass}">`;

        // Label principal
        if (label) {
            const required = normalizeBoolean(Required, false) ? ' <span class="text-danger">*</span>' : '';
            htmlString += `<label for="${inputAttributes.id}" class="${labelClass}">${label}${required}</label>`;
        }

        // Adiciona atributos readonly, disabled, required
        if (normalizeBoolean(ReadOnly, false)) {
            inputAttributes.readonly = 'readonly';
        }

        if (normalizeBoolean(Disabled, false)) {
            inputAttributes.disabled = 'disabled';
        }

        if (normalizeBoolean(Required, false)) {
            inputAttributes.required = 'required';
        }

        // Adiciona minlength e maxlength
        if (minlength) {
            inputAttributes.minlength = minlength;
        }

        if (maxlength) {
            inputAttributes.maxlength = maxlength;
        }

        // Força type="password"
        inputAttributes.type = 'password';

        // Wrapper com posição relativa para o ícone de olho
        htmlString += '<div style="position: relative;">';

        // Primeiro campo (senha)
        htmlString += '<input';
        for (let key in inputAttributes) {
            htmlString += ` ${key}="${inputAttributes[key]}"`;
        }
        htmlString += ' style="padding-right: 40px;">';

        // Ícone de olho para toggle
        htmlString += `<span class="password-toggle" data-target="${inputAttributes.id}" 
            style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); 
            cursor: pointer; user-select: none; font-size: 1.2rem;">👁️</span>`;

        htmlString += '</div>';

        // Se doubleField, adiciona segundo campo (confirmação)
        if (normalizeBoolean(doubleField, false)) {
            const confirmId = inputAttributes.id + '_confirm';
            const confirmName = inputAttributes.name + '_confirm';

            htmlString += `<label for="${confirmId}" class="${labelClass} mt-2">Confirmar ${label || 'Senha'}</label>`;
            
            // Wrapper com posição relativa para o segundo ícone
            htmlString += '<div style="position: relative;">';
            
            htmlString += `<input type="password" id="${confirmId}" name="${confirmName}" class="${inputAttributes.class}" style="padding-right: 40px;"`;

            if (inputAttributes.minlength) {
                htmlString += ` minlength="${inputAttributes.minlength}"`;
            }

            if (inputAttributes.maxlength) {
                htmlString += ` maxlength="${inputAttributes.maxlength}"`;
            }

            if (inputAttributes.readonly) {
                htmlString += ` readonly="readonly"`;
            }

            if (inputAttributes.disabled) {
                htmlString += ` disabled="disabled"`;
            }

            if (inputAttributes.required) {
                htmlString += ` required="required"`;
            }

            htmlString += '>';

            // Ícone de olho para o campo de confirmação
            htmlString += `<span class="password-toggle" data-target="${confirmId}" 
                style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); 
                cursor: pointer; user-select: none; font-size: 1.2rem;">👁️</span>`;

            htmlString += '</div>';
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
        let normalizedKey = key;

        if (key === 'readonly') {
            normalizedKey = 'ReadOnly';
        } else if (key === 'disabled') {
            normalizedKey = 'Disabled';
        } else if (key === 'required') {
            normalizedKey = 'Required';
        } else if (key === 'doublefield') {
            normalizedKey = 'doubleField';
        } else if (key === 'equalfields') {
            normalizedKey = 'equalFields';
        } else if (key === 'strongpassword') {
            normalizedKey = 'strongPassword';
        }

        normalized[normalizedKey] = dataset[key];
    }

    return normalized;
}

function _escHtml(s) { return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function validatePassword(value, rules, label) {
    const messages = [];
    const fieldLabel = _escHtml(label || 'Senha');

    // Valida strongPassword
    if (rules.strongPassword) {
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[^\w\s]/.test(value);
        const hasMinLength = value.length >= rules.minlength;

        if (!hasMinLength) {
            messages.push(`${fieldLabel}: mínimo ${rules.minlength} caracteres.`);
        }

        if (!hasLetter) {
            messages.push(`${fieldLabel}: deve conter letras.`);
        }

        if (!hasNumber) {
            messages.push(`${fieldLabel}: deve conter números.`);
        }

        if (!hasSpecial) {
            messages.push(`${fieldLabel}: deve conter caracteres especiais (@, #, $, etc).`);
        }
    } else {
        // Validações normais de special/number/letter
        const hasSpecialChars = /[^\p{L}\p{N}\s]/u.test(value);
        const hasNumbers = /\d/.test(value);
        const hasLetters = /\p{L}/u.test(value);

        if (!rules.special && hasSpecialChars) {
            messages.push(`${fieldLabel}: não aceita caracteres especiais.`);
        }

        if (!rules.number && hasNumbers) {
            messages.push(`${fieldLabel}: não aceita números.`);
        }

        if (!rules.letter && hasLetters) {
            messages.push(`${fieldLabel}: não aceita letras.`);
        }
    }

    return messages;
}

function attachPasswordValidation(container, inputElement, attributes) {
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
        letter: normalizeBoolean(attributes.letter, true),
        strongPassword: normalizeBoolean(attributes.strongPassword, false),
        minlength: attributes.minlength || 6
    };

    const fieldLabel = _escHtml(attributes.label || 'Senha');
    const isRequired = normalizeBoolean(attributes.Required, false);
    const doubleField = normalizeBoolean(attributes.doubleField, false);
    const equalFields = normalizeBoolean(attributes.equalFields, false);

    // Pega o segundo campo se existir
    let confirmElement = null;
    if (doubleField) {
        confirmElement = container.querySelector(`#${inputElement.id}_confirm`);
    }

    const runValidation = () => {
        const messages = [];
        const passwordValue = inputElement.value;

        // Valida campo obrigatório
        if (isRequired && !passwordValue.trim()) {
            messages.push(`Campo "${fieldLabel}" é obrigatório.`);
        } else if (passwordValue) {
            // Valida regras de senha
            messages.push(...validatePassword(passwordValue, rules, fieldLabel));
        }

        // Se doubleField e equalFields, valida igualdade
        if (doubleField && equalFields && confirmElement) {
            const confirmValue = confirmElement.value;

            if (passwordValue && confirmValue && passwordValue !== confirmValue) {
                messages.push(`As senhas não coincidem.`);
            }
        }

        if (messages.length > 0) {
            feedback.innerHTML = messages.join('<br>');
            inputElement.classList.add('is-invalid');

            if (confirmElement && doubleField && equalFields) {
                confirmElement.classList.add('is-invalid');
            }
            return;
        }

        feedback.innerHTML = '';
        inputElement.classList.remove('is-invalid');

        if (confirmElement) {
            confirmElement.classList.remove('is-invalid');
        }
    };

    inputElement.addEventListener('input', runValidation);
    inputElement.addEventListener('blur', runValidation);

    // Se tem campo de confirmação, adiciona listeners nele também
    if (confirmElement) {
        confirmElement.addEventListener('input', runValidation);
        confirmElement.addEventListener('blur', runValidation);
    }

    // Valida estado inicial
    runValidation();
}

// Executa automaticamente quando o script é carregado
(function () {

    // Procura por elementos com a classe "field_password" dentro do form
    const fieldContainers = document.querySelectorAll('form .field_password');

    fieldContainers.forEach(container => {

        // Normaliza os nomes de atributos
        const rawDataset = container.dataset;
        const customAttributes = normalizeDatasetAttributes(rawDataset);

        // Cria uma instância da classe PasswordField com os atributos customizados
        const passwordField = new PasswordField(customAttributes);

        // Adiciona o HTML do input dentro do container usando innerHTML
        container.innerHTML = passwordField.render();

        // Acopla validação por campo
        // Não valida campos desabilitados ou somente leitura
        const isDisabled = normalizeBoolean(passwordField.attributes.Disabled, false);
        const isReadOnly = normalizeBoolean(passwordField.attributes.ReadOnly, false);

        if (!isDisabled && !isReadOnly) {
            const inputElement = container.querySelector('input[type="password"]');
            attachPasswordValidation(container, inputElement, passwordField.attributes);
        } else {
            // Se for readonly ou disabled, bloqueia eventos de digitação
            const inputElements = container.querySelectorAll('input[type="password"]');
            inputElements.forEach(input => {
                input.addEventListener('keypress', function (e) {
                    e.preventDefault();
                });
                input.addEventListener('input', function (e) {
                    e.preventDefault();
                });
            });
        }
    });

    // Adiciona funcionalidade de toggle para mostrar/ocultar senha
    const toggleButtons = document.querySelectorAll('.password-toggle');
    toggleButtons.forEach(toggleBtn => {
        toggleBtn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            
            if (targetInput) {
                if (targetInput.type === 'password') {
                    targetInput.type = 'text';
                    this.innerHTML = '&#128274;'; // Cadeado (senha visível)
                } else {
                    targetInput.type = 'password';
                    this.textContent = '👁️'; // Olho (senha oculta)
                }
            }
        });
    });
})();
