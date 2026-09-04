import { createFileRoute } from '@tanstack/react-router'
import { GeneralDashboard } from '@/features/dashboards/general'

export const Route = createFileRoute('/_authenticated/dashboards/general')({
  component: GeneralDashboard,
})
