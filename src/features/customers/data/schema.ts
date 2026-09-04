import { z } from 'zod'

const _customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})
export type Customer = z.infer<typeof _customerSchema>

export const customerFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.email({ error: () => undefined }).or(z.literal('')),
  phone: z.string(),
})
export type CustomerForm = z.infer<typeof customerFormSchema>
