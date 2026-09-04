import { createFileRoute } from '@tanstack/react-router'
import { BarChartPage } from '@/features/charts/bar-chart'

export const Route = createFileRoute('/_authenticated/charts/bar')({
  component: BarChartPage,
})
