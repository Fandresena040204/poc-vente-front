import { ProductsDeleteDialog } from './products-delete-dialog'
import { useProductsContext } from './products-provider'

export function ProductsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProductsContext()
  return (
    <>
      {currentRow && (
        <ProductsDeleteDialog
          key={`product-delete-${currentRow.id}`}
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
