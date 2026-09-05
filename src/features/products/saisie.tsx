import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { ProductsForm } from './components/products-form'
import { useProducts } from './hooks'

type ProductsSaisieProps = {
  productId?: string
}

export function ProductsSaisie({ productId }: ProductsSaisieProps) {
  const navigate = useNavigate()
  const isEdit = !!productId
  const { data, isLoading } = useProducts()
  const currentRow = isEdit
    ? data?.find((product) => product.id === productId)
    : undefined

  function goToList() {
    navigate({ to: '/products' })
  }

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className='text-muted-foreground'>
            {isEdit
              ? 'Update the product information below.'
              : 'Create a new product here.'}
          </p>
        </div>

        {isEdit && isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='animate-spin' />
          </div>
        ) : isEdit && !currentRow ? (
          <p className='text-destructive'>Product not found.</p>
        ) : (
          <ProductsForm
            currentRow={currentRow}
            onSuccess={goToList}
            onCancel={goToList}
          />
        )}
      </Main>
    </>
  )
}
