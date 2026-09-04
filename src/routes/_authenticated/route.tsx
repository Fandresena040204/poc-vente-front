import { createFileRoute, redirect } from '@tanstack/react-router'
import { fetchMe } from '@/features/auth/api'
import { useAuthStore } from '@/stores/auth-store'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { accessToken, user, setUser, reset } = useAuthStore.getState().auth

    if (!accessToken) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      })
    }

    if (!user) {
      try {
        setUser(await fetchMe())
      } catch {
        reset()
        throw redirect({
          to: '/sign-in',
          search: { redirect: location.href },
        })
      }
    }
  },
  component: AuthenticatedLayout,
})
