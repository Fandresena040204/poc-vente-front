import { createFileRoute } from '@tanstack/react-router'
import { IntegrationsPage } from '@/features/pages/integrations'

export const Route = createFileRoute('/_authenticated/pages/integrations')({
  component: IntegrationsPage,
})
