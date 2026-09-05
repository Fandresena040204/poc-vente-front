import { apiClient } from '@/lib/api-client'
import { type PaginatedResponse } from '@/lib/pagination'
import { type Product, type ProductForm } from './data/schema'

export async function fetchAllProducts(): Promise<Product[]> {
  const results: Product[] = []
  let url: string | null = '/api/products/'

  while (url) {
    const { data }: { data: PaginatedResponse<Product> } =
      await apiClient.get<PaginatedResponse<Product>>(url)
    results.push(...data.results)
    url = data.next
  }

  return results
}

export async function createProduct(payload: ProductForm): Promise<Product> {
  const { data } = await apiClient.post<Product>('/api/products/', payload)
  return data
}

export async function updateProduct(
  id: string,
  payload: ProductForm
): Promise<Product> {
  const { data } = await apiClient.patch<Product>(
    `/api/products/${id}/`,
    payload
  )
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/api/products/${id}/`)
}
