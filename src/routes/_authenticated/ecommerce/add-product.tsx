import { createFileRoute } from '@tanstack/react-router'
import { AddProductPage } from '@/features/ecommerce/add-product'

export const Route = createFileRoute('/_authenticated/ecommerce/add-product')({
  component: AddProductPage,
})
