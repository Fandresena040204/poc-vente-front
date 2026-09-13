import { createResourceApi } from '@/lib/crud/create-resource-api'
import { type Customer, type CustomerForm } from './data/schema'

export const customersApi = createResourceApi<Customer, CustomerForm>(
  '/api/customers/'
)
