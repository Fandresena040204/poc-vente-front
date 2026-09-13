import { createResourceApi } from '@/lib/crud/create-resource-api'
import { type Product, type ProductForm } from './data/schema'

export const productsApi = createResourceApi<Product, ProductForm>(
  '/api/products/'
)
