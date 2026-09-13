import { useEffect, useMemo, useState } from 'react'
import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { buildOrdering, getColumnFilterValue } from '@/lib/crud/column-filters'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { ResourceDataTable } from '@/components/crud/resource-data-table'
import { useProductsPage } from '../hooks'
import { type Product } from '../data/schema'
import { createProductsColumns } from './products-columns'

type ProductsTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDelete: (row: Product) => void
}

export function ProductsTable({
  search,
  navigate,
  onDelete,
}: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const columns = useMemo(() => createProductsColumns(onDelete), [onDelete])

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
      { columnId: 'name', searchKey: 'name', type: 'string' },
      {
        columnId: 'created_at',
        type: 'range',
        minSearchKey: 'created_from',
        maxSearchKey: 'created_to',
      },
    ],
  })

  // `columnFilters` reflète la saisie en cours dans les popups (mise à jour
  // à chaque frappe/sélection) ; `appliedFilters` ne change qu'au clic sur
  // "Search" — seul `appliedFilters` alimente la requête backend, pour ne
  // pas interroger le serveur à chaque caractère tapé.
  const [appliedFilters, setAppliedFilters] =
    useState<ColumnFiltersState>(columnFilters)

  const name = getColumnFilterValue<string>(appliedFilters, 'name')
  const createdAt = getColumnFilterValue<{ min?: string; max?: string }>(
    appliedFilters,
    'created_at'
  )

  const { data, isLoading, isError } = useProductsPage({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ordering: buildOrdering(sorting),
    search: name || undefined,
    filters: {
      created_at_min: createdAt?.min,
      created_at_max: createdAt?.max,
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
    return <p className='text-destructive'>Failed to load products.</p>
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
        searchKey: 'name',
        searchTitle: 'Name',
        searchPlaceholder: 'Filter by name...',
        rangeFilters: [
          { columnId: 'created_at', title: 'Created', type: 'date' },
        ],
        onSearch: () => setAppliedFilters(columnFilters),
      }}
    />
  )
}
