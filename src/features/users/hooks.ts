import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { type ListParams } from '@/lib/crud/create-resource-api'
import { assignRole, fetchAllUsers, fetchUsersPage, removeRole } from './api'

const USERS_QUERY_KEY = ['users']

export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchAllUsers,
  })
}

/** Équivalent de `useListPage` (fondations CRUD) pour Users, qui n'utilise
 * pas `createResourceHooks` (pas de create/update/delete côté API). */
export function useUsersPage(params: ListParams) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, 'page', params],
    queryFn: () => fetchUsersPage(params),
    placeholderData: keepPreviousData,
  })
}

export function useAssignRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      assignRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
  })
}

export function useRemoveRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      removeRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
  })
}
