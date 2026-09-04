import { createFileRoute } from '@tanstack/react-router'
import { BasicTablesPage } from '@/features/tables/basic-tables'

export const Route = createFileRoute('/_authenticated/tables/basic')({
  component: BasicTablesPage,
})
