import { createFileRoute } from '@tanstack/react-router'
import { ProductsSaisie } from '@/features/products/saisie'

export const Route = createFileRoute('/_authenticated/products/saisie/')({
  component: ProductsSaisie,
})
