import React, { useState, useEffect, useRef, useCallback } from 'react'

// ─── Interface ────────────────────────────────────────────────────────────────

export interface SelectOptionItem {
  [key: string]: unknown
}

export interface SelectFieldSchema {
  type: 'select'
  col: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  label?: string
  id?: string
  name?: string
  placeholder?: string
  /** Opções inline no formato { value: string, label: string } ou objeto genérico */
  options?: SelectOptionItem[]
  /** URL para carregar opções via GET (retorna { data: [...] } ou array direto) */
  src?: string
  /** Chave do objeto usada como value (padrão: 'id') */
  valueKey?: string
  /** Chave(s) exibida(s) como label — string simples ou array de chaves unidas por ' — ' (padrão: 'nome') */
  labelKey?: string | string[]
  /** Template de label: "{campo1} - {campo2}" (sobrepõe labelKey) */
  labelTemplate?: string
  /** Máximo de itens visíveis no dropdown (padrão: 150) */
  maxVisible?: number
  /** Linhas visíveis no select dropdown (padrão: 8) */
  rows?: number
  /** Valor pré-selecionado */
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  hidden?: boolean
  className?: string
  tabIndex?: number
  /** Authorization header para requests autenticados (Bearer token) */
  authToken?: string
  /** URL do POST find — fallback quando filtro local retorna vazio: POST { [findColumn]: query } */
  findSrc?: string
  /** Coluna enviada no body do POST findSrc */
  findColumn?: string
  /** URL base do GET por ID: {getSrc}/{id} — usado quando o valor pré-selecionado não está no cache local */
  getSrc?: string
  /** Disparado quando o valor muda */
  onChange?: (value: string, item: SelectOptionItem | null) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLabel(item: SelectOptionItem, field: SelectFieldSchema): string {
  const { labelTemplate, labelKey = 'nome' } = field
  if (labelTemplate) {
    return labelTemplate.replace(/\{(\w+)\}/g, (_, k) => String(item[k] ?? ''))
  }
  if (Array.isArray(labelKey)) {
    return labelKey.map(k => String(item[k] ?? '')).filter(Boolean).join(' — ')
  }
  return String(item[labelKey] ?? '')
}

function getValue(item: SelectOptionItem, field: SelectFieldSchema): string {
  return String(item[field.valueKey ?? 'id'] ?? '')
}

function filterData(
  data: SelectOptionItem[],
  query: string,
  field: SelectFieldSchema
): SelectOptionItem[] {
  if (!query.trim()) return data
  const q = query.trim().toLowerCase()
  return data.filter(item => {
    const lbl = getLabel(item, field).toLowerCase()
    const val = getValue(item, field).toLowerCase()
    return lbl.includes(q) || val.includes(q) ||
      Object.values(item).some(v => typeof v === 'string' && v.toLowerCase().includes(q))
  })
}

function buildAuthHeaders(authToken?: string): Record<string, string> {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {}
}

// ─── Componente ───────────────────────────────────────────────────────────────

interface SelectFieldProps { field: SelectFieldSchema }

export function SelectField({ field }: SelectFieldProps) {
  const [allData, setAllData] = useState<SelectOptionItem[]>(field.options ?? [])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedValue, setSelectedValue] = useState(field.value ?? field.defaultValue ?? '')
  const [selectedLabel, setSelectedLabel] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const isControlled = field.value !== undefined && field.onChange !== undefined
  const effectiveValue = isControlled ? (field.value ?? '') : selectedValue

  // Carrega dados do src na montagem
  useEffect(() => {
    if (!field.src) return
    setIsLoading(true)
    fetch(field.src, { headers: buildAuthHeaders(field.authToken) })
      .then(r => r.json())
      .then(json => {
        const data: SelectOptionItem[] = Array.isArray(json)
          ? json
          : (json.data ?? json.items ?? [])
        setAllData(data)
      })
      .catch(e => console.warn('[SelectField] Falha ao carregar src:', field.src, e))
      .finally(() => setIsLoading(false))
  }, [field.src])

  // Sincroniza label quando allData ou value mudam — com fallback getSrc quando valor não está no cache
  useEffect(() => {
    if (!effectiveValue) { setSelectedLabel(''); return }
    const found = allData.find(item => getValue(item, field) === effectiveValue)
    if (found) {
      setSelectedLabel(getLabel(found, field))
      return
    }
    if (!field.getSrc) return
    fetch(`${field.getSrc}/${encodeURIComponent(effectiveValue)}`, {
      headers: buildAuthHeaders(field.authToken),
    })
      .then(r => r.json())
      .then((json: unknown) => {
        const raw = json as Record<string, unknown>
        const item = (raw['data'] as SelectOptionItem | undefined) ?? null
        if (!item) return
        setAllData(prev => {
          const val = getValue(item, field)
          if (prev.some(d => getValue(d, field) === val)) return prev
          return [...prev, item]
        })
        setSelectedLabel(getLabel(item, field))
      })
      .catch(e => console.warn('[SelectField] getSrc falhou:', field.getSrc, e))
  }, [effectiveValue, allData])

  // POST fallback findSrc quando filtro local retorna vazio
  useEffect(() => {
    if (!searchText.trim() || !field.findSrc || !field.findColumn) return
    if (effectiveValue) return
    if (filterData(allData, searchText, field).length > 0) return

    fetch(field.findSrc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...buildAuthHeaders(field.authToken) },
      body: JSON.stringify({ [field.findColumn]: searchText.trim() }),
    })
      .then(r => r.json())
      .then((json: unknown) => {
        const raw = json as Record<string, unknown>
        const items: SelectOptionItem[] = Array.isArray(json)
          ? json
          : ((raw['data'] as SelectOptionItem[] | undefined) ??
             (raw['items'] as SelectOptionItem[] | undefined) ??
             [])
        if (items.length === 0) return
        setAllData(prev => {
          const next = [...prev]
          for (const item of items) {
            const val = getValue(item, field)
            if (!next.some(d => getValue(d, field) === val)) next.push(item)
          }
          return next
        })
      })
      .catch(e => console.warn('[SelectField] findSrc falhou:', field.findSrc, e))
  }, [searchText]) // allData intencional fora das deps: usamos o snapshot do momento do disparo

  const validarRequired = useCallback((val: string) => {
    if (field.required && !val) {
      const nome = field.label ?? field.name ?? field.id ?? 'Campo'
      setErro(`${nome} é obrigatório`)
    } else {
      setErro(null)
    }
  }, [field.required, field.label, field.name, field.id])

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        if (!effectiveValue) setSearchText('')
        else setSearchText(selectedLabel)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [effectiveValue, selectedLabel])

  function selectItem(item: SelectOptionItem) {
    const val = getValue(item, field)
    const lbl = getLabel(item, field)
    if (!isControlled) setSelectedValue(val)
    setSelectedLabel(lbl)
    setSearchText(lbl)
    setIsOpen(false)
    setErro(null)
    field.onChange?.(val, item)
  }

  function clearSelection() {
    if (!isControlled) setSelectedValue('')
    setSelectedLabel('')
    setSearchText('')
    setIsOpen(true)
    setErro(null)
    field.onChange?.('', null)
    setTimeout(() => searchRef.current?.focus(), 0)
  }

  function handleSearchFocus() {
    if (!field.disabled) setIsOpen(true)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value)
    if (effectiveValue) {
      if (!isControlled) setSelectedValue('')
      setSelectedLabel('')
      field.onChange?.('', null)
    }
    setIsOpen(true)
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') { setIsOpen(false); searchRef.current?.blur() }
  }

  function handleSearchBlur(e: React.FocusEvent<HTMLInputElement>) {
    validarRequired(effectiveValue)
    field.onBlur?.(e)
  }

  const maxVisible = field.maxVisible ?? 150
  const rows = field.rows ?? 8
  const filtered = filterData(allData, searchText, field)
  const visible = filtered.slice(0, maxVisible)
  const inputClass = ['form-control field-select-search', erro ? 'is-invalid' : '', field.className ?? '']
    .filter(Boolean).join(' ')

  return (
    <>
      {field.label && (
        <label htmlFor={field.id} className="form-label fw-semibold">
          {field.label}{field.required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <div ref={containerRef} style={{ position: 'relative' }}>
        <input
          ref={searchRef}
          type="text"
          id={field.id}
          className={inputClass}
          placeholder={isLoading ? 'Carregando...' : (field.placeholder ?? 'Digite para pesquisar...')}
          autoComplete="off"
          spellCheck={false}
          disabled={field.disabled}
          tabIndex={field.tabIndex}
          value={searchText || (effectiveValue ? selectedLabel : '')}
          style={{ paddingRight: effectiveValue ? '2rem' : undefined }}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onKeyDown={handleSearchKeyDown}
        />
        {effectiveValue && !field.disabled && (
          <button
            type="button"
            onClick={clearSelection}
            title="Limpar seleção"
            style={{
              position: 'absolute', right: '0.5rem', top: '50%',
              transform: 'translateY(-50%)', background: 'none',
              border: 'none', color: '#999', fontSize: '1rem',
              lineHeight: 1, padding: 0, cursor: 'pointer'
            }}
          >
            ✕
          </button>
        )}
        {isOpen && !field.disabled && (
          <div style={{
            position: 'absolute', zIndex: 1050, width: '100%',
            background: '#fff', border: '1px solid #ced4da', borderTop: 'none',
            borderRadius: '0 0 0.375rem 0.375rem',
            boxShadow: '0 4px 12px rgba(0,0,0,.12)'
          }}>
            <select
              size={rows}
              className="form-select border-0 rounded-0"
              style={{ overflowY: 'auto', cursor: 'pointer', width: '100%' }}
              onChange={e => {
                const val = e.target.value
                const found = allData.find(item => getValue(item, field) === val)
                if (found) selectItem(found)
              }}
            >
              {visible.map((item, idx) => {
                const val = getValue(item, field)
                const lbl = getLabel(item, field)
                return (
                  <option
                    key={idx}
                    value={val}
                    style={val === effectiveValue ? { background: '#dbeafe', fontWeight: 600 } : undefined}
                  >
                    {val === effectiveValue ? `✓ ${lbl}` : lbl}
                  </option>
                )
              })}
            </select>
            <div className="px-2 py-1 border-top text-muted" style={{ fontSize: '0.68rem', fontStyle: 'italic' }}>
              {filtered.length > maxVisible
                ? `Exibindo ${maxVisible} de ${filtered.length} registros`
                : `${filtered.length} registro${filtered.length !== 1 ? 's' : ''}`}
            </div>
          </div>
        )}
      </div>
      {field.name && <input type="hidden" name={field.name} value={effectiveValue} />}
      <div className="text-danger small mt-1" style={{ minHeight: '1.25rem' }}>{erro}</div>
    </>
  )
}

export default SelectField
