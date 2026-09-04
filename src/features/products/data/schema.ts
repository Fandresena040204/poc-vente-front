import { z } from 'zod'

const _productSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  default_price: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})
export type Product = z.infer<typeof _productSchema>

export const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  sku: z.string().min(1, 'SKU is required.'),
  default_price: z
    .string()
    .min(1, 'Default price is required.')
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount (e.g. 19.99).'),
})
export type ProductForm = z.infer<typeof productFormSchema>
