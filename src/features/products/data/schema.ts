import { z } from 'zod'
import { decimalString, entityBase } from '@/lib/crud/entity-schema'

const _productSchema = z.object({
  ...entityBase,
  name: z.string(),
  sku: z.string(),
  default_price: z.string(),
})
export type Product = z.infer<typeof _productSchema>

export const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  sku: z.string().min(1, 'SKU is required.'),
  default_price: decimalString({ required: 'Default price is required.' }),
})
export type ProductForm = z.infer<typeof productFormSchema>
