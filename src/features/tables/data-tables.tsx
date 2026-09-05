import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { products } from './data'
import { ProductsTable } from './products-table'

export function DataTablesPage() {
  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Data Tables</h2>
          <p className='text-muted-foreground'>
            Sortable, filterable table with pagination, row selection and CSV
            export.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductsTable data={products} />
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
