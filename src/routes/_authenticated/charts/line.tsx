import { createFileRoute } from '@tanstack/react-router'
import { LineChartPage } from '@/features/charts/line-chart'

export const Route = createFileRoute('/_authenticated/charts/line')({
  component: LineChartPage,
})
