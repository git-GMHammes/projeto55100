import React, { useState } from 'react'

// ─── Interface ────────────────────────────────────────────────────────────────

export interface HoraFieldSchema {
  type: 'hora'
  col: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  label?: string
  /** Exibe e aceita segundos (HH:MM:SS). Padrão: false (HH:MM) */
  comSegundos?: boolean
  id?: string
  name?: string
  placeholder?: string
  /**
   * Valor inicial no formato "HH:MM" ou "HH:MM:SS" (não-controlado).
   */
  defaultValue?: string
  /** Valor controlado. Ex: "14:30" ou "14:30:00" */
  value?: string
  readOnly?: boolean
  disabled?: boolean
  required?: boolean
  size?: number
  autoComplete?: string
  autoFocus?: boolean
  tabIndex?: number
  className?: string
  style?: React.CSSProperties
  title?: string
  hidden?: boolean
  /**
   * Disparado a cada digitação.
   * `e.target.value` contém "HH:MM" ou "HH:MM:SS" quando completo,
   * ou dígitos parciais enquanto o preenchimento está em andamento.
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function soDigitos(v: string, max: number): string {
  return v.replace(/\D/g, '').slice(0, max)
}

/** "HH:MM" ou "HH:MM:SS" → dígitos puros "HHMM" ou "HHMMSS" */
function horaParaDigitos(hora: string): string {
  return hora.replace(/\D/g, '').slice(0, 6)
}

export function aplicarMascara(raw: string, comSegundos: boolean): string {
  const max = comSegundos ? 6 : 4
  const d = raw.slice(0, max)
  const len = d.length
  if (len <= 2) return d
  if (!comSegundos) return `${d.slice(0, 2)}:${d.slice(2)}`
  if (len <= 4) return `${d.slice(0, 2)}:${d.slice(2)}`
  return `${d.slice(0, 2)}:${d.slice(2, 4)}:${d.slice(4)}`
}

function digitosParaHora(raw: string, comSegundos: boolean): string {
  if (!comSegundos && raw.length === 4)
    return `${raw.slice(0, 2)}:${raw.slice(2)}`
  if (comSegundos && raw.length === 6)
    return `${raw.slice(0, 2)}:${raw.slice(2, 4)}:${raw.slice(4)}`
  return raw
}

function horaValida(raw: string, comSegundos: boolean): boolean {
  const expected = comSegundos ? 6 : 4
  if (raw.length !== expected) return false
  const hh = parseInt(raw.slice(0, 2))
  const mm = parseInt(raw.slice(2, 4))
  if (hh > 23 || mm > 59) return false
  if (comSegundos) {
    const ss = parseInt(raw.slice(4, 6))
    if (ss > 59) return false
  }
  return true
}

// ─── Componente ───────────────────────────────────────────────────────────────

interface HoraFieldProps { field: HoraFieldSchema }

export function HoraField({ field }: HoraFieldProps) {
  const comSegundos = field.comSegundos ?? false
  const maxDigits = comSegundos ? 6 : 4
  const isControlled = field.value !== undefined && field.onChange !== undefined

  const [internalRaw, setInternalRaw] = useState(() =>
    soDigitos(horaParaDigitos(field.defaultValue ?? ''), maxDigits)
  )
  const [erro, setErro] = useState<string | null>(null)

  const raw = isControlled
    ? soDigitos(horaParaDigitos(field.value ?? ''), maxDigits)
    : internalRaw

  const displayValue = aplicarMascara(raw, comSegundos)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = soDigitos(e.target.value, maxDigits)
    if (!isControlled) setInternalRaw(next)
    setErro(null)

    if (field.onChange) {
      const patched = Object.create(e)
      patched.target = Object.assign(Object.create(e.target), e.target, {
        value: digitosParaHora(next, comSegundos),
      })
      field.onChange(patched as React.ChangeEvent<HTMLInputElement>)
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const nome = field.label ?? field.name ?? field.id ?? 'Hora'
    if (field.required && !raw) { setErro(`${nome} é obrigatória`); field.onBlur?.(e); return }
    if (raw && raw.length < maxDigits) { setErro(`${nome} incompleta`); field.onBlur?.(e); return }
    if (raw.length === maxDigits && !horaValida(raw, comSegundos)) {
      setErro(`${nome} inválida`)
      field.onBlur?.(e)
      return
    }
    setErro(null)
    field.onBlur?.(e)
  }

  const { type: _, col: _c, label, hidden, id, name, className, comSegundos: _cs,
    value: _v, defaultValue: _dv, onChange: _oc, onBlur: _ob, ...restProps } = field

  const inputClass = ['form-control', erro ? 'is-invalid' : '', className ?? '']
    .filter(Boolean).join(' ')

  const placeholder = restProps.placeholder ?? (comSegundos ? 'HH:MM:SS' : 'HH:MM')

  return (
    <>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}{field.required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <input
        type="text"
        id={id}
        className={inputClass}
        {...restProps}
        placeholder={placeholder}
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {name && (
        <input type="hidden" name={name}
          value={raw.length === maxDigits ? digitosParaHora(raw, comSegundos) : ''} />
      )}
      <div className="text-danger small mt-1" style={{ minHeight: '1.25rem' }}>{erro}</div>
    </>
  )
}

export default HoraField
