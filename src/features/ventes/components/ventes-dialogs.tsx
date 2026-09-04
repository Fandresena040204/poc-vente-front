import { VentesActionDialog } from './ventes-action-dialog'
import { VentesDeleteDialog } from './ventes-delete-dialog'
import { useVentesContext } from './ventes-provider'

export function VentesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useVentesContext()
  return (
    <>
      <VentesActionDialog
        key='vente-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <VentesActionDialog
            key={`vente-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />

          <VentesDeleteDialog
            key={`vente-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
