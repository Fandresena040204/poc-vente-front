import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasRole } from '@/stores/auth-store'
import { RolesSaisie } from '@/features/roles/saisie'

export const Route = createFileRoute('/_authenticated/roles/saisie/')({
  beforeLoad: () => {
    if (!hasRole('admin')) {
      throw redirect({ to: '/errors/$error', params: { error: 'forbidden' } })
    }
  },
  component: RolesSaisie,
})
