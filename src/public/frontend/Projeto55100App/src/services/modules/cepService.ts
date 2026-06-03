// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Resposta completa da API ViaCEP */
export interface CepData {
  cep: string
  logradouro: string
  complemento: string
  unidade: string
  bairro: string
  localidade: string
  uf: string
  estado: string
  regiao: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Consulta um CEP na API gratuita ViaCEP.
 * @param cep 8 dígitos numéricos, sem máscara (ex: "01001000")
 * @throws Error com mensagem legível se o CEP for inválido ou não encontrado
 */
export async function buscarCep(cep: string): Promise<CepData> {
  const raw = cep.replace(/\D/g, '')

  if (raw.length !== 8)
    throw new Error('CEP deve ter 8 dígitos')

  const response = await fetch(`https://viacep.com.br/ws/${raw}/json/`)

  if (!response.ok)
    throw new Error('Falha ao consultar o serviço de CEP')

  const data = await response.json()

  if (data.erro)
    throw new Error('CEP não encontrado')

  return data as CepData
}
