// JSON com atributos padrão do campo Celular / Telefone
const defaultCelularTelefoneAttributes = {
    label: "Celular / Telefone",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "text",
    id: "celular_telefone",
    name: "celular_telefone",
    value: "",
    placeholder: "(XX) XXXXX-XXXX",
    maxlength: "15",
    ReadOnly: false,
    Disabled: false,
    Required: false
};

// Classe para criar campos Celular / Telefone
class CelularTelefoneField {
    constructor(attributes) {
        this.attributes = { ...defaultCelularTelefoneAttributes, ...attributes };
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
            const required = normalizeBooleanTel(Required, false) ? ' <span class="text-danger">*</span>' : '';
            htmlString += `<label for="${inputAttributes.id}" class="${labelClass}">${label}${required}</label>`;
        }

        // Adiciona atributos readonly, disabled e required ao input
        if (normalizeBooleanTel(ReadOnly, false)) {
            inputAttributes.readonly = 'readonly';
        }

        if (normalizeBooleanTel(Disabled, false)) {
            inputAttributes.disabled = 'disabled';
        }

        if (normalizeBooleanTel(Required, false)) {
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

// =========================================================================
// DDDs VÁLIDOS — ANATEL (Brasil)
// =========================================================================

const DDDS_VALIDOS = [
    // Sudeste
    11, 12, 13, 14, 15, 16, 17, 18, 19,  // São Paulo
    21, 22, 24,                            // Rio de Janeiro
    27, 28,                                // Espírito Santo
    31, 32, 33, 34, 35, 37, 38,           // Minas Gerais
    // Sul
    41, 42, 43, 44, 45, 46,               // Paraná
    47, 48, 49,                            // Santa Catarina
    51, 53, 54, 55,                        // Rio Grande do Sul
    // Centro-Oeste / DF / Norte especial
    61,                                    // Distrito Federal
    62, 64,                                // Goiás
    63,                                    // Tocantins
    65, 66,                                // Mato Grosso
    67,                                    // Mato Grosso do Sul
    68,                                    // Acre
    69,                                    // Rondônia
    // Nordeste
    71, 73, 74, 75, 77,                   // Bahia
    79,                                    // Sergipe
    81, 87,                                // Pernambuco
    82,                                    // Alagoas
    83,                                    // Paraíba
    84,                                    // Rio Grande do Norte
    85, 88,                                // Ceará
    86, 89,                                // Piauí
    // Norte / Maranhão
    91, 93, 94,                            // Pará
    92, 97,                                // Amazonas
    95,                                    // Roraima
    96,                                    // Amapá
    98, 99                                 // Maranhão
];

// =========================================================================
// HELPERS
// =========================================================================

function normalizeBooleanTel(value, fallback = true) {
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

function normalizeDatasetAttributesTel(dataset) {
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

// =========================================================================
// FORMATAÇÃO
// Máscara dinâmica:
//   10 dígitos → telefone fixo: (XX) XXXX-XXXX
//   11 dígitos → celular:       (XX) XXXXX-XXXX
// =========================================================================

function formatCelularTelefone(value) {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');

    // Limita a 11 dígitos (DDD 2 + celular 9)
    const d = digits.slice(0, 11);
    const n = d.length;

    if (n === 0) return '';
    if (n <= 2)  return '(' + d;
    if (n <= 6)  return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (n <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);

    // 11 dígitos: celular
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
}

// Retorna apenas os dígitos numéricos (valor puro para payload/banco)
function getCelularTelefoneDigits(value) {
    return value.replace(/\D/g, '');
}

// =========================================================================
// VALIDAÇÃO
// =========================================================================

function isDddValido(digits) {
    if (digits.length < 2) return false;
    const ddd = parseInt(digits.slice(0, 2), 10);
    return DDDS_VALIDOS.indexOf(ddd) !== -1;
}

function isTelefoneValido(digits) {
    // Aceita 10 dígitos (telefone fixo) ou 11 dígitos (celular)
    return digits.length === 10 || digits.length === 11;
}

function getTipoTelefone(digits) {
    if (digits.length === 11) return 'celular';
    if (digits.length === 10) return 'telefone';
    return null;
}

// =========================================================================
// VALIDAÇÃO + EVENTOS
// =========================================================================

function _escHtml(s) { return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function attachCelularTelefoneValidation(container, inputElement, attributes) {
    if (!inputElement) {
        return;
    }

    const feedback = document.createElement('small');
    feedback.className = 'text-danger d-block';
    feedback.style.margin     = '0';
    feedback.style.padding    = '0';
    feedback.style.fontSize   = '0.7rem';
    feedback.style.lineHeight = '1.2';
    feedback.style.fontStyle  = 'italic';
    feedback.style.marginTop  = '0px';
    container.appendChild(feedback);

    const fieldLabel = _escHtml(attributes.label || 'Celular / Telefone');
    const isRequired = normalizeBooleanTel(attributes.Required, false);

    const setFeedback = (msg) => {
        feedback.innerHTML = msg;
        if (msg) {
            inputElement.classList.add('is-invalid');
        } else {
            inputElement.classList.remove('is-invalid');
        }
    };

    const runValidation = () => {
        const raw    = inputElement.value;
        const digits = getCelularTelefoneDigits(raw);

        // Campo obrigatório vazio
        if (isRequired && !raw.trim()) {
            setFeedback(`Campo "${fieldLabel}" é obrigatório.`);
            return;
        }

        // Permite campo vazio se não for obrigatório
        if (!raw.trim()) {
            setFeedback('');
            return;
        }

        // Tamanho mínimo
        if (digits.length < 10) {
            setFeedback('Número incompleto. Informe DDD + número (8 ou 9 dígitos).');
            return;
        }

        // DDD inválido
        if (!isDddValido(digits)) {
            const ddd = digits.slice(0, 2);
            setFeedback(`DDD "${ddd}" não é válido. Verifique o código de área.`);
            return;
        }

        setFeedback('');
    };

    inputElement.addEventListener('input', function (e) {
        const raw = e.target.value;

        // Alerta sobre letras
        if (/[a-zA-Z]/.test(raw)) {
            setFeedback('Número não pode conter letras. Use apenas dígitos.');
            e.target.value = formatCelularTelefone(raw);
            return;
        }

        // Alerta sobre caracteres especiais não desejados
        // (apenas dígitos, parênteses, espaço e hífen são aceitos durante digitação)
        if (/[^0-9()\s\-]/.test(raw)) {
            setFeedback('Caractere inválido. Use apenas números.');
            e.target.value = formatCelularTelefone(raw);
            return;
        }

        // Aplica máscara dinâmica
        e.target.value = formatCelularTelefone(raw);

        const digits = getCelularTelefoneDigits(e.target.value);

        // Valida DDD assim que os 2 primeiros dígitos forem digitados
        if (digits.length >= 2 && !isDddValido(digits)) {
            const ddd = digits.slice(0, 2);
            setFeedback(`DDD "${ddd}" não é válido. Verifique o código de área.`);
            return;
        }

        // Número completo: valida integralmente
        if (isTelefoneValido(digits)) {
            setFeedback('');
            return;
        }

        // Ainda digitando: limpa feedback intermediário
        setFeedback('');
    });

    inputElement.addEventListener('blur', runValidation);

    // Valida estado inicial (ex: valor pré-preenchido)
    runValidation();
}

// =========================================================================
// IIFE — Auto-inicialização
// =========================================================================

(function () {

    // Procura por elementos com a classe "field_celular_telefone" dentro do form
    const fieldContainers = document.querySelectorAll('form .field_celular_telefone');

    fieldContainers.forEach(container => {

        // Normaliza os nomes de atributos
        const rawDataset       = container.dataset;
        const customAttributes = normalizeDatasetAttributesTel(rawDataset);

        // Aplica máscara no value pré-preenchido (ex: valor bruto vindo da API — só dígitos)
        if (customAttributes.value) {
            customAttributes.value = formatCelularTelefone(customAttributes.value);
        }

        // Cria uma instância da classe com os atributos customizados
        const telField = new CelularTelefoneField(customAttributes);

        // Injeta o HTML dentro do container
        container.innerHTML = telField.render();

        // Acopla validação
        // Não valida campos desabilitados ou somente leitura
        const isDisabled = normalizeBooleanTel(telField.attributes.Disabled, false);
        const isReadOnly = normalizeBooleanTel(telField.attributes.ReadOnly, false);

        if (!isDisabled && !isReadOnly) {
            const inputElement = container.querySelector('input');
            attachCelularTelefoneValidation(container, inputElement, telField.attributes);
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
}());
