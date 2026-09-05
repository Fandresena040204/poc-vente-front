import { RolesCreateDialog } from './roles-create-dialog'
import { RolesDeleteDialog } from './roles-delete-dialog'
import { useRolesContext } from './roles-provider'

export function RolesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRolesContext()
  return (
    <>
      <RolesCreateDialog
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <RolesDeleteDialog
          key={`role-delete-${currentRow.id}`}
          open={open === 'delete'}
          onOpenChange={() => {
            setOpen('delete')
            setTimeout(() => setCurrentRow(null), 500)
          }}
          currentRow={currentRow}
        />
      )}
    </>
  )
}
