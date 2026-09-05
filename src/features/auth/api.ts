import type { AuthUser } from '@/stores/auth-store'
import { apiClient } from '@/lib/api-client'

export interface LoginPayload {
  username: string
  password: string
}

export interface TokenResponse {
  access: string
  refresh: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  user: { id: string; username: string; email: string }
  access: string
  refresh: string
}

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>('/api/token/', payload)
  return data
}

export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    '/api/auth/register/',
    payload
  )
  return data
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>('/api/auth/me/')
  return data
}

export interface UpdateMePayload {
  first_name?: string
  last_name?: string
  email?: string
}

export async function updateMe(payload: UpdateMePayload): Promise<AuthUser> {
  const { data } = await apiClient.patch<AuthUser>('/api/auth/me/', payload)
  return data
}
