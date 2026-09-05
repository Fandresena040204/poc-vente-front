import { createFileRoute } from '@tanstack/react-router'
import { CustomersSaisie } from '@/features/customers/saisie'

export const Route = createFileRoute('/_authenticated/customers/saisie/')({
  component: CustomersSaisie,
})
