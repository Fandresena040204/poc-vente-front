import { createFileRoute } from '@tanstack/react-router'
import { IconsPage } from '@/features/icons'

export const Route = createFileRoute('/_authenticated/icons')({
  component: IconsPage,
})
