import { z } from 'zod'
import { entityBase } from '@/lib/crud/entity-schema'

const _customerSchema = z.object({
  ...entityBase,
  name: z.string(),
  email: z.string(),
  phone: z.string(),
})
export type Customer = z.infer<typeof _customerSchema>

export const customerFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.email({ error: () => undefined }).or(z.literal('')),
  phone: z.string(),
})
export type CustomerForm = z.infer<typeof customerFormSchema>
