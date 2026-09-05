import { Main } from '@/components/layout/main'
import { ProductForm } from './product-form'

export function AddProductPage() {
  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Add Product</h2>
          <p className='text-muted-foreground'>
            Create a new product in the catalog.
          </p>
        </div>
        <ProductForm mode='create' />
      </Main>
    </>
  )
}
