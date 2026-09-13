import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { renderColumn } from '@/components/fields/render-column'
import { type FieldDescriptor, type FieldOption } from '@/lib/fields/field-descriptor'
import { type Vente, type VenteStatus } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

const STATUS_BADGE_VARIANT: Record<VenteStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  validated:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
}

const ID_FIELD: FieldDescriptor<Vente> = {
  name: 'id',
  label: 'ID',
  type: 'text',
  render: (row) => <div className='ps-3'>{row.id}</div>,
}

// Colonne 'select' démonstrant `clickable`/`linkTo` : le libellé résolu
// (nom du client) navigue vers sa fiche de saisie au clic.
const CUSTOMER_FIELD: FieldDescriptor<Vente> = {
  name: 'customer',
  label: 'Customer',
  type: 'select',
  clickable: true,
  linkTo: (row) => ({
    to: '/customers/saisie/$id',
    params: { id: row.customer },
  }),
}

const STATUS_FIELD: FieldDescriptor<Vente> = {
  name: 'status',
  label: 'Status',
  type: 'text',
  render: (row) => (
    <Badge
      variant='outline'
      className={cn('capitalize', STATUS_BADGE_VARIANT[row.status])}
    >
      {row.status}
    </Badge>
  ),
}

const TOTAL_FIELD: FieldDescriptor<Vente> = {
  name: 'total',
  label: 'Total',
  type: 'text',
}

const arrayFilter = (row: { getValue: (id: string) => unknown }, id: string, value: string[]) =>
  value.includes(row.getValue(id) as string)

export function createVentesColumns(
  customerNameById: Record<string, string>,
  onDelete: (row: Vente) => void
): ColumnDef<Vente>[] {
  const customerOptions: FieldOption[] = Object.entries(customerNameById).map(
    ([value, label]) => ({ value, label })
  )

  return [
    renderColumn(ID_FIELD, { columnDef: { enableHiding: false } }),
    renderColumn(CUSTOMER_FIELD, {
      resolvedOptions: customerOptions,
      columnDef: { filterFn: arrayFilter },
    }),
    renderColumn(STATUS_FIELD, {
      columnDef: { filterFn: arrayFilter, enableSorting: false },
    }),
    renderColumn(TOTAL_FIELD),
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions row={row} onDelete={onDelete} />
      ),
    },
  ]
}
