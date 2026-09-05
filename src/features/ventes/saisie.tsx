import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { VentesForm } from './components/ventes-form'
import { useVentes } from './hooks'

type VentesSaisieProps = {
  venteId?: string
}

export function VentesSaisie({ venteId }: VentesSaisieProps) {
  const navigate = useNavigate()
  const isEdit = !!venteId
  const { data, isLoading } = useVentes()
  const currentRow = isEdit
    ? data?.find((vente) => vente.id === venteId)
    : undefined

  function goToList() {
    navigate({ to: '/ventes' })
  }

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {isEdit ? 'Edit Vente' : 'Add New Vente'}
          </h2>
          <p className='text-muted-foreground'>
            {isEdit
              ? 'Update the vente information below.'
              : 'Create a new vente here.'}
          </p>
        </div>

        {isEdit && isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='animate-spin' />
          </div>
        ) : isEdit && !currentRow ? (
          <p className='text-destructive'>Vente not found.</p>
        ) : (
          <VentesForm
            currentRow={currentRow}
            onSuccess={goToList}
            onCancel={goToList}
          />
        )}
      </Main>
    </>
  )
}
