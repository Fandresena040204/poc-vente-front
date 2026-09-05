import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Vente, type VenteStatus } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

const STATUS_BADGE_VARIANT: Record<VenteStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  validated:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
}

export function createVentesColumns(
  customerNameById: Record<string, string>
): ColumnDef<Vente>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }) => <div className='ps-3'>{row.getValue('id')}</div>,
      enableHiding: false,
    },
    {
      accessorKey: 'customer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Customer' />
      ),
      cell: ({ row }) => {
        const customerId = row.getValue<string>('customer')
        return <div>{customerNameById[customerId] ?? customerId}</div>
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const status = row.getValue<VenteStatus>('status')
        return (
          <Badge
            variant='outline'
            className={cn('capitalize', STATUS_BADGE_VARIANT[status])}
          >
            {status}
          </Badge>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      enableSorting: false,
    },
    {
      accessorKey: 'total',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Total' />
      ),
      cell: ({ row }) => <div>{row.getValue('total')}</div>,
    },
    {
      id: 'actions',
      cell: DataTableRowActions,
    },
  ]
}
