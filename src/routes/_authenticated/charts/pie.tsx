import { createFileRoute } from '@tanstack/react-router'
import { PieChartPage } from '@/features/charts/pie-chart'

export const Route = createFileRoute('/_authenticated/charts/pie')({
  component: PieChartPage,
})
