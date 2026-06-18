// JSON com atributos padrão do campo select com busca (combobox)
const defaultSelectAttributes = {
    legend: "Título do Campo",
    legendClass: "form-label fw-semibold",
    wrapperClass: "mb-1",
    name: "select_field",
    placeholder: "Digite para pesquisar...",
    valueKey: "id",          // chave do JSON usada como value no hidden input
    labelKey: "nome",        // chave do JSON exibida no text input
    labelTemplate: "",       // template de label: "{campo1} - {campo2}" (sobrepõe labelKey)
    src: "",                 // URL de um JSON externo (data-src) — suporta JWT via SadHttp
    options: [],             // array inline (alternativa ao src)
    maxVisible: 150,         // máximo de <option> renderizadas por vez no dropdown
    rows: 8,                 // linhas visíveis no select do dropdown
    value: "",               // value pré-selecionado
    Disabled: false,
    Required: false,
    findSrc: "",             // URL do POST find (fallback quando filtro local retorna vazio)
    findColumn: "",          // coluna enviada no body: { "coluna": "expressao" }
    getSrc: ""               // URL base do GET por ID: {getSrc}/{id} — usado pelo setValue quando não encontrado localmente
};

// Classe para criar campo select combobox (linha única + dropdown flutuante)
class SelectField {
    constructor(attributes) {
        this.attributes = { ...defaultSelectAttributes, ...attributes };

        // Parse de options inline via JSON string (data-options)
        if (typeof this.attributes.options === 'string') {
            try {
                this.attributes.options = JSON.parse(this.attributes.options);
            } catch (e) {
                console.warn('[SelectField] Falha ao parsear data-options.', e);
                this.attributes.options = [];
            }
        }

        // Normaliza numéricos que chegam como string via dataset
        this.attributes.maxVisible = parseInt(this.attributes.maxVisible, 10) || 150;
        this.attributes.rows = parseInt(this.attributes.rows, 10) || 8;

        // Normaliza labelKey: aceita array JS, JSON string ou string separada por vírgula
        const lk = this.attributes.labelKey;
        if (Array.isArray(lk)) {
            this.attributes.labelKey = lk.map(k => k.trim()).filter(Boolean);
        } else if (typeof lk === 'string' && lk.trim().startsWith('[')) {
            try {
                this.attributes.labelKey = JSON.parse(lk);
            } catch (e) {
                console.warn('[SelectField] Falha ao parsear data-label-key.', e);
            }
        } else if (typeof lk === 'string' && lk.includes(',')) {
            this.attributes.labelKey = lk.split(',').map(k => k.trim()).filter(Boolean);
        }

        // Estado interno
        this._allData = [];
        this._selectedValue = String(this.attributes.value || '');
        this._selectedLabel = '';
        this._container = null;
    }

    render() {
        const {
            legend,
            legendClass,
            wrapperClass,
            name,
            placeholder,
            rows,
            Disabled,
            Required
        } = this.attributes;

        const isDisabled = normalizeSelectBoolean(Disabled, false);
        const isRequired = normalizeSelectBoolean(Required, false);
        const disabledAttr = isDisabled ? ' disabled' : '';
        const requiredMark = isRequired ? ' <span class="text-danger">*</span>' : '';

        let html = `<div class="${wrapperClass}">`;

        // Label
        if (legend) {
            html += `<label class="${legendClass}">${legend}${requiredMark}</label>`;
        }

        // Wrapper relativo: contém o input e o dropdown absoluto
        html += `<div style="position:relative">`;

        // Input de busca — linha única, idêntico aos outros campos do formulário
        // O botão [×] fica dentro usando position:absolute para não alterar a altura
        html += `
            <input type="text"
                   class="form-control field-select-search"
                   placeholder="${placeholder}"
                   autocomplete="off"
                   spellcheck="false"${disabledAttr}>
            <button type="button"
                    class="field-select-clear"
                    title="Limpar seleção"
                    style="position:absolute;right:8px;top:50%;transform:translateY(-50%);
                           background:none;border:none;color:#999;font-size:1rem;
                           line-height:1;padding:0;cursor:pointer;display:none">&#10005;</button>
        `;

        // Dropdown flutuante — position:absolute, não ocupa espaço no fluxo do documento
        html += `
            <div class="field-select-dropdown"
                 style="display:none;position:absolute;z-index:1050;width:100%;
                        background:#fff;border:1px solid #ced4da;border-top:none;
                        border-radius:0 0 0.375rem 0.375rem;
                        box-shadow:0 4px 12px rgba(0,0,0,.12)">
                <select class="form-select border-0 rounded-0 field-select-list"
                        size="${rows}"
                        style="overflow-y:auto;cursor:pointer;width:100%"${disabledAttr}></select>
                <div class="px-2 py-1 border-top text-muted field-select-count"
                     style="font-size:0.68rem;font-style:italic"></div>
            </div>
        `;

        html += `</div>`; // fecha wrapper relativo

        // Hidden input — valor real submetido no form
        html += `<input type="hidden" name="${name}" value="" class="field-select-value">`;

        // Feedback de validação
        html += `<small class="text-danger d-block"
                        style="font-size:0.7rem;font-style:italic;line-height:1.2;margin-top:2px"></small>`;

        html += `</div>`; // fecha wrapperClass

        return html;
    }

    async init(container) {
        this._container = container;

        const search = container.querySelector('.field-select-search');
        const clearBtn = container.querySelector('.field-select-clear');
        const dropdown = container.querySelector('.field-select-dropdown');
        const selectEl = container.querySelector('.field-select-list');
        const hiddenInput = container.querySelector('.field-select-value');
        const countEl = container.querySelector('.field-select-count');
        const feedback = container.querySelector('small.text-danger');

        const isRequired = normalizeSelectBoolean(this.attributes.Required, false);
        const isDisabled = normalizeSelectBoolean(this.attributes.Disabled, false);
        const legend = this.attributes.legend || this.attributes.name || 'Campo';

        // Carrega dados
        await this._loadData();

        // Resolve label do valor pré-selecionado
        if (this._selectedValue) {
            const found = this._findByValue(this._selectedValue);
            if (found) {
                this._selectedLabel = this._getLabel(found);
                hiddenInput.value = this._selectedValue;
                search.value = this._selectedLabel;
                clearBtn.style.display = '';
            }
        }

        // -----------------------------------------------------------------
        // Validação
        // -----------------------------------------------------------------

        const runValidation = () => {
            if (!isRequired) {
                return;
            }
            if (!hiddenInput.value) {
                feedback.innerHTML = `Campo "${legend}" é obrigatório.`;
                search.classList.add('is-invalid');
            } else {
                feedback.innerHTML = '';
                search.classList.remove('is-invalid');
            }
        };

        if (isRequired) {
            runValidation();
        }

        if (isDisabled) {
            return; // campo desabilitado: só exibe o valor, sem eventos
        }

        // -----------------------------------------------------------------
        // Renderização das opções no dropdown
        // -----------------------------------------------------------------

        const renderOptions = async (query = '') => {
            let filtered = this._filterData(query);

            if (filtered.length === 0 && query.trim() && this.attributes.findSrc && this.attributes.findColumn) {
                countEl.textContent = 'Buscando...';
                const found = await this._findData(query);
                if (found.length > 0) {
                    // injeta no cache local para _findByValue funcionar ao selecionar
                    const { valueKey } = this.attributes;
                    for (const item of found) {
                        const val = String(item[valueKey] ?? '');
                        if (!this._allData.some(d => String(d[valueKey] ?? '') === val)) {
                            this._allData.push(item);
                        }
                    }
                    filtered = found;
                }
            }

            const { maxVisible, valueKey } = this.attributes;

            let html = '';
            let visibleCount = 0;

            // Item selecionado fixado no topo
            if (this._selectedValue && this._selectedLabel) {
                html += `<option value="${this._esc(this._selectedValue)}"
                                  selected
                                  style="background:#dbeafe;font-weight:600">
                            ✓ ${this._esc(this._selectedLabel)}
                         </option>`;
                html += `<option disabled style="color:#bbb;font-size:0.65rem">──────────────────</option>`;
            }

            for (const item of filtered) {
                const val = String(item[valueKey] ?? '');
                const lbl = this._getLabel(item);

                if (val === this._selectedValue) {
                    continue; // já está no topo
                }

                if (visibleCount >= maxVisible) {
                    break;
                }

                html += `<option value="${this._esc(val)}">${this._esc(lbl)}</option>`;
                visibleCount++;
            }

            selectEl.innerHTML = html;

            const totalFiltered = filtered.length;
            if (totalFiltered > maxVisible) {
                countEl.textContent = `Exibindo ${visibleCount} de ${totalFiltered} registros`;
            } else {
                countEl.textContent = `${totalFiltered} registro${totalFiltered !== 1 ? 's' : ''}`;
            }
        };

        // -----------------------------------------------------------------
        // Abrir / fechar dropdown
        // -----------------------------------------------------------------

        const openDropdown = async () => {
            dropdown.style.display = '';
            await renderOptions(this._selectedValue ? '' : search.value);
        };

        const closeDropdown = () => {
            dropdown.style.display = 'none';
            // Se fechou sem selecionar nada, restaura o label anterior (ou limpa)
            if (!hiddenInput.value) {
                search.value = '';
            } else {
                search.value = this._selectedLabel;
            }
        };

        // -----------------------------------------------------------------
        // Selecionar item
        // -----------------------------------------------------------------

        const selectItem = (val, lbl) => {
            this._selectedValue = val;
            this._selectedLabel = lbl;
            hiddenInput.value = val;
            search.value = lbl;
            clearBtn.style.display = '';
            closeDropdown();
            runValidation();
            container.dispatchEvent(new Event('change', { bubbles: true }));
        };

        // -----------------------------------------------------------------
        // Limpar seleção
        // -----------------------------------------------------------------

        const clearSelection = () => {
            this._selectedValue = '';
            this._selectedLabel = '';
            hiddenInput.value = '';
            search.value = '';
            clearBtn.style.display = 'none';
            search.classList.remove('is-invalid');
            feedback.innerHTML = '';
            // Abre o dropdown com lista completa para nova busca
            openDropdown();
            search.focus();
            runValidation();
            container.dispatchEvent(new Event('change', { bubbles: true }));
        };

        // -----------------------------------------------------------------
        // Eventos
        // -----------------------------------------------------------------

        // Foco no input: abre dropdown
        search.addEventListener('focus', () => {
            openDropdown();
        });

        // Digitação com debounce: filtra opções e desmarca seleção prévia
        let debounceTimer;
        search.addEventListener('input', () => {
            // Se havia seleção, limpa o hidden (usuário está redigitando)
            if (this._selectedValue) {
                this._selectedValue = '';
                this._selectedLabel = '';
                hiddenInput.value = '';
                clearBtn.style.display = 'none';
                runValidation();
            }

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                openDropdown();
            }, 180);
        });

        // Clique em opção no select
        selectEl.addEventListener('change', () => {
            const val = selectEl.value;
            const found = this._findByValue(val);
            if (!found) {
                return;
            }
            selectItem(
                String(found[this.attributes.valueKey] ?? ''),
                this._getLabel(found)
            );
        });

        // Botão limpar [×]
        clearBtn.addEventListener('click', e => {
            e.stopPropagation();
            clearSelection();
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', e => {
            if (!container.contains(e.target)) {
                closeDropdown();
            }
        });

        // Tecla Escape fecha o dropdown
        search.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                closeDropdown();
                search.blur();
            }
        });

        // Blur no select: fecha dropdown se foco sair da área inteira
        selectEl.addEventListener('blur', () => {
            // pequeno delay para permitir que o clique no item seja capturado antes
            setTimeout(() => {
                if (!container.contains(document.activeElement)) {
                    closeDropdown();
                }
            }, 150);
        });
    }

    // Recarrega os dados do src sem perder a seleção atual (útil após criar novo registro)
    async reload() {
        await this._loadData();

        // Re-resolve o label do valor já selecionado (caso o registro tenha sido renomeado)
        if (this._selectedValue && this._container) {
            const found = this._findByValue(this._selectedValue);
            if (found) {
                this._selectedLabel = this._getLabel(found);
            }
        }
    }

    // Define o valor programaticamente após a inicialização (útil no update.js e get.js)
    // Quando o item não está no cache local e data-get-src está configurado,
    // faz GET {getSrc}/{val} para buscar o registro específico antes de definir.
    async setValue(val) {
        if (val === null || val === undefined || val === '') { return; }
        const strVal = String(val);
        let found = this._findByValue(strVal);

        if (!found) {
            found = await this._fetchOne(strVal);
        }

        if (!found) { return; }

        this._selectedValue = strVal;
        this._selectedLabel = this._getLabel(found);

        if (!this._container) { return; }
        const hiddenInput = this._container.querySelector('.field-select-value');
        const search = this._container.querySelector('.field-select-search');
        const clearBtn = this._container.querySelector('.field-select-clear');
        const feedback = this._container.querySelector('small.text-danger');

        if (hiddenInput) { hiddenInput.value = strVal; }
        if (search) {
            search.value = this._selectedLabel;
            search.classList.remove('is-invalid');
        }
        if (clearBtn) { clearBtn.style.display = ''; }
        if (feedback) { feedback.innerHTML = ''; }
    }

    // Busca um registro específico por ID via GET {getSrc}/{val}
    // Injeta o resultado em _allData para uso posterior por _findByValue
    async _fetchOne(val) {
        const { getSrc, valueKey } = this.attributes;
        if (!getSrc || !val) { return null; }

        try {
            const url = `${getSrc}/${encodeURIComponent(val)}`;
            let json;

            if (typeof SadHttp !== 'undefined') {
                const resp = await SadHttp.get(url);
                if (!resp.ok) { return null; }
                json = resp.json;
            } else {
                const res = await fetch(url);
                if (!res.ok) { return null; }
                json = await res.json();
            }

            const item = json.data ?? null;
            if (!item) { return null; }

            const strV = String(item[valueKey] ?? '');
            if (!this._allData.some(d => String(d[valueKey] ?? '') === strV)) {
                this._allData.push(item);
            }

            return this._findByValue(val);
        } catch (e) {
            console.warn('[SelectField] Falha ao buscar getSrc:', getSrc, val, e);
            return null;
        }
    }

    // Carrega dados de src (fetch autenticado via SadHttp) ou usa options inline
    async _loadData() {
        const { src, options } = this.attributes;

        if (src) {
            try {
                let json;

                // Usa SadHttp (injeta Bearer token) quando disponível
                if (typeof SadHttp !== 'undefined') {
                    const resp = await SadHttp.get(src);
                    if (!resp.ok) { throw new Error(`HTTP ${resp.status}`); }
                    json = resp.json;
                } else {
                    const res = await fetch(src);
                    if (!res.ok) { throw new Error(`HTTP ${res.status}`); }
                    json = await res.json();
                }

                this._allData = Array.isArray(json)
                    ? json
                    : (json.data ?? json.items ?? []);
            } catch (e) {
                console.warn('[SelectField] Falha ao carregar src:', src, e);
                this._allData = [];
            }
        } else if (Array.isArray(options) && options.length > 0) {
            this._allData = options;
        }
    }

    // POST no endpoint find quando filtro local retornar vazio
    async _findData(query) {
        const { findSrc, findColumn } = this.attributes;
        if (!findSrc || !findColumn || !query) { return []; }

        try {
            const body = { [findColumn]: query.trim() };
            let json;

            if (typeof SadHttp !== 'undefined') {
                const resp = await SadHttp.post(findSrc, body);
                if (!resp.ok) { throw new Error(`HTTP ${resp.status}`); }
                json = resp.json;
            } else {
                const res = await fetch(findSrc, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                if (!res.ok) { throw new Error(`HTTP ${res.status}`); }
                json = await res.json();
            }

            return Array.isArray(json) ? json : (json.data ?? json.items ?? []);
        } catch (e) {
            console.warn('[SelectField] Falha ao buscar findSrc:', findSrc, e);
            return [];
        }
    }

    // Filtra por query — busca em labelKey/labelTemplate, valueKey e todos os campos string
    _filterData(query) {
        if (!query || !query.trim()) {
            return this._allData;
        }

        const q = query.trim().toLowerCase();
        const { valueKey } = this.attributes;

        return this._allData.filter(item => {
            const label = this._getLabel(item).toLowerCase();
            const value = String(item[valueKey] ?? '').toLowerCase();

            if (label.includes(q) || value.includes(q)) {
                return true;
            }

            return Object.values(item).some(
                v => typeof v === 'string' && v.toLowerCase().includes(q)
            );
        });
    }

    // Resolve o label de um item respeitando labelTemplate ou labelKey (string ou array)
    _getLabel(item) {
        const template = this.attributes.labelTemplate;
        if (template) {
            return template.replace(/\{(\w+)\}/g, (_, key) => String(item[key] ?? ''));
        }
        const labelKey = this.attributes.labelKey;
        if (Array.isArray(labelKey)) {
            return labelKey.map(k => String(item[k] ?? '')).filter(Boolean).join(' — ');
        }
        return String(item[labelKey] ?? '');
    }

    _findByValue(val) {
        return this._allData.find(
            item => String(item[this.attributes.valueKey] ?? '') === String(val)
        ) ?? null;
    }

    // Escapa HTML para evitar XSS
    _esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}

function normalizeSelectBoolean(value, fallback = true) {
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

function normalizeSelectDataset(dataset) {
    const normalized = {};

    for (let key in dataset) {
        if (key === 'disabled') {
            normalized['Disabled'] = dataset[key];
        } else if (key === 'required') {
            normalized['Required'] = dataset[key];
        } else {
            // dataset já entrega camelCase: data-value-key → valueKey
            normalized[key] = dataset[key];
        }
    }

    return normalized;
}

// Executa automaticamente quando o script é carregado
(function () {

    document.querySelectorAll('.field_select').forEach(container => {
        const customAttributes = normalizeSelectDataset(container.dataset);
        const sf = new SelectField(customAttributes);

        container.innerHTML = sf.render();

        // Expõe instância e Promise de inicialização no container
        // para que scripts externos (ex: update.js) possam coordenar pré-seleção
        container._sf = sf;
        container._sfReady = sf.init(container);
    });

}());
