import { getRouteApi } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { ResourceDeleteDialog } from '@/components/crud/resource-delete-dialog'
import { useDeleteDialogState } from '@/hooks/use-delete-dialog-state'
import { CustomersPrimaryButtons } from './components/customers-primary-buttons'
import { CustomersTable } from './components/customers-table'
import { type Customer } from './data/schema'
import { useDeleteCustomer } from './hooks'

const route = getRouteApi('/_authenticated/customers/')

export function Customers() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const deleteCustomer = useDeleteCustomer()
  const { open, currentRow, requestDelete, onOpenChange } =
    useDeleteDialogState<Customer>()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Customers</h2>
            <p className='text-muted-foreground'>Manage your customers here.</p>
          </div>
          <CustomersPrimaryButtons />
        </div>
        <CustomersTable
          search={search}
          navigate={navigate}
          onDelete={requestDelete}
        />
      </Main>

      {currentRow && (
        <ResourceDeleteDialog
          open={open}
          onOpenChange={onOpenChange}
          resourceLabel='Customer'
          itemLabel={currentRow.name}
          confirmValue={currentRow.name}
          confirmFieldLabel='Name'
          onDelete={() => deleteCustomer.mutateAsync(currentRow.id)}
          isPending={deleteCustomer.isPending}
        />
      )}
    </>
  )
}
