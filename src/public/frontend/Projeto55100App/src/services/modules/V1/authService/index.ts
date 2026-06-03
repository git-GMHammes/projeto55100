import { APP_BASE_HOST, APP_VERSION } from '../../../../config/constants'

// ─── Base URL ─────────────────────────────────────────────────────────────────

const BASE = `${APP_BASE_HOST}/api/${APP_VERSION.toLowerCase()}/auth`

// ─── Envelope padrão da API ───────────────────────────────────────────────────

export interface ApiEnvelope<T = unknown> {
  method: string
  endpoint: string
  statusCode: number
  message: string
  success: boolean
  data?: T
}

// ─── Tipos da sessão de login ─────────────────────────────────────────────────

export interface SessionUser {
  id: string
  um_uuid: string
  um_user: string
  um_is_active: string
  um_last_login: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  uc_id: string
  uc_user_id: string
  uc_name: string
  uc_cpf: string
  uc_whatsapp: string
  uc_profile: string
  uc_mail: string
  uc_phone: string
  uc_date_birth: string
  uc_zip_code: string
  uc_address: string
  uc_tenant_at: string
  uc_validity: string
  uc_created_at: string
  uc_updated_at: string
  uc_deleted_at: string | null
  uc_user_id_active: string
  ut_id: string
  ut_user_saas_tenants_id: string
  ut_role: string
  ut_created_at: string
  ut_deleted_at: string | null
}

export interface LoginData {
  token: string
  token_type: string
  expires_in: number
  user: SessionUser
}

export interface LoginPayload {
  um_user: string
  um_password: string
  ut_user_saas_tenants_id: string
}

// ─── Tipos para consultas da view_auth_user ───────────────────────────────────

export interface AuthUser {
  id: number
  um_user: string
  um_is_active: number
  uc_name: string
  uc_cpf: string | null
  uc_mail: string
  uc_whatsapp: string | null
  uc_phone: string | null
  uc_address: string | null
  uc_profile: string | null
  uc_zip_code: string | null
  ut_tenant_id: number
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthUserGroup {
  letter: string
  items: AuthUser[]
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface FindParams {
  search?: string
  page?: number
  per_page?: number
  order_by?: string
  order_dir?: 'asc' | 'desc'
  [key: string]: unknown
}

export interface RecoverPasswordPayload {
  uc_mail: string
}

export interface ResetTokenInfo {
  id: number
  user_management_id: number
  expires_at: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
  password_confirm: string
}

// ─── Helper para requisições autenticadas ────────────────────────────────────

async function http<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('auth_token')
  const tokenType = sessionStorage.getItem('auth_token_type') ?? 'Bearer'

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `${tokenType} ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error?.message ?? `HTTP ${response.status}`)
  }

  return response.json() as Promise<T>
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * POST /login
 * Retorna o envelope completo (success ou error) sem lançar exceção em 4xx,
 * para que a página possa exibir o JSON bruto no modal DEBUG.
 */
export async function login(payload: LoginPayload): Promise<ApiEnvelope<LoginData>> {
  const response = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return response.json() as Promise<ApiEnvelope<LoginData>>
}

/**
 * POST /logout
 */
export async function logout(): Promise<ApiResponse<null>> {
  return http(`${BASE}/logout`, { method: 'POST' })
}

// ─── Reset de senha ───────────────────────────────────────────────────────────

/**
 * POST /recover-password
 * Passo 1: verifica e-mail, gera token e envia e-mail.
 * Body: { uc_mail }
 */
export async function recoverPassword(
  payload: RecoverPasswordPayload,
): Promise<ApiResponse<null>> {
  return http(`${BASE}/recover-password`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * GET /reset-password/:token
 * Passo 2: valida o token antes de exibir o formulário de nova senha.
 */
export async function validateResetToken(token: string): Promise<ApiResponse<ResetTokenInfo>> {
  return http(`${BASE}/reset-password/${token}`)
}

/**
 * POST /reset-password
 * Passo 3: aplica a nova senha e invalida o token.
 */
export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ApiResponse<null>> {
  return http(`${BASE}/reset-password`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ─── Consultas da view_auth_user ──────────────────────────────────────────────

/**
 * POST /find
 * Busca paginada com filtros.
 */
export async function find(params: FindParams): Promise<PaginatedResponse<AuthUser>> {
  return http(`${BASE}/find`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

/**
 * POST /get-grouped
 * Retorna usuários agrupados (ex: por letra inicial do nome).
 */
export async function getGrouped(
  params?: Record<string, unknown>,
): Promise<AuthUserGroup[]> {
  return http(`${BASE}/get-grouped`, {
    method: 'POST',
    body: JSON.stringify(params ?? {}),
  })
}

/**
 * GET /search?q=...
 * Busca rápida pelo termo informado nos campos de texto da view.
 */
export async function search(q: string): Promise<AuthUser[]> {
  const url = new URL(`${BASE}/search`)
  url.searchParams.set('q', q)
  return http(url.toString())
}

/**
 * GET /get/:id
 * Retorna um registro da view pelo ID.
 */
export async function getById(id: number): Promise<AuthUser> {
  return http(`${BASE}/get/${id}`)
}

/**
 * GET /get-all
 * Retorna todos os registros ativos (sem paginação).
 */
export async function getAll(): Promise<AuthUser[]> {
  return http(`${BASE}/get-all`)
}

/**
 * GET /get-no-pagination
 * Retorna todos os registros ativos sem paginação.
 */
export async function getNoPagination(): Promise<AuthUser[]> {
  return http(`${BASE}/get-no-pagination`)
}

/**
 * GET /get-deleted/:id
 * Retorna um registro soft-deletado pelo ID.
 */
export async function getDeleted(id: number): Promise<AuthUser> {
  return http(`${BASE}/get-deleted/${id}`)
}

/**
 * GET /get-deleted-all
 * Retorna todos os registros soft-deletados.
 */
export async function getDeletedAll(): Promise<AuthUser[]> {
  return http(`${BASE}/get-deleted-all`)
}
