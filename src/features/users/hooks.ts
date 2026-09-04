import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { assignRole, fetchAllUsers, removeRole } from './api'

const USERS_QUERY_KEY = ['users']

export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchAllUsers,
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
