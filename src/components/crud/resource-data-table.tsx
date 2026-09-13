import { useState } from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'

type ToolbarConfig<TRow> = {
  searchKey?: string
  searchTitle?: string
  searchPlaceholder?: string
  filters?: React.ComponentProps<typeof DataTableToolbar<TRow>>['filters']
  rangeFilters?: React.ComponentProps<
    typeof DataTableToolbar<TRow>
  >['rangeFilters']
  onSearch?: () => void
}

type ResourceDataTableProps<TRow> = {
  data: TRow[]
  columns: ColumnDef<TRow>[]
  /** Nombre total de pages côté serveur (à partir du `count` de la réponse paginée), pilote `getPageCount()`. */
  pageCount: number
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  toolbar?: ToolbarConfig<TRow>
}

/**
 * Plomberie TanStack Table (rendu table/pagination/toolbar) factorisée
 * depuis Products/Customers/Ventes/Users qui en avaient chacun une copie
 * quasi identique. Entièrement "contrôlé" : le tri/filtre/pagination sont
 * appliqués côté serveur (le backend Django reçoit les vrais paramètres de
 * requête), pas en mémoire sur des données déjà chargées — `data` ne
 * contient que la page courante. L'appelant (`*-table.tsx`) possède l'état
 * (via `useTableUrlState` + un `useState` pour le tri) et lui fournit
 * `pageCount` calculé depuis `count` de la réponse API.
 */
export function ResourceDataTable<TRow>({
  data,
  columns,
  pageCount,
  pagination,
  onPaginationChange,
  columnFilters,
  onColumnFiltersChange,
  sorting,
  onSortingChange,
  toolbar,
}: ResourceDataTableProps<TRow>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
    onPaginationChange,
    onColumnFiltersChange,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <DataTableToolbar
        table={table}
        searchKey={toolbar?.searchKey}
        searchTitle={toolbar?.searchTitle}
        searchPlaceholder={toolbar?.searchPlaceholder}
        filters={toolbar?.filters}
        rangeFilters={toolbar?.rangeFilters}
        onSearch={toolbar?.onSearch}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className='group/row'>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
