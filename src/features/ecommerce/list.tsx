import { Card, CardContent } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { products } from '@/features/tables/data'
import { ProductsTable } from '@/features/tables/products-table'

export function ProductListPage() {
  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Product List</h2>
          <p className='text-muted-foreground'>
            Full catalog with search, sort, and export.
          </p>
        </div>
        <Card>
          <CardContent>
            <ProductsTable data={products} />
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
