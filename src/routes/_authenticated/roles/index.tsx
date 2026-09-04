import { createFileRoute, redirect } from '@tanstack/react-router'
import { Roles } from '@/features/roles'
import { hasRole } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/roles/')({
  beforeLoad: () => {
    if (!hasRole('admin')) {
      throw redirect({ to: '/errors/$error', params: { error: 'forbidden' } })
    }
  },
  component: Roles,
})
