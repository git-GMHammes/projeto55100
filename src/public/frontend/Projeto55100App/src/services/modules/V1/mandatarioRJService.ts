import { APP_BASE_HOST, APP_VERSION } from '../../../config/constants'
import { getAuthHeader } from './authService/session'
import type { ApiEnvelope } from './authService'

const v = APP_VERSION.toLowerCase()
const BASE_VIEW  = `${APP_BASE_HOST}/api/${v}/mandatario-rj-view`
const BASE_TABLE = `${APP_BASE_HOST}/api/${v}/mandatario-rj`

// ─── Tipos da tabela mandatario_RJ ────────────────────────────────────────────

export interface MandatarioRJTable {
  id: number
  candidato_2022_RJ_id: number | null
  candidato_2024_RJ_id: number | null
  cargo_politico: string | null
  suplente_candidato_RJ_id: number | null
  ocupa_instituicao: string | null
  cargo_instituicao: string | null
  partido_politico: string | null
  nome_politico: string | null
  dt_nascimento: string | null
  municipio_mandato: string | null
  whatsapp: string | null
  youtube: string | null
  facebook: string | null
  instagram: string | null
  email: string | null
  qtd_votos: number | null
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export type MandatarioRJView = MandatarioRJTable

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

async function httpPost<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  })
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

async function httpDelete<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: 'DELETE', headers: buildHeaders() })
  return res.json() as Promise<T>
}

// ─── View — leitura (lista e busca) ──────────────────────────────────────────

export async function getAllView(
  page = 1,
  limit = 200,
): Promise<ApiPageEnvelope<MandatarioRJView[]>> {
  const url = `${BASE_VIEW}/get-all?page=${page}&limit=${limit}&sort=nome_politico&order=asc`
  return httpGet(url)
}

export async function searchView(
  q: string,
  limit = 200,
): Promise<ApiPageEnvelope<MandatarioRJView[]>> {
  const url = `${BASE_VIEW}/search?q=${encodeURIComponent(q)}&limit=${limit}&sort=nome_politico&order=asc`
  return httpGet(url)
}

// ─── Table — leitura e escrita ────────────────────────────────────────────────

export async function getByIdTable(
  id: number,
): Promise<ApiEnvelope<MandatarioRJTable>> {
  return httpGet(`${BASE_TABLE}/get/${id}`)
}

export async function createTable(
  payload: Record<string, unknown>,
): Promise<ApiEnvelope<MandatarioRJTable>> {
  return httpPost(`${BASE_TABLE}/create`, payload)
}

export async function updateTable(
  id: number,
  payload: Record<string, unknown>,
): Promise<ApiEnvelope<MandatarioRJTable>> {
  return httpPut(`${BASE_TABLE}/update/${id}`, payload)
}

export async function deleteSoftTable(
  id: number,
): Promise<ApiEnvelope<null>> {
  return httpDelete(`${BASE_TABLE}/delete-soft/${id}`)
}
