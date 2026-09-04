import { createFileRoute } from '@tanstack/react-router'
import { ProductDetailsPage } from '@/features/ecommerce/details'

export const Route = createFileRoute('/_authenticated/ecommerce/details')({
  component: ProductDetailsPage,
})
