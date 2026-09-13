import { useEffect, useMemo, useState } from 'react'
import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { type Customer } from '@/features/customers/data/schema'
import { buildOrdering, getColumnFilterValue } from '@/lib/crud/column-filters'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { ResourceDataTable } from '@/components/crud/resource-data-table'
import { useVentesPage } from '../hooks'
import { type Vente } from '../data/schema'
import { createVentesColumns } from './ventes-columns'

type VentesTableProps = {
  customers: Customer[]
  search: Record<string, unknown>
  navigate: NavigateFn
  onDelete: (row: Vente) => void
}

export function VentesTable({
  customers,
  search,
  navigate,
  onDelete,
}: VentesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const customerNameById = useMemo(
    () => Object.fromEntries(customers.map((c) => [c.id, c.name])),
    [customers]
  )
  const columns = useMemo(
    () => createVentesColumns(customerNameById, onDelete),
    [customerNameById, onDelete]
  )

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'status', searchKey: 'status', type: 'array' },
    ],
  })

  // `columnFilters` reflète la sélection en cours dans le popup ;
  // `appliedFilters` ne change qu'au clic sur "Search" — seul lui alimente
  // la requête backend.
  const [appliedFilters, setAppliedFilters] =
    useState<ColumnFiltersState>(columnFilters)

  const status = getColumnFilterValue<string[]>(appliedFilters, 'status')

  const { data, isLoading, isError } = useVentesPage({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ordering: buildOrdering(sorting),
    filters: {
      status: status && status.length > 0 ? status.join(',') : undefined,
    },
  })

  const pageCount = data
    ? Math.max(1, Math.ceil(data.count / pagination.pageSize))
    : 1

  useEffect(() => {
    ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange])

  if (isLoading) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <Loader2 className='animate-spin' />
      </div>
    )
  }

  if (isError) {
    return <p className='text-destructive'>Failed to load ventes.</p>
  }

  return (
    <ResourceDataTable
      data={data?.results ?? []}
      columns={columns}
      pageCount={pageCount}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      columnFilters={columnFilters}
      onColumnFiltersChange={onColumnFiltersChange}
      sorting={sorting}
      onSortingChange={setSorting}
      toolbar={{
        filters: [
          {
            columnId: 'status',
            title: 'Status',
            options: [
              { label: 'Draft', value: 'draft' },
              { label: 'Validated', value: 'validated' },
              { label: 'Cancelled', value: 'cancelled' },
            ],
          },
        ],
        onSearch: () => setAppliedFilters(columnFilters),
      }}
    />
  )
}
