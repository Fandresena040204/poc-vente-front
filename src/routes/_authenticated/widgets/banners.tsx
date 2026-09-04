import { createFileRoute } from '@tanstack/react-router'
import { WidgetBannersPage } from '@/features/widgets/banners'

export const Route = createFileRoute('/_authenticated/widgets/banners')({
  component: WidgetBannersPage,
})
