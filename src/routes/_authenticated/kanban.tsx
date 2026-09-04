import { createFileRoute } from '@tanstack/react-router'
import { KanbanPage } from '@/features/kanban'

export const Route = createFileRoute('/_authenticated/kanban')({
  component: KanbanPage,
})
