import { createFileRoute } from '@tanstack/react-router'
import { WidgetCardsPage } from '@/features/widgets/cards'

export const Route = createFileRoute('/_authenticated/widgets/cards')({
  component: WidgetCardsPage,
})
