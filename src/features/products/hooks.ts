import { createResourceHooks } from '@/lib/crud/create-resource-hooks'
import { productsApi } from './api'

const PRODUCTS_QUERY_KEY = ['products']

export const {
  useList: useProducts,
  useListPage: useProductsPage,
  useCreate: useCreateProduct,
  useUpdate: useUpdateProduct,
  useDelete: useDeleteProduct,
} = createResourceHooks(PRODUCTS_QUERY_KEY, productsApi, {
  entityLabel: 'Product',
})
