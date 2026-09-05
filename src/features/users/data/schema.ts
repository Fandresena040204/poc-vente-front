import { z } from 'zod'

const _userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  is_active: z.boolean(),
  is_staff: z.boolean(),
  roles: z.array(z.string()),
})
export type User = z.infer<typeof _userSchema>
