import { type ColumnDef } from '@tanstack/react-table'
import { LongText } from '@/components/long-text'
import { ResourceRowActions } from '@/components/crud/resource-row-actions'
import { renderColumn } from '@/components/fields/render-column'
import { type FieldDescriptor } from '@/lib/fields/field-descriptor'
import { rangeFilterFn } from '@/lib/fields/range-filter-fn'
import { type Product } from '../data/schema'

const ID_FIELD: FieldDescriptor<Product> = {
  name: 'id',
  label: 'ID',
  type: 'text',
  render: (row) => <div className='ps-3'>{row.id}</div>,
}

const NAME_FIELD: FieldDescriptor<Product> = {
  name: 'name',
  label: 'Name',
  type: 'text',
  render: (row) => <LongText className='max-w-48'>{row.name}</LongText>,
}

const SKU_FIELD: FieldDescriptor<Product> = {
  name: 'sku',
  label: 'SKU',
  type: 'text',
}

const DEFAULT_PRICE_FIELD: FieldDescriptor<Product> = {
  name: 'default_price',
  label: 'Default price',
  type: 'text',
}

// Démonstration du filtre par intervalle (min/max) sur une colonne date —
// pendant du filtre multi-sélection (voir Ventes.status) pour une valeur
// continue plutôt que discrète.
const CREATED_AT_FIELD: FieldDescriptor<Product> = {
  name: 'created_at',
  label: 'Created',
  type: 'date',
}

export function createProductsColumns(
  onDelete: (row: Product) => void
): ColumnDef<Product>[] {
  return [
    renderColumn(ID_FIELD, { columnDef: { enableHiding: false } }),
    renderColumn(NAME_FIELD, { columnDef: { enableHiding: false } }),
    renderColumn(SKU_FIELD),
    renderColumn(DEFAULT_PRICE_FIELD, { columnDef: { enableSorting: false } }),
    renderColumn(CREATED_AT_FIELD, {
      columnDef: { filterFn: rangeFilterFn('date') },
    }),
    {
      id: 'actions',
      cell: ({ row }) => (
        <ResourceRowActions
          resourceKey='product'
          editTo='/products/saisie/$id'
          editParams={{ id: row.original.id }}
          onDelete={() => onDelete(row.original)}
        />
      ),
    },
  ]
}
