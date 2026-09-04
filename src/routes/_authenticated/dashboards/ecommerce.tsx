import { createFileRoute } from '@tanstack/react-router'
import { EcommerceDashboard } from '@/features/dashboards/ecommerce'

export const Route = createFileRoute('/_authenticated/dashboards/ecommerce')({
  component: EcommerceDashboard,
})
