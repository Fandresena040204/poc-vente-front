import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { products } from './data'
import { FilterBuilder } from './filter-builder'
import { type FilterCondition, filterProducts } from './filters'
import { ProductsTable } from './products-table'

export function AdvancedFiltersPage() {
  const [conditions, setConditions] = useState<FilterCondition[]>([])
  const filteredProducts = filterProducts(products, conditions)

  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Advanced Filters
          </h2>
          <p className='text-muted-foreground'>
            Combine multiple field + operator + value conditions to narrow down
            results, similar to ERPNext's multi-criteria filter.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <FilterBuilder conditions={conditions} onChange={setConditions} />
            <ProductsTable data={filteredProducts} />
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
