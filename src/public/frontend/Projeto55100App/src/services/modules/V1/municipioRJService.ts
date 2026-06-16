import { APP_BASE_HOST, APP_VERSION } from '../../../config/constants'
import { getAuthHeader } from './authService/session'
import type { ApiEnvelope } from './authService'

const v = APP_VERSION.toLowerCase()
const BASE_VIEW  = `${APP_BASE_HOST}/api/${v}/municipio-rj-view`
const BASE_TABLE = `${APP_BASE_HOST}/api/${v}/municipio-rj`

// ─── Tipos da View (prefixo mn_ = municipio_RJ, md_ = mandatario_RJ) ──────────

export interface MunicipioRJView {
  id: number
  mn_cd_ibge: string | null
  mn_cd_tse: string | null
  mn_nome_cidade: string | null
  mn_aniversario_cidade: string | null
  mn_prefeito_mandatario_RJ_id: number | null
  mn_vice_prefeito: string | null
  mn_vice_dt_nascimento: string | null
  mn_primeira_dama: string | null
  mn_primeira_dama_dt_nascimento: string | null
  mn_festa_popular: string | null
  mn_dt_festa_popular: string | null
  mn_populacao: number | null
  mn_eleitores: number | null
  mn_densidade_demografica: number | null
  mn_crescimento_populacional: number | null
  mn_populacao_urbana: number | null
  mn_populacao_rural: number | null
  mn_pib_municipal: number | null
  mn_pib_per_capita: number | null
  mn_receita_orcamentaria: number | null
  mn_despesa_orcamentaria: number | null
  mn_arrecadacao_propria: number | null
  mn_empresas_ativas: number | null
  mn_empregos_formais: number | null
  mn_idhm: number | null
  mn_indice_gini: number | null
  mn_percentual_pobres: number | null
  mn_bolsa_familia_benef: number | null
  mn_ideb_anos_iniciais: number | null
  mn_ideb_anos_finais: number | null
  mn_taxa_analfabetismo: number | null
  mn_matriculas_creche: number | null
  mn_distorcao_idade_serie: number | null
  mn_mortalidade_infantil: number | null
  mn_cobertura_saude_familia: number | null
  mn_leitos_por_habitante: number | null
  mn_esperanca_vida: number | null
  mn_acesso_agua_tratada: number | null
  mn_acesso_esgoto: number | null
  mn_coleta_lixo_adequada: number | null
  mn_acesso_internet: number | null
  mn_deficit_habitacional: number | null
  mn_superlotacao: number | null
  mn_favelas_subnormais: number | null
  mn_taxa_homicidios: number | null
  mn_num_roubos_furtos: number | null
  mn_area_vegetacao: number | null
  mn_risco_enchente: number | null
  mn_data_emancipacao: string | null
  mn_area_territorial: number | null
  created_at: string
  updated_at: string | null
  deleted_at: string | null
  md_id: number | null
  md_candidato_2022_RJ_id: number | null
  md_candidato_2024_RJ_id: number | null
  md_cargo_politico: string | null
  md_suplente_candidato_RJ_id: number | null
  md_ocupa_instituicao: string | null
  md_cargo_instituicao: string | null
  md_partido_politico: string | null
  md_nome_politico: string | null
  md_dt_nascimento: string | null
  md_municipio_mandato: string | null
  md_whatsapp: string | null
  md_youtube: string | null
  md_facebook: string | null
  md_instagram: string | null
  md_email: string | null
}

// ─── Tipos da Tabela (campos raw, sem prefixo) ────────────────────────────────

export interface MunicipioRJTable {
  id: number
  cd_ibge: string | null
  cd_tse: string | null
  nome_cidade: string | null
  aniversario_cidade: string | null
  prefeito_mandatario_RJ_id: number | null
  vice_prefeito: string | null
  vice_dt_nascimento: string | null
  primeira_dama: string | null
  primeira_dama_dt_nascimento: string | null
  festa_popular: string | null
  dt_festa_popular: string | null
  populacao: number | null
  eleitores: number | null
  densidade_demografica: number | null
  crescimento_populacional: number | null
  populacao_urbana: number | null
  populacao_rural: number | null
  pib_municipal: number | null
  pib_per_capita: number | null
  receita_orcamentaria: number | null
  despesa_orcamentaria: number | null
  arrecadacao_propria: number | null
  empresas_ativas: number | null
  empregos_formais: number | null
  idhm: number | null
  indice_gini: number | null
  percentual_pobres: number | null
  bolsa_familia_benef: number | null
  ideb_anos_iniciais: number | null
  ideb_anos_finais: number | null
  taxa_analfabetismo: number | null
  matriculas_creche: number | null
  distorcao_idade_serie: number | null
  mortalidade_infantil: number | null
  cobertura_saude_familia: number | null
  leitos_por_habitante: number | null
  esperanca_vida: number | null
  acesso_agua_tratada: number | null
  acesso_esgoto: number | null
  coleta_lixo_adequada: number | null
  acesso_internet: number | null
  deficit_habitacional: number | null
  superlotacao: number | null
  favelas_subnormais: number | null
  taxa_homicidios: number | null
  num_roubos_furtos: number | null
  area_vegetacao: number | null
  risco_enchente: number | null
  data_emancipacao: string | null
  area_territorial: number | null
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

export interface ApiPageEnvelope<T> extends ApiEnvelope<T> {
  pagination?: PaginationInfo
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const auth = getAuthHeader()
  if (auth) headers['Authorization'] = auth
  return headers
}

async function httpGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: buildHeaders() })
  return res.json() as Promise<T>
}

async function httpPut<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  })
  return res.json() as Promise<T>
}

// ─── View — leitura (lista e busca) ──────────────────────────────────────────

export async function getAllView(
  page = 1,
  limit = 200,
): Promise<ApiPageEnvelope<MunicipioRJView[]>> {
  const url = `${BASE_VIEW}/get-all?page=${page}&limit=${limit}&sort=mn_nome_cidade&order=asc`
  return httpGet(url)
}

export async function searchView(
  q: string,
  limit = 200,
): Promise<ApiPageEnvelope<MunicipioRJView[]>> {
  const url = `${BASE_VIEW}/search?q=${encodeURIComponent(q)}&limit=${limit}&sort=mn_nome_cidade&order=asc`
  return httpGet(url)
}

// ─── Table — leitura e escrita ────────────────────────────────────────────────

export async function getByIdTable(
  id: number,
): Promise<ApiEnvelope<MunicipioRJTable>> {
  return httpGet(`${BASE_TABLE}/get/${id}`)
}

export async function updateTable(
  id: number,
  payload: Record<string, unknown>,
): Promise<ApiEnvelope<MunicipioRJTable>> {
  return httpPut(`${BASE_TABLE}/update/${id}`, payload)
}
