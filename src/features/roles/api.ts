import { createResourceApi } from '@/lib/crud/create-resource-api'
import { type Role, type RoleForm } from './data/schema'

export const rolesApi = createResourceApi<Role, RoleForm>('/api/roles/')
