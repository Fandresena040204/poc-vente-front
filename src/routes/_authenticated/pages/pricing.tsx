import { createFileRoute } from '@tanstack/react-router'
import { PricingPage } from '@/features/pages/pricing'

export const Route = createFileRoute('/_authenticated/pages/pricing')({
  component: PricingPage,
})
