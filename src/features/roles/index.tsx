import { Loader2 } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { RolesDialogs } from './components/roles-dialogs'
import { RolesPermissionMatrix } from './components/roles-permission-matrix'
import { RolesPrimaryButtons } from './components/roles-primary-buttons'
import { RolesProvider } from './components/roles-provider'
import { useRoles } from './hooks'

export function Roles() {
  const { data: roles, isLoading, isError } = useRoles()

  return (
    <RolesProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Roles</h2>
            <p className='text-muted-foreground'>
              Manage roles and what each one can do across the app.
            </p>
          </div>
          <RolesPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='animate-spin' />
          </div>
        ) : isError ? (
          <p className='text-destructive'>Failed to load roles.</p>
        ) : (
          <RolesPermissionMatrix roles={roles ?? []} />
        )}
      </Main>

      <RolesDialogs />
    </RolesProvider>
  )
}
