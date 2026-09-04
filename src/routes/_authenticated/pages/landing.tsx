import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '@/features/pages/landing-page'

export const Route = createFileRoute('/_authenticated/pages/landing')({
  component: LandingPage,
})
