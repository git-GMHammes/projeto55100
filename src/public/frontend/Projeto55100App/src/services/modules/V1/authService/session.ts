import type { SessionUser } from './index'

// ─── Chaves de sessionStorage ─────────────────────────────────────────────────

export const SESSION_KEYS = {
  TOKEN: 'auth_token',
  TOKEN_TYPE: 'auth_token_type',
  EXPIRES_AT: 'auth_expires_at',
  USER: 'auth_user',
} as const

// ─── Gravação ─────────────────────────────────────────────────────────────────

export function saveSession(
  token: string,
  tokenType: string,
  expiresIn: number,
  user: SessionUser,
): void {
  const expiresAt = Date.now() + expiresIn * 1000
  sessionStorage.setItem(SESSION_KEYS.TOKEN, token)
  sessionStorage.setItem(SESSION_KEYS.TOKEN_TYPE, tokenType)
  sessionStorage.setItem(SESSION_KEYS.EXPIRES_AT, String(expiresAt))
  sessionStorage.setItem(SESSION_KEYS.USER, JSON.stringify(user))
}

// ─── Leitura ──────────────────────────────────────────────────────────────────

export function getToken(): string | null {
  return sessionStorage.getItem(SESSION_KEYS.TOKEN)
}

export function getAuthHeader(): string | null {
  const token = sessionStorage.getItem(SESSION_KEYS.TOKEN)
  if (!token) return null
  const type = sessionStorage.getItem(SESSION_KEYS.TOKEN_TYPE) ?? 'Bearer'
  return `${type} ${token}`
}

export function getUser(): SessionUser | null {
  const raw = sessionStorage.getItem(SESSION_KEYS.USER)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  const token = sessionStorage.getItem(SESSION_KEYS.TOKEN)
  const expiresAt = sessionStorage.getItem(SESSION_KEYS.EXPIRES_AT)
  if (!token || !expiresAt) return false
  return Date.now() < Number(expiresAt)
}

// ─── Limpeza ──────────────────────────────────────────────────────────────────

export function clearSession(): void {
  Object.values(SESSION_KEYS).forEach(k => sessionStorage.removeItem(k))
}
