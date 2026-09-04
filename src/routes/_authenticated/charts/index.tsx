import { createFileRoute } from '@tanstack/react-router'
import { AreaChartPage } from '@/features/charts/area-chart'

export const Route = createFileRoute('/_authenticated/charts/')({
  component: AreaChartPage,
})
