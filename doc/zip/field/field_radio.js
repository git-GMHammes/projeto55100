// JSON com atributos padrão do grupo de campos radio
const defaultRadioAttributes = {
    legend: "Título do Grupo",
    legendClass: "form-label fw-semibold d-block",
    wrapperClass: "mb-1",
    name: "radio_group",
    inline: false,
    Disabled: false,
    Required: false,
    options: [
        { id: "radio_1", value: "opcao1", label: "Opção 1", checked: true },
        { id: "radio_2", value: "opcao2", label: "Opção 2" }
    ]
};

// Classe para criar grupo de campos radio
class RadioField {
    constructor(attributes) {
        this.attributes = { ...defaultRadioAttributes, ...attributes };

        // Normaliza options: se vier como string JSON (data-options), converte para array
        if (typeof this.attributes.options === 'string') {
            try {
                this.attributes.options = JSON.parse(this.attributes.options);
            } catch (e) {
                console.warn('[RadioField] Falha ao parsear data-options. Usando padrão.', e);
                this.attributes.options = defaultRadioAttributes.options;
            }
        }

        // Aplica data-value como seleção padrão (substitui checked nas options)
        const defaultValue = this.attributes.value;
        if (defaultValue !== undefined && defaultValue !== null && defaultValue !== '') {
            const strDefault = String(defaultValue);
            this.attributes.options = this.attributes.options.map(opt => ({
                ...opt,
                checked: String(opt.value) === strDefault
            }));
        }
    }

    render() {
        const {
            legend,
            legendClass,
            wrapperClass,
            name,
            inline,
            Disabled,
            Required,
            options
        } = this.attributes;

        const isInline = normalizeRadioBoolean(inline, false);
        const isDisabled = normalizeRadioBoolean(Disabled, false);
        const isRequired = normalizeRadioBoolean(Required, false);

        let html = `<div class="${wrapperClass}">`;

        // Label/legenda do grupo
        if (legend) {
            const requiredMark = isRequired ? ' <span class="text-danger">*</span>' : '';
            html += `<label class="${legendClass}">${legend}${requiredMark}</label>`;
        }

        // Container dos radios
        html += `<div>`;

        options.forEach((opt, index) => {
            const isChecked = normalizeRadioBoolean(opt.checked, false);
            const checkAttr = isChecked ? ' checked' : '';
            const disabledAttr = isDisabled ? ' disabled' : '';
            // required apenas no primeiro radio do grupo (semântica HTML correta)
            const requiredAttr = (isRequired && index === 0) ? ' required' : '';
            const inlineClass = isInline ? ' form-check-inline' : '';

            html += `<div class="form-check${inlineClass}">`;
            html += `<input class="form-check-input" type="radio" id="${opt.id}" name="${name}" value="${opt.value}"${checkAttr}${disabledAttr}${requiredAttr}>`;
            html += `<label class="form-check-label" for="${opt.id}">${opt.label}</label>`;
            html += `</div>`;
        });

        html += `</div>`; // fecha container dos radios

        // Área de feedback de validação
        html += `<small class="text-danger d-block" style="font-size:0.7rem;font-style:italic;line-height:1.2;margin-top:2px"></small>`;

        html += `</div>`; // fecha wrapperClass

        return html;
    }
}

function normalizeRadioBoolean(value, fallback = true) {
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

function normalizeRadioDataset(dataset) {
    const normalized = {};

    for (let key in dataset) {
        if (key === 'disabled') {
            normalized['Disabled'] = dataset[key];
        } else if (key === 'required') {
            normalized['Required'] = dataset[key];
        } else {
            normalized[key] = dataset[key];
        }
    }

    return normalized;
}

function _escHtml(s) { return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function attachRadioValidation(container, name, attributes) {
    const feedback = container.querySelector('small.text-danger');
    if (!feedback) {
        return;
    }

    const isRequired = normalizeRadioBoolean(attributes.Required, false);
    if (!isRequired) {
        return;
    }

    const legend = _escHtml(attributes.legend || name || 'Campo');

    const runValidation = () => {
        const checked = container.querySelector(`input[name="${name}"]:checked`);

        if (!checked) {
            feedback.innerHTML = `Campo "${legend}" é obrigatório.`;
            container.querySelectorAll(`input[name="${name}"]`).forEach(r => r.classList.add('is-invalid'));
        } else {
            feedback.innerHTML = '';
            container.querySelectorAll(`input[name="${name}"]`).forEach(r => r.classList.remove('is-invalid'));
        }
    };

    container.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
        radio.addEventListener('change', runValidation);
    });

    // Valida estado inicial
    runValidation();
}

// Executa automaticamente quando o script é carregado
(function () {

    // Procura por elementos com a classe "field_radio" dentro do form
    const fieldContainers = document.querySelectorAll('form .field_radio');

    fieldContainers.forEach(container => {

        // Lê e normaliza os data-* attributes do container
        const rawDataset = container.dataset;
        const customAttributes = normalizeRadioDataset(rawDataset);

        // Cria instância e renderiza
        const radioField = new RadioField(customAttributes);
        container.innerHTML = radioField.render();

        // Expõe API pública no container (semelhante ao _sf do field_select)
        container._rf = {
            setValue(val) {
                if (val === undefined || val === null) return;
                const strVal = String(val);
                container.querySelectorAll(`input[name="${radioField.attributes.name}"]`).forEach(input => {
                    input.checked = input.value === strVal;
                });
            },
            getValue() {
                const checked = container.querySelector(`input[name="${radioField.attributes.name}"]:checked`);
                return checked ? checked.value : null;
            }
        };

        // Acopla validação apenas se não estiver desabilitado
        const isDisabled = normalizeRadioBoolean(radioField.attributes.Disabled, false);

        if (!isDisabled) {
            attachRadioValidation(container, radioField.attributes.name, radioField.attributes);
        }
    });
})();
