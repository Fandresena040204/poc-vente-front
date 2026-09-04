import { createFileRoute } from '@tanstack/react-router'
import { CheckoutPage } from '@/features/ecommerce/checkout'

export const Route = createFileRoute('/_authenticated/ecommerce/checkout')({
  component: CheckoutPage,
})
