import { APP_BASE_HOST, APP_VERSION } from '../../../config/constants'
import { getAuthHeader } from './authService/session'
import type { ApiEnvelope } from './authService'

const v = APP_VERSION.toLowerCase()
const BASE_TABLE = `${APP_BASE_HOST}/api/${v}/municipio-ibge-tse`

// ─── Tipo da tabela municipio_ibge_tse ───────────────────────────────────────
// PK: cd_ibge (char(7), não auto-incremento)
// Sem soft delete, sem timestamps

export interface MunicipioIbgeTseTable {
  cd_ibge: string
  cd_tse: string | null
  nm_cidade: string | null
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

// ─── API — leitura ───────────────────────────────────────────────────────────

export async function getAll(
  page = 1,
  limit = 200,
): Promise<ApiPageEnvelope<MunicipioIbgeTseTable[]>> {
  const url = `${BASE_TABLE}/get-all?page=${page}&limit=${limit}&sort=nm_cidade&order=asc`
  return httpGet(url)
}

export async function search(
  q: string,
  limit = 200,
): Promise<ApiPageEnvelope<MunicipioIbgeTseTable[]>> {
  const url = `${BASE_TABLE}/search?q=${encodeURIComponent(q)}&limit=${limit}&sort=nm_cidade&order=asc`
  return httpGet(url)
}

export async function getById(
  cdIbge: string,
): Promise<ApiEnvelope<MunicipioIbgeTseTable>> {
  return httpGet(`${BASE_TABLE}/get/${cdIbge}`)
}

// ─── API — escrita ───────────────────────────────────────────────────────────

export async function createTable(
  payload: Record<string, unknown>,
): Promise<ApiEnvelope<MunicipioIbgeTseTable>> {
  return httpPost(`${BASE_TABLE}/create`, payload)
}

export async function updateTable(
  cdIbge: string,
  payload: Record<string, unknown>,
): Promise<ApiEnvelope<MunicipioIbgeTseTable>> {
  return httpPut(`${BASE_TABLE}/update/${cdIbge}`, payload)
}

// ─── API — exclusão (sem soft delete, usar hard delete) ──────────────────────

export async function deleteHardTable(
  cdIbge: string,
): Promise<ApiEnvelope<null>> {
  return httpDelete(`${BASE_TABLE}/delete-hard/${cdIbge}`)
}
