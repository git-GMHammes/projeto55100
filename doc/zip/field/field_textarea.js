// JSON com atributos padrão do campo textarea
const defaultTextareaAttributes = {
    label: "Descrição",
    labelClass: "form-label",
    wrapperClass: "mb-3",
    class: "form-control",
    id: "description",
    name: "description",
    value: "",
    rows: 4,
    cols: 50,
    maxlength: 500,
    minlength: 10,
    special: true,
    number: true,
    letter: true,
    showCounter: true,
    ReadOnly: false,
    Disabled: false,
    Required: false
};

// Classe para criar campos textarea
class TextareaField {
    constructor(attributes) {
        this.attributes = { ...defaultTextareaAttributes, ...attributes };
    }

    render() {
        // Extrai atributos visuais/validação que não pertencem ao textarea em si
        const {
            label,
            labelClass,
            wrapperClass,
            special,
            number,
            letter,
            showCounter,
            ReadOnly,
            Disabled,
            Required,
            maxlength,
            minlength,
            ...textareaAttributes
        } = this.attributes;

        // Constrói a string HTML
        let htmlString = `<div class="${wrapperClass}">`;

        // Adiciona o label se existir
        if (label) {
            const required = normalizeBoolean(Required, false) ? ' <span class="text-danger">*</span>' : '';
            const maxInfo = maxlength ? ` <small class="text-muted">(máx: ${maxlength} caracteres)</small>` : '';
            const minInfo = minlength ? ` <small class="text-muted">(mín: ${minlength} caracteres)</small>` : '';
            htmlString += `<label for="${textareaAttributes.id}" class="${labelClass}">${label}${required}${maxInfo}${minInfo}</label>`;
        }

        // Adiciona atributos readonly, disabled e required ao textarea
        if (normalizeBoolean(ReadOnly, false)) {
            textareaAttributes.readonly = 'readonly';
        }

        if (normalizeBoolean(Disabled, false)) {
            textareaAttributes.disabled = 'disabled';
        }

        if (normalizeBoolean(Required, false)) {
            textareaAttributes.required = 'required';
        }

        // Adiciona maxlength e minlength
        if (maxlength) {
            textareaAttributes.maxlength = maxlength;
        }

        if (minlength) {
            textareaAttributes.minlength = minlength;
        }

        // Cria o textarea com os atributos restantes
        htmlString += '<textarea';

        for (let key in textareaAttributes) {
            if (key !== 'value') {
                htmlString += ` ${key}="${textareaAttributes[key]}"`;
            }
        }

        htmlString += '>';
        htmlString += textareaAttributes.value || '';
        htmlString += '</textarea>';

        // Adiciona o contador de caracteres se ativado
        if (normalizeBoolean(showCounter, true) && maxlength) {
            htmlString += `
                <div class="d-flex justify-content-between align-items-center mt-2" style="font-size: 0.85rem;">
                    <div>
                        <span class="char-count">0</span> / <span class="char-max">${maxlength}</span>
                    </div>
                    <div class="progress" style="flex: 1; margin: 0 10px; height: 4px;">
                        <div class="progress-bar" role="progressbar" style="width: 0%;" 
                             aria-valuenow="0" aria-valuemin="0" aria-valuemax="${maxlength}"></div>
                    </div>
                </div>
            `;
        }

        // Adiciona feedback de validação
        htmlString += `
            <small class="text-danger d-block" style="margin: 5px 0 0 0; padding: 0; font-size: 0.75rem; line-height: 1.2; font-style: italic;"></small>
        `;

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
        // Converte data-* attributes para match defaultTextareaAttributes
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
        } else if (key === 'showcounter') {
            normalizedKey = 'showCounter';
        }

        normalized[normalizedKey] = dataset[key];
    }

    return normalized;
}

function _escHtml(s) { return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function validateTextareaValue(value, rules, label) {
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

function attachTextareaValidation(container, textareaElement, attributes) {
    if (!textareaElement) {
        return;
    }

    const feedback = container.querySelector('small.text-danger');
    const charCount = container.querySelector('.char-count');
    const progressBar = container.querySelector('.progress-bar');
    const maxlength = attributes.maxlength || 500;
    const minlength = attributes.minlength || 0;

    const rules = {
        special: normalizeBoolean(attributes.special, true),
        number: normalizeBoolean(attributes.number, true),
        letter: normalizeBoolean(attributes.letter, true)
    };

    const fieldLabel = _escHtml(attributes.label || attributes.name || attributes.id || 'Campo');
    const isRequired = normalizeBoolean(attributes.Required, false);

    const runValidation = () => {
        const messages = [];
        const currentLength = textareaElement.value.length;

        // Atualiza o contador
        if (charCount) {
            charCount.textContent = currentLength;
        }

        // Atualiza a barra de progresso
        if (progressBar) {
            const percentage = (currentLength / maxlength) * 100;
            progressBar.style.width = percentage + '%';

            // Muda a cor da barra dependendo do progresso
            progressBar.classList.remove('bg-success', 'bg-warning', 'bg-danger');
            if (percentage < 70) {
                progressBar.classList.add('bg-success');
            } else if (percentage < 90) {
                progressBar.classList.add('bg-warning');
            } else {
                progressBar.classList.add('bg-danger');
            }
        }

        // Valida campo obrigatório
        if (isRequired && !textareaElement.value.trim()) {
            messages.push(`Campo "${fieldLabel}" é obrigatório.`);
        } else {
            // Valida comprimento mínimo
            if (minlength && currentLength > 0 && currentLength < minlength) {
                messages.push(`Campo "${fieldLabel}" deve ter no mínimo ${minlength} caracteres. (${currentLength}/${minlength})`);
            }

            // Valida comprimento máximo (aviso)
            if (maxlength && currentLength >= maxlength * 0.9) {
                if (currentLength >= maxlength) {
                    messages.push(`Campo "${fieldLabel}" atingiu o limite máximo de ${maxlength} caracteres.`);
                } else {
                    messages.push(`Campo "${fieldLabel}" próximo ao limite máximo.`);
                }
            }

            // Valida regras de caracteres apenas se houver valor
            if (textareaElement.value && currentLength >= minlength) {
                messages.push(...validateTextareaValue(textareaElement.value, rules, fieldLabel));
            }
        }

        if (messages.length > 0) {
            feedback.innerHTML = messages.join('<br>');
            textareaElement.classList.add('is-invalid');
            return;
        }

        feedback.innerHTML = '';
        textareaElement.classList.remove('is-invalid');
    };

    textareaElement.addEventListener('input', runValidation);
    textareaElement.addEventListener('blur', runValidation);

    // Valida estado inicial
    runValidation();
}

// Executa automaticamente quando o script é carregado
(function () {

    // Procura por elementos com a classe "field_textarea" dentro do form
    const fieldContainers = document.querySelectorAll('form .field_textarea');

    fieldContainers.forEach(container => {

        // Verifica se o container tem atributos data-* para sobrescrever o padrão
        // Normaliza os nomes de atributos (fieldreadonly -> fieldReadOnly, etc)
        const rawDataset = container.dataset;
        const customAttributes = normalizeDatasetAttributes(rawDataset);

        // Cria uma instância da classe TextareaField com os atributos customizados
        const textareaField = new TextareaField(customAttributes);

        // Adiciona o HTML do textarea dentro do container usando innerHTML
        container.innerHTML = textareaField.render();

        // Acopla validação por campo (special/number/letter/minlength/maxlength)
        // Não valida campos desabilitados ou somente leitura
        const isDisabled = normalizeBoolean(textareaField.attributes.Disabled, false);
        const isReadOnly = normalizeBoolean(textareaField.attributes.ReadOnly, false);

        if (!isDisabled && !isReadOnly) {
            const textareaElement = container.querySelector('textarea');
            attachTextareaValidation(container, textareaElement, textareaField.attributes);
        } else {
            // Se for readonly ou disabled, bloqueia digitação direta via teclado
            const textareaElement = container.querySelector('textarea');
            if (textareaElement) {
                textareaElement.addEventListener('keypress', function (e) {
                    e.preventDefault();
                });
                // Listener leve: atualiza contador quando o valor é preenchido via JS (dispatchEvent)
                var _charCount   = container.querySelector('.char-count');
                var _progressBar = container.querySelector('.progress-bar');
                var _maxlen = parseInt(textareaElement.getAttribute('maxlength') || '500', 10);
                textareaElement.addEventListener('input', function () {
                    var len = textareaElement.value.length;
                    if (_charCount)   { _charCount.textContent = len; }
                    if (_progressBar) { _progressBar.style.width = ((len / _maxlen) * 100) + '%'; }
                });
            }
        }
    });
})();
