import { getRouteApi } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useCustomers } from '@/features/customers/hooks'
import { Main } from '@/components/layout/main'
import { ResourceDeleteDialog } from '@/components/crud/resource-delete-dialog'
import { useDeleteDialogState } from '@/hooks/use-delete-dialog-state'
import { VentesPrimaryButtons } from './components/ventes-primary-buttons'
import { VentesTable } from './components/ventes-table'
import { type Vente } from './data/schema'
import { useDeleteVente } from './hooks'

const route = getRouteApi('/_authenticated/ventes/')

export function Ventes() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const {
    data: customers,
    isLoading: isLoadingCustomers,
    isError: isCustomersError,
  } = useCustomers()
  const deleteVente = useDeleteVente()
  const { open, currentRow, requestDelete, onOpenChange } =
    useDeleteDialogState<Vente>()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Ventes</h2>
            <p className='text-muted-foreground'>Manage your ventes here.</p>
          </div>
          <VentesPrimaryButtons />
        </div>
        {isLoadingCustomers ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='animate-spin' />
          </div>
        ) : isCustomersError ? (
          <p className='text-destructive'>Failed to load customers.</p>
        ) : (
          <VentesTable
            customers={customers ?? []}
            search={search}
            navigate={navigate}
            onDelete={requestDelete}
          />
        )}
      </Main>

      {currentRow && (
        <ResourceDeleteDialog
          open={open}
          onOpenChange={onOpenChange}
          resourceLabel='Vente'
          itemLabel={currentRow.id}
          confirmValue={currentRow.id}
          confirmFieldLabel='ID'
          onDelete={() => deleteVente.mutateAsync(currentRow.id)}
          isPending={deleteVente.isPending}
        />
      )}
    </>
  )
}
