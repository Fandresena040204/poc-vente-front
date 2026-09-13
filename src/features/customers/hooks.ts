import { createResourceHooks } from '@/lib/crud/create-resource-hooks'
import { customersApi } from './api'

const CUSTOMERS_QUERY_KEY = ['customers']

export const {
  useList: useCustomers,
  useListPage: useCustomersPage,
  useCreate: useCreateCustomer,
  useUpdate: useUpdateCustomer,
  useDelete: useDeleteCustomer,
} = createResourceHooks(CUSTOMERS_QUERY_KEY, customersApi, {
  entityLabel: 'Customer',
})
