import { apiClient } from '@/lib/api-client'
import { type ListParams, fetchAllPages } from '@/lib/crud/create-resource-api'
import { type PaginatedResponse } from '@/lib/pagination'
import { type User } from './data/schema'

export function fetchAllUsers(): Promise<User[]> {
  return fetchAllPages<User>('/api/users/')
}

export async function fetchUsersPage(
  params: ListParams
): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<PaginatedResponse<User>>('/api/users/', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      ordering: params.ordering,
      search: params.search,
      ...params.filters,
    },
  })
  return data
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
