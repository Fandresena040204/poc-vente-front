import { UsersRolesDialog } from './users-roles-dialog'
import { useUsersContext } from './users-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsersContext()

  if (!currentRow) {
    return null
  }

  return (
    <UsersRolesDialog
      key={`user-roles-${currentRow.id}`}
      open={open === 'roles'}
      onOpenChange={() => {
        setOpen('roles')
        setTimeout(() => setCurrentRow(null), 500)
      }}
      currentRow={currentRow}
    />
  )
}
