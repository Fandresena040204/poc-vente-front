import { createFileRoute } from '@tanstack/react-router'
import { VentesSaisie } from '@/features/ventes/saisie'

export const Route = createFileRoute('/_authenticated/ventes/saisie/')({
  component: VentesSaisie,
})
