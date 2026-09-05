import { CustomersDeleteDialog } from './customers-delete-dialog'
import { useCustomersContext } from './customers-provider'

export function CustomersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCustomersContext()
  return (
    <>
      {currentRow && (
        <CustomersDeleteDialog
          key={`customer-delete-${currentRow.id}`}
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
