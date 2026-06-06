import { APP_BASE_HOST, APP_VERSION } from '../../../config/constants'
import type { ApiEnvelope } from './authService'

const BASE_MANAGEMENT = `${APP_BASE_HOST}/api/${APP_VERSION.toLowerCase()}/user-management`
const BASE_CUSTOMER = `${APP_BASE_HOST}/api/${APP_VERSION.toLowerCase()}/user-customer`

export interface CreateUserManagementPayload {
  user: string
  password: string
}

export interface CreateUserCustomerPayload {
  user_management_id: string
  name: string
  mail: string
  cpf: string
  whatsapp: string
  phone?: string
  date_birth?: string
  zip_code?: string
  address?: string
}

async function postPublic<T>(url: string, body: unknown): Promise<ApiEnvelope<T>> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return response.json() as Promise<ApiEnvelope<T>>
}

export async function createUserManagement(
  payload: CreateUserManagementPayload,
): Promise<ApiEnvelope<{ id: string }>> {
  return postPublic(`${BASE_MANAGEMENT}/create`, payload)
}

export async function createUserCustomer(
  payload: CreateUserCustomerPayload,
): Promise<ApiEnvelope<{ id: string }>> {
  return postPublic(`${BASE_CUSTOMER}/create`, payload)
}
