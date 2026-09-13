import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useRoles } from '@/features/roles/hooks'
import { Main } from '@/components/layout/main'
import { UsersRolesDialog } from './components/users-roles-dialog'
import { UsersTable } from './components/users-table'
import { type User } from './data/schema'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const {
    data: roles,
    isLoading: isLoadingRoles,
    isError: isRolesError,
  } = useRoles()
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  function closeRolesDialog(open: boolean) {
    if (!open) {
      setTimeout(() => setCurrentRow(null), 500)
    }
  }

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
          <p className='text-muted-foreground'>
            View users and manage their roles. Creating a user happens via sign
            up, not from here.
          </p>
        </div>
        {isLoadingRoles ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='animate-spin' />
          </div>
        ) : isRolesError ? (
          <p className='text-destructive'>Failed to load roles.</p>
        ) : (
          <UsersTable
            roles={roles ?? []}
            search={search}
            navigate={navigate}
            onManageRoles={setCurrentRow}
          />
        )}
      </Main>

      {currentRow && (
        <UsersRolesDialog
          key={`user-roles-${currentRow.id}`}
          open
          onOpenChange={closeRolesDialog}
          currentRow={currentRow}
        />
      )}
    </>
  )
}
