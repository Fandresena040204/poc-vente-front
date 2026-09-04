import { createFileRoute } from '@tanstack/react-router'
import { BlogPage } from '@/features/blog'

export const Route = createFileRoute('/_authenticated/blog')({
  component: BlogPage,
})
