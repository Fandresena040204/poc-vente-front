import { Main } from '@/components/layout/main'
import { products } from '@/features/tables/data'
import { ProductForm } from './product-form'

export function EditProductPage() {
  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Edit Product</h2>
          <p className='text-muted-foreground'>
            Update details for {products[0].name}.
          </p>
        </div>
        <ProductForm mode='edit' initialProduct={products[0]} />
      </Main>
    </>
  )
}
