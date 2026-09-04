import { createFileRoute } from '@tanstack/react-router'
import { RoleBasedAccessPage } from '@/features/pages/role-based-access'

export const Route = createFileRoute('/_authenticated/pages/roles')({
  component: RoleBasedAccessPage,
})
