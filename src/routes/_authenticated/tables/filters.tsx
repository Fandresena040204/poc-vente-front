import { createFileRoute } from '@tanstack/react-router'
import { AdvancedFiltersPage } from '@/features/tables/advanced-filters'

export const Route = createFileRoute('/_authenticated/tables/filters')({
  component: AdvancedFiltersPage,
})
