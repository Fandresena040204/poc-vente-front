import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { CustomersForm } from './components/customers-form'
import { useCustomers } from './hooks'

type CustomersSaisieProps = {
  customerId?: string
}

export function CustomersSaisie({ customerId }: CustomersSaisieProps) {
  const navigate = useNavigate()
  const isEdit = !!customerId
  const { data, isLoading } = useCustomers()
  const currentRow = isEdit
    ? data?.find((customer) => customer.id === customerId)
    : undefined

  function goToList() {
    navigate({ to: '/customers' })
  }

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {isEdit ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <p className='text-muted-foreground'>
            {isEdit
              ? 'Update the customer information below.'
              : 'Create a new customer here.'}
          </p>
        </div>

        {isEdit && isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='animate-spin' />
          </div>
        ) : isEdit && !currentRow ? (
          <p className='text-destructive'>Customer not found.</p>
        ) : (
          <CustomersForm
            currentRow={currentRow}
            onSuccess={goToList}
            onCancel={goToList}
          />
        )}
      </Main>
    </>
  )
}
