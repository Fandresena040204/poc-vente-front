import { apiClient } from '@/lib/api-client'
import { type PaginatedResponse } from '@/lib/pagination'
import { type Role, type RoleForm } from './data/schema'

export async function fetchAllRoles(): Promise<Role[]> {
  const results: Role[] = []
  let url: string | null = '/api/roles/'

  while (url) {
    const { data }: { data: PaginatedResponse<Role> } =
      await apiClient.get<PaginatedResponse<Role>>(url)
    results.push(...data.results)
    url = data.next
  }

  return results
}

export async function createRole(payload: RoleForm): Promise<Role> {
  const { data } = await apiClient.post<Role>('/api/roles/', payload)
  return data
}

export async function updateRole(id: string, payload: RoleForm): Promise<Role> {
  const { data } = await apiClient.patch<Role>(`/api/roles/${id}/`, payload)
  return data
}

export async function deleteRole(id: string): Promise<void> {
  await apiClient.delete(`/api/roles/${id}/`)
}
