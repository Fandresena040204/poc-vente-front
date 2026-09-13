import { z } from 'zod'
import { decimalString, entityBase } from '@/lib/crud/entity-schema'

export const venteStatusSchema = z.union([
  z.literal('draft'),
  z.literal('validated'),
  z.literal('cancelled'),
])
export type VenteStatus = z.infer<typeof venteStatusSchema>

const _venteLigneSchema = z.object({
  id: z.string(),
  product: z.string(),
  quantity: z.string(),
  unit_price: z.string(),
})
export type VenteLigne = z.infer<typeof _venteLigneSchema>

const _venteSchema = z.object({
  ...entityBase,
  customer: z.string(),
  status: venteStatusSchema,
  total: z.string(),
  lines: z.array(_venteLigneSchema),
})
export type Vente = z.infer<typeof _venteSchema>

export const venteLineFormSchema = z.object({
  id: z.string().optional(),
  product: z.string().min(1, 'Product is required.'),
  quantity: decimalString({ required: 'Required.', invalid: 'Invalid quantity.' }),
  unit_price: decimalString({ required: 'Required.', invalid: 'Invalid price.' }),
})
export type VenteLineForm = z.infer<typeof venteLineFormSchema>

export const venteFormSchema = z.object({
  customer: z.string().min(1, 'Customer is required.'),
  lines: z.array(venteLineFormSchema).min(1, 'Add at least one line.'),
})
export type VenteForm = z.infer<typeof venteFormSchema>
