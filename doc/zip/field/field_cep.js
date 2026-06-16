// JSON com atributos padrão do campo CEP
const defaultCepAttributes = {
    label: "CEP",
    labelClass: "form-label",
    wrapperClass: "mb-1",
    class: "form-control",
    type: "text",
    id: "cep",
    name: "cep",
    value: "",
    placeholder: "00.000-000",
    maxlength: "10",
    ReadOnly: false,
    Disabled: false,
    Required: false
};

// Variáveis globais preenchidas após consulta bem-sucedida do CEP
// Prefixo: vgcep_
var vgcep_cep = '';
var vgcep_tipoCep = '';
var vgcep_subTipoCep = '';
var vgcep_uf = '';
var vgcep_cidade = '';
var vgcep_bairro = '';
var vgcep_endereco = '';
var vgcep_complemento = '';
var vgcep_codigoIBGE = '';

// Classe para criar campos CEP
class CepField {
    constructor(attributes) {
        this.attributes = { ...defaultCepAttributes, ...attributes };
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
            apiUrl,
            apiToken,
            apiCpfUsuario,
            ...inputAttributes
        } = this.attributes;

        // Constrói a string HTML
        let htmlString = `<div class="${wrapperClass}">`;

        // Adiciona o label se existir
        if (label) {
            const required = normalizeBooleanCep(Required, false) ? ' <span class="text-danger">*</span>' : '';
            htmlString += `<label for="${inputAttributes.id}" class="${labelClass}">${label}${required}</label>`;
        }

        // Adiciona atributos readonly, disabled e required ao input
        if (normalizeBooleanCep(ReadOnly, false)) {
            inputAttributes.readonly = 'readonly';
        }

        if (normalizeBooleanCep(Disabled, false)) {
            inputAttributes.disabled = 'disabled';
        }

        if (normalizeBooleanCep(Required, false)) {
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

function normalizeBooleanCep(value, fallback = true) {
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

function normalizeDatasetAttributesCep(dataset) {
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

// Formata valor numérico como XX.XXX-XXX (máscara 00.000-000)
function formatCep(value) {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');

    // Limita a 8 dígitos
    const limited = digits.slice(0, 8);

    if (limited.length <= 2) {
        return limited;
    } else if (limited.length <= 5) {
        return limited.slice(0, 2) + '.' + limited.slice(2);
    } else {
        return limited.slice(0, 2) + '.' + limited.slice(2, 5) + '-' + limited.slice(5);
    }
}

// Retorna apenas os dígitos numéricos do CEP (valor puro para payload/API)
function getCepDigits(value) {
    return value.replace(/\D/g, '');
}

// Limpa todas as variáveis globais do CEP
function clearCepGlobals() {
    vgcep_cep = '';
    vgcep_tipoCep = '';
    vgcep_subTipoCep = '';
    vgcep_uf = '';
    vgcep_cidade = '';
    vgcep_bairro = '';
    vgcep_endereco = '';
    vgcep_complemento = '';
    vgcep_codigoIBGE = '';
}

// Preenche as variáveis globais com os dados retornados pela API
function fillCepGlobals(data) {
    vgcep_cep = data.cep || '';
    vgcep_tipoCep = data.tipoCep || '';
    vgcep_subTipoCep = data.subTipoCep || '';
    vgcep_uf = data.uf || '';
    vgcep_cidade = data.cidade || '';
    vgcep_bairro = data.bairro || '';
    vgcep_endereco = data.endereco || '';
    vgcep_complemento = data.complemento || '';
    vgcep_codigoIBGE = data.codigoIBGE || '';
}

/**
 * Consulta o endereço de um CEP via proxy local do backend (evita CORS).
 *
 * URL padrão: /api/v1/consulta-cep/{cep}  (proxy CakePHP → SERPRO server-to-server)
 *
 * Sobrescrever apenas se necessário, via dataset ou variável global:
 *   1. data-api-url no container da div
 *   2. window.vgcep_apiUrl
 *
 * @param {string} cepDigits - CEP com 8 dígitos numéricos (sem máscara)
 * @param {object} apiConfig  - { url }
 * @returns {Promise<object>} Dados do endereço retornados pela API
 */
async function consultarCepApi(cepDigits, apiConfig) {
    const baseUrl = (apiConfig && apiConfig.url) || window.vgcep_apiUrl || '/api/v1/consulta-cep';

    const response = await fetch(`${baseUrl}/${cepDigits}`, {
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 404) {
        throw new Error('CEP não encontrado. Verifique os dígitos informados.');
    }

    if (response.status === 400) {
        throw new Error('CEP inválido.');
    }

    if (!response.ok) {
        throw new Error('Erro ao consultar o CEP. Tente novamente.');
    }

    const json = await response.json();

    // Proxy retorna { success, data: { cep, tipoCep, ... } }
    return json.data ?? json;
}

function _escHtml(s) { return s == null ? '' : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function attachCepValidation(container, inputElement, attributes) {
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

    const fieldLabel = _escHtml(attributes.label || 'CEP');
    const isRequired = normalizeBooleanCep(attributes.Required, false);

    const apiConfig = {
        url: attributes.apiUrl || null
    };

    // Controla o último CEP consultado para evitar chamadas duplicadas
    let ultimoCepConsultado = '';
    let consultaEmAndamento = false;

    const setFeedback = (msg) => {
        feedback.innerHTML = msg;
        if (msg) {
            inputElement.classList.add('is-invalid');
        } else {
            inputElement.classList.remove('is-invalid');
        }
    };

    // Dispara evento customizado no inputElement (bubbles: true → escuta no form ou document)
    const dispararEvento = (tipo, detail = {}) => {
        inputElement.dispatchEvent(new CustomEvent(tipo, { bubbles: true, detail }));
    };

    const executarConsulta = async (digits) => {
        if (digits === ultimoCepConsultado || consultaEmAndamento) {
            return;
        }

        ultimoCepConsultado = digits;
        consultaEmAndamento = true;

        try {
            const data = await consultarCepApi(digits, apiConfig);
            fillCepGlobals(data);
            setFeedback('');
            dispararEvento('cep:sucesso', { cep: digits, data });
        } catch (err) {
            clearCepGlobals();
            setFeedback(err.message || 'Erro ao consultar o CEP.');
            dispararEvento('cep:limpo');
        } finally {
            consultaEmAndamento = false;
        }
    };

    inputElement.addEventListener('input', function (e) {
        const raw = e.target.value;

        // Bloqueia e alerta sobre letras
        if (/[a-zA-Z]/.test(raw)) {
            setFeedback('CEP não pode conter letras. Use apenas números.');
            e.target.value = formatCep(raw);
            return;
        }

        // Alerta sobre caracteres especiais não desejados (apenas dígitos, ponto e hífen são aceitos)
        if (/[^0-9.\-]/.test(raw)) {
            setFeedback('Caractere inválido. Permitido apenas números, "." e "-".');
            e.target.value = formatCep(raw);
            return;
        }

        // Aplica a máscara XX.XXX-XXX
        e.target.value = formatCep(raw);

        const digits = getCepDigits(e.target.value);

        if (digits.length === 8) {
            // CEP completo: dispara a consulta automaticamente
            setFeedback('');
            executarConsulta(digits);
        } else {
            // CEP incompleto: limpa globais e remove erros de consulta anteriores
            if (digits !== ultimoCepConsultado) {
                clearCepGlobals();
                ultimoCepConsultado = '';
                dispararEvento('cep:limpo');
            }
            setFeedback('');
        }
    });

    inputElement.addEventListener('blur', async function () {
        const raw = inputElement.value;
        const digits = getCepDigits(raw);

        // Valida campo obrigatório
        if (isRequired && !raw.trim()) {
            clearCepGlobals();
            dispararEvento('cep:limpo');
            setFeedback(`Campo "${fieldLabel}" é obrigatório.`);
            return;
        }

        // Valida CEP incompleto ao sair do campo
        if (raw.trim() && digits.length > 0 && digits.length < 8) {
            clearCepGlobals();
            dispararEvento('cep:limpo');
            setFeedback('CEP incompleto. Informe todos os 8 dígitos.');
            return;
        }

        // Garante consulta caso o campo tenha sido preenchido sem disparar o input
        if (digits.length === 8 && digits !== ultimoCepConsultado) {
            await executarConsulta(digits);
        }
    });

    // Consulta valor pré-preenchido ao carregar o componente
    const initialDigits = getCepDigits(inputElement.value);
    if (initialDigits.length === 8) {
        executarConsulta(initialDigits);
    }
}

// Executa automaticamente quando o script é carregado
(function () {

    // Procura por elementos com a classe "field_cep" dentro do form
    const fieldContainers = document.querySelectorAll('form .field_cep');

    fieldContainers.forEach(container => {

        // Normaliza os nomes de atributos
        const rawDataset = container.dataset;
        const customAttributes = normalizeDatasetAttributesCep(rawDataset);

        // Aplica máscara no value pré-preenchido (ex: valor bruto vindo da API — 8 dígitos sem máscara)
        if (customAttributes.value) {
            customAttributes.value = formatCep(customAttributes.value);
        }

        // Cria uma instância da classe CepField com os atributos customizados
        const cepField = new CepField(customAttributes);

        // Adiciona o HTML do input dentro do container usando innerHTML
        container.innerHTML = cepField.render();

        // Acopla validação por campo
        // Não valida campos desabilitados ou somente leitura
        const isDisabled = normalizeBooleanCep(cepField.attributes.Disabled, false);
        const isReadOnly = normalizeBooleanCep(cepField.attributes.ReadOnly, false);

        if (!isDisabled && !isReadOnly) {
            const inputElement = container.querySelector('input');
            attachCepValidation(container, inputElement, cepField.attributes);
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
