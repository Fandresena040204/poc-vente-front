import { createFileRoute } from '@tanstack/react-router'
import { VentesSaisie } from '@/features/ventes/saisie'

export const Route = createFileRoute('/_authenticated/ventes/saisie/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <VentesSaisie venteId={id} />
}
