import { VentesDeleteDialog } from './ventes-delete-dialog'
import { useVentesContext } from './ventes-provider'

export function VentesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useVentesContext()
  return (
    <>
      {currentRow && (
        <VentesDeleteDialog
          key={`vente-delete-${currentRow.id}`}
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
