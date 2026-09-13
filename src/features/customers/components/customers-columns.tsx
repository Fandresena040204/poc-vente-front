import { type ColumnDef } from '@tanstack/react-table'
import { LongText } from '@/components/long-text'
import { ResourceRowActions } from '@/components/crud/resource-row-actions'
import { renderColumn } from '@/components/fields/render-column'
import { type FieldDescriptor } from '@/lib/fields/field-descriptor'
import { type Customer } from '../data/schema'

const ID_FIELD: FieldDescriptor<Customer> = {
  name: 'id',
  label: 'ID',
  type: 'text',
  render: (row) => <div className='ps-3'>{row.id}</div>,
}

const NAME_FIELD: FieldDescriptor<Customer> = {
  name: 'name',
  label: 'Name',
  type: 'text',
  render: (row) => <LongText className='max-w-48'>{row.name}</LongText>,
}

const EMAIL_FIELD: FieldDescriptor<Customer> = {
  name: 'email',
  label: 'Email',
  type: 'text',
  render: (row) => <div className='w-fit text-nowrap'>{row.email}</div>,
}

const PHONE_FIELD: FieldDescriptor<Customer> = {
  name: 'phone',
  label: 'Phone',
  type: 'text',
}

export function createCustomersColumns(
  onDelete: (row: Customer) => void
): ColumnDef<Customer>[] {
  return [
    renderColumn(ID_FIELD, { columnDef: { enableHiding: false } }),
    renderColumn(NAME_FIELD, { columnDef: { enableHiding: false } }),
    renderColumn(EMAIL_FIELD),
    renderColumn(PHONE_FIELD, { columnDef: { enableSorting: false } }),
    {
      id: 'actions',
      cell: ({ row }) => (
        <ResourceRowActions
          resourceKey='customer'
          editTo='/customers/saisie/$id'
          editParams={{ id: row.original.id }}
          onDelete={() => onDelete(row.original)}
        />
      ),
    },
  ]
}
