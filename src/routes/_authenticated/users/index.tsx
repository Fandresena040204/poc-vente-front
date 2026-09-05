import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { hasRole } from '@/stores/auth-store'
import { Users } from '@/features/users'

const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  username: z.string().optional().catch(''),
  roles: z.array(z.string()).optional().catch([]),
})

export const Route = createFileRoute('/_authenticated/users/')({
  beforeLoad: () => {
    if (!hasRole('admin')) {
      throw redirect({ to: '/errors/$error', params: { error: 'forbidden' } })
    }
  },
  validateSearch: usersSearchSchema,
  component: Users,
})
