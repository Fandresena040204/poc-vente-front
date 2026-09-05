import { apiClient } from '@/lib/api-client'
import { type PaginatedResponse } from '@/lib/pagination'
import { type User } from './data/schema'

export async function fetchAllUsers(): Promise<User[]> {
  const results: User[] = []
  let url: string | null = '/api/users/'

  while (url) {
    const { data }: { data: PaginatedResponse<User> } =
      await apiClient.get<PaginatedResponse<User>>(url)
    results.push(...data.results)
    url = data.next
  }

  return results
}

export async function assignRole(id: string, role: string): Promise<User> {
  const { data } = await apiClient.post<User>(`/api/users/${id}/assign_role/`, {
    role,
  })
  return data
}

export async function removeRole(id: string, role: string): Promise<User> {
  const { data } = await apiClient.post<User>(`/api/users/${id}/remove_role/`, {
    role,
  })
  return data
}
