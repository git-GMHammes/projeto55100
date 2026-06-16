// JSON com atributos padrão do grupo de campos checkbox
const defaultCheckboxAttributes = {
    legend: "Título do Grupo",
    legendClass: "form-label fw-semibold d-block",
    wrapperClass: "mb-1",
    name: "checkbox_group",
    inline: false,
    Disabled: false,
    Required: false,
    options: [
        { id: "check_1", value: "opcao1", label: "Opção 1", checked: true },
        { id: "check_2", value: "opcao2", label: "Opção 2" }
    ]
};

// Classe para criar grupo de campos checkbox
class CheckboxField {
    constructor(attributes) {
        this.attributes = { ...defaultCheckboxAttributes, ...attributes };

        // Normaliza options: se vier como string JSON (data-options), converte para array
        if (typeof this.attributes.options === 'string') {
            try {
                this.attributes.options = JSON.parse(this.attributes.options);
            } catch (e) {
                console.warn('[CheckboxField] Falha ao parsear data-options. Usando padrão.', e);
                this.attributes.options = defaultCheckboxAttributes.options;
            }
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

        const isInline = normalizeCheckboxBoolean(inline, false);
        const isDisabled = normalizeCheckboxBoolean(Disabled, false);
        const isRequired = normalizeCheckboxBoolean(Required, false);

        // Nome com notação de array para que o PHP receba todos os valores marcados
        const inputName = `${name}[]`;

        let html = `<div class="${wrapperClass}">`;

        // Label/legenda do grupo
        if (legend) {
            const requiredMark = isRequired ? ' <span class="text-danger">*</span>' : '';
            html += `<label class="${legendClass}">${legend}${requiredMark}</label>`;
        }

        // Container dos checkboxes
        html += `<div>`;

        options.forEach(opt => {
            const isChecked = normalizeCheckboxBoolean(opt.checked, false);
            const checkAttr = isChecked ? ' checked' : '';
            const disabledAttr = isDisabled ? ' disabled' : '';
            const inlineClass = isInline ? ' form-check-inline' : '';

            html += `<div class="form-check${inlineClass}">`;
            html += `<input class="form-check-input" type="checkbox" id="${opt.id}" name="${inputName}" value="${opt.value}"${checkAttr}${disabledAttr}>`;
            html += `<label class="form-check-label" for="${opt.id}">${opt.label}</label>`;
            html += `</div>`;
        });

        html += `</div>`; // fecha container dos checkboxes

        // Área de feedback de validação
        html += `<small class="text-danger d-block" style="font-size:0.7rem;font-style:italic;line-height:1.2;margin-top:2px"></small>`;

        html += `</div>`; // fecha wrapperClass

        return html;
    }
}

function normalizeCheckboxBoolean(value, fallback = true) {
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

function normalizeCheckboxDataset(dataset) {
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

function attachCheckboxValidation(container, attributes) {
    const feedback = container.querySelector('small.text-danger');
    if (!feedback) {
        return;
    }

    const isRequired = normalizeCheckboxBoolean(attributes.Required, false);
    if (!isRequired) {
        return;
    }

    const legend = _escHtml(attributes.legend || attributes.name || 'Campo');

    const runValidation = () => {
        const checked = container.querySelector('input[type="checkbox"]:checked');

        if (!checked) {
            feedback.innerHTML = `Selecione ao menos uma opção em "${legend}".`;
            container.querySelectorAll('input[type="checkbox"]').forEach(c => c.classList.add('is-invalid'));
        } else {
            feedback.innerHTML = '';
            container.querySelectorAll('input[type="checkbox"]').forEach(c => c.classList.remove('is-invalid'));
        }
    };

    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', runValidation);
    });

    // Valida estado inicial
    runValidation();
}

// Executa automaticamente quando o script é carregado
(function () {

    // Procura por elementos com a classe "field_checkbox" dentro do form
    const fieldContainers = document.querySelectorAll('form .field_checkbox');

    fieldContainers.forEach(container => {

        // Lê e normaliza os data-* attributes do container
        const rawDataset = container.dataset;
        const customAttributes = normalizeCheckboxDataset(rawDataset);

        // Cria instância e renderiza
        const checkboxField = new CheckboxField(customAttributes);
        container.innerHTML = checkboxField.render();

        // Acopla validação apenas se não estiver desabilitado
        const isDisabled = normalizeCheckboxBoolean(checkboxField.attributes.Disabled, false);

        if (!isDisabled) {
            attachCheckboxValidation(container, checkboxField.attributes);
        }
    });
})();
