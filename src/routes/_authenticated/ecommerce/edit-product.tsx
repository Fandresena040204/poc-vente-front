import { createFileRoute } from '@tanstack/react-router'
import { EditProductPage } from '@/features/ecommerce/edit-product'

export const Route = createFileRoute('/_authenticated/ecommerce/edit-product')({
  component: EditProductPage,
})
