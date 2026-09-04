import { createFileRoute } from '@tanstack/react-router'
import { ShopPage } from '@/features/ecommerce/shop'

export const Route = createFileRoute('/_authenticated/ecommerce/shop')({
  component: ShopPage,
})
