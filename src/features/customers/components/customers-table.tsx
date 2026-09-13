import { useEffect, useMemo, useState } from 'react'
import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { buildOrdering, getColumnFilterValue } from '@/lib/crud/column-filters'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { ResourceDataTable } from '@/components/crud/resource-data-table'
import { useCustomersPage } from '../hooks'
import { type Customer } from '../data/schema'
import { createCustomersColumns } from './customers-columns'

type CustomersTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDelete: (row: Customer) => void
}

export function CustomersTable({
  search,
  navigate,
  onDelete,
}: CustomersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const columns = useMemo(() => createCustomersColumns(onDelete), [onDelete])

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
    ],
  })

  // `columnFilters` reflète la saisie en cours ; `appliedFilters` ne change
  // qu'au clic sur "Search" — seul lui alimente la requête backend.
  const [appliedFilters, setAppliedFilters] =
    useState<ColumnFiltersState>(columnFilters)

  const name = getColumnFilterValue<string>(appliedFilters, 'name')

  const { data, isLoading, isError } = useCustomersPage({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ordering: buildOrdering(sorting),
    search: name || undefined,
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
    return <p className='text-destructive'>Failed to load customers.</p>
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
        onSearch: () => setAppliedFilters(columnFilters),
      }}
    />
  )
}
