import { createFileRoute } from '@tanstack/react-router'
import { UiElementsPage } from '@/features/ui-elements'

export const Route = createFileRoute('/_authenticated/ui-elements')({
  component: UiElementsPage,
})
