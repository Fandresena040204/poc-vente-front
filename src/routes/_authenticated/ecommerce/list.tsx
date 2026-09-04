import { createFileRoute } from '@tanstack/react-router'
import { ProductListPage } from '@/features/ecommerce/list'

export const Route = createFileRoute('/_authenticated/ecommerce/list')({
  component: ProductListPage,
})
