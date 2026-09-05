import { getRouteApi } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { useRoles } from '@/features/roles/hooks'
import { UsersDialogs } from './components/users-dialogs'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { useUsers } from './hooks'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { data: users, isLoading, isError } = useUsers()
  const { data: roles, isLoading: isLoadingRoles } = useRoles()

  const loading = isLoading || isLoadingRoles

  return (
    <UsersProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
          <p className='text-muted-foreground'>
            View users and manage their roles. Creating a user happens via sign
            up, not from here.
          </p>
        </div>
        {loading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='animate-spin' />
          </div>
        ) : isError ? (
          <p className='text-destructive'>Failed to load users.</p>
        ) : (
          <UsersTable
            data={users ?? []}
            roles={roles ?? []}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
