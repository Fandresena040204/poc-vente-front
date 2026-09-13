import { getRouteApi } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { ResourceDeleteDialog } from '@/components/crud/resource-delete-dialog'
import { useDeleteDialogState } from '@/hooks/use-delete-dialog-state'
import { ProductsPrimaryButtons } from './components/products-primary-buttons'
import { ProductsTable } from './components/products-table'
import { type Product } from './data/schema'
import { useDeleteProduct } from './hooks'

const route = getRouteApi('/_authenticated/products/')

export function Products() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const deleteProduct = useDeleteProduct()
  const { open, currentRow, requestDelete, onOpenChange } =
    useDeleteDialogState<Product>()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Products</h2>
            <p className='text-muted-foreground'>Manage your products here.</p>
          </div>
          <ProductsPrimaryButtons />
        </div>
        <ProductsTable
          search={search}
          navigate={navigate}
          onDelete={requestDelete}
        />
      </Main>

      {currentRow && (
        <ResourceDeleteDialog
          open={open}
          onOpenChange={onOpenChange}
          resourceLabel='Product'
          itemLabel={currentRow.name}
          confirmValue={currentRow.sku}
          confirmFieldLabel='SKU'
          onDelete={() => deleteProduct.mutateAsync(currentRow.id)}
          isPending={deleteProduct.isPending}
        />
      )}
    </>
  )
}
