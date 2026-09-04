import { createFileRoute } from '@tanstack/react-router'
import { RadialChartPage } from '@/features/charts/radial-chart'

export const Route = createFileRoute('/_authenticated/charts/radial')({
  component: RadialChartPage,
})
