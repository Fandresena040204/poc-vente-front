import { useEffect, useMemo, useState } from 'react'
import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { type Role } from '@/features/roles/data/schema'
import { buildOrdering, getColumnFilterValue } from '@/lib/crud/column-filters'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { ResourceDataTable } from '@/components/crud/resource-data-table'
import { useUsersPage } from '../hooks'
import { type User } from '../data/schema'
import { createUsersColumns } from './users-columns'

type UsersTableProps = {
  roles: Role[]
  search: Record<string, unknown>
  navigate: NavigateFn
  onManageRoles: (row: User) => void
}

export function UsersTable({
  roles,
  search,
  navigate,
  onManageRoles,
}: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const columns = useMemo(
    () => createUsersColumns(onManageRoles),
    [onManageRoles]
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
      { columnId: 'username', searchKey: 'username', type: 'string' },
      { columnId: 'roles', searchKey: 'roles', type: 'array' },
    ],
  })

  // `columnFilters` reflète la saisie/sélection en cours ; `appliedFilters`
  // ne change qu'au clic sur "Search" — seul lui alimente la requête backend.
  const [appliedFilters, setAppliedFilters] =
    useState<ColumnFiltersState>(columnFilters)

  const username = getColumnFilterValue<string>(appliedFilters, 'username')
  const rolesFilter = getColumnFilterValue<string[]>(appliedFilters, 'roles')

  const { data, isLoading, isError } = useUsersPage({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ordering: buildOrdering(sorting),
    search: username || undefined,
    filters: {
      roles:
        rolesFilter && rolesFilter.length > 0
          ? rolesFilter.join(',')
          : undefined,
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
    return <p className='text-destructive'>Failed to load users.</p>
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
        searchKey: 'username',
        searchTitle: 'Username',
        searchPlaceholder: 'Filter by username...',
        filters: [
          {
            columnId: 'roles',
            title: 'Role',
            options: roles.map((role) => ({
              label: role.name,
              value: role.name,
            })),
          },
        ],
        onSearch: () => setAppliedFilters(columnFilters),
      }}
    />
  )
}
