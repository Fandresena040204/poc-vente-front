import { createFileRoute } from '@tanstack/react-router'
import { CustomersSaisie } from '@/features/customers/saisie'

export const Route = createFileRoute('/_authenticated/customers/saisie/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <CustomersSaisie customerId={id} />
}
