import { apiClient } from '@/lib/api-client'
import { type PaginatedResponse } from '@/lib/pagination'
import { type Customer, type CustomerForm } from './data/schema'

export async function fetchAllCustomers(): Promise<Customer[]> {
  const results: Customer[] = []
  let url: string | null = '/api/customers/'

  while (url) {
    const { data }: { data: PaginatedResponse<Customer> } =
      await apiClient.get<PaginatedResponse<Customer>>(url)
    results.push(...data.results)
    url = data.next
  }

  return results
}

export async function createCustomer(payload: CustomerForm): Promise<Customer> {
  const { data } = await apiClient.post<Customer>('/api/customers/', payload)
  return data
}

export async function updateCustomer(
  id: string,
  payload: CustomerForm
): Promise<Customer> {
  const { data } = await apiClient.patch<Customer>(
    `/api/customers/${id}/`,
    payload
  )
  return data
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiClient.delete(`/api/customers/${id}/`)
}
