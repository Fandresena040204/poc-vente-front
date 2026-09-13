import { useNavigate } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { RolesForm } from './components/roles-form'

export function RolesSaisie() {
  const navigate = useNavigate()

  function goToList() {
    navigate({ to: '/roles' })
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Add New Role</h2>
        <p className='text-muted-foreground'>
          Create a new role here. You can grant permissions from the matrix
          once it exists.
        </p>
      </div>

      <RolesForm onSuccess={goToList} onCancel={goToList} />
    </Main>
  )
}
