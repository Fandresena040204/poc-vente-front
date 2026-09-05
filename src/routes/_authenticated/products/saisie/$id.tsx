import { createFileRoute } from '@tanstack/react-router'
import { ProductsSaisie } from '@/features/products/saisie'

export const Route = createFileRoute('/_authenticated/products/saisie/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <ProductsSaisie productId={id} />
}
