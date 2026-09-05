import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasRole } from '@/stores/auth-store'
import { Roles } from '@/features/roles'

export const Route = createFileRoute('/_authenticated/roles/')({
  beforeLoad: () => {
    if (!hasRole('admin')) {
      throw redirect({ to: '/errors/$error', params: { error: 'forbidden' } })
    }
  },
  component: Roles,
})
