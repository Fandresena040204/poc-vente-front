import { createFileRoute } from '@tanstack/react-router'
import { DataTablesPage } from '@/features/tables/data-tables'

export const Route = createFileRoute('/_authenticated/tables/data')({
  component: DataTablesPage,
})
