import { z } from 'zod'

const _roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.array(z.string()),
})
export type Role = z.infer<typeof _roleSchema>

export const roleFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  permissions: z.array(z.string()),
})
export type RoleForm = z.infer<typeof roleFormSchema>
