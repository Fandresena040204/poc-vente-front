import { createFileRoute } from '@tanstack/react-router'
import { MusicDashboard } from '@/features/dashboards/music'

export const Route = createFileRoute('/_authenticated/dashboards/music')({
  component: MusicDashboard,
})
