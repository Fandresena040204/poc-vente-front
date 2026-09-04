import { createFileRoute } from '@tanstack/react-router'
import { RadarChartPage } from '@/features/charts/radar-chart'

export const Route = createFileRoute('/_authenticated/charts/radar')({
  component: RadarChartPage,
})
