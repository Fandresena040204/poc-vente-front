import { createResourceHooks } from '@/lib/crud/create-resource-hooks'
import { rolesApi } from './api'

export const ROLES_QUERY_KEY = ['roles']

export const {
  useList: useRoles,
  useCreate: useCreateRole,
  useUpdate: useUpdateRole,
  useDelete: useDeleteRole,
} = createResourceHooks(ROLES_QUERY_KEY, rolesApi, { entityLabel: 'Role' })
