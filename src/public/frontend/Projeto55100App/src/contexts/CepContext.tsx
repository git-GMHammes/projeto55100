import React, { createContext, useCallback, useContext, useState } from 'react'
import { buscarCep, CepData } from '../services/modules/cepService'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface CepContextValue {
  /** Dados retornados pela última consulta bem-sucedida */
  dados: CepData | null
  /**
   * Estado da validação:
   * - `null`  → nenhuma consulta realizada ainda
   * - `true`  → CEP válido e encontrado
   * - `false` → CEP inválido ou não encontrado
   */
  valido: boolean | null
  /** Indica que uma consulta está em andamento */
  carregando: boolean
  /** Mensagem de erro da última consulta falha */
  erro: string | null
  /** Dispara a consulta para o CEP informado (8 dígitos, sem máscara) */
  consultar: (cep: string) => Promise<void>
  /** Reseta todos os dados — use ao limpar o campo ou trocar de CEP */
  limpar: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CepContext = createContext<CepContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CepProvider({ children }: { children: React.ReactNode }) {
  const [dados, setDados] = useState<CepData | null>(null)
  const [valido, setValido] = useState<boolean | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const consultar = useCallback(async (cep: string) => {
    setCarregando(true)
    setErro(null)
    setValido(null)
    setDados(null)

    try {
      const data = await buscarCep(cep)
      setDados(data)
      setValido(true)
    } catch (e) {
      setValido(false)
      setErro(e instanceof Error ? e.message : 'Erro ao consultar CEP')
    } finally {
      setCarregando(false)
    }
  }, [])

  const limpar = useCallback(() => {
    setDados(null)
    setValido(null)
    setErro(null)
    setCarregando(false)
  }, [])

  return (
    <CepContext.Provider value={{ dados, valido, carregando, erro, consultar, limpar }}>
      {children}
    </CepContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Acessa o estado global do CEP.
 * O componente deve estar dentro de `<CepProvider>`.
 */
export function useCep(): CepContextValue {
  const ctx = useContext(CepContext)
  if (!ctx) throw new Error('useCep deve ser usado dentro de <CepProvider>')
  return ctx
}
