import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { renderColumn } from '@/components/fields/render-column'
import { LongText } from '@/components/long-text'
import { type FieldDescriptor } from '@/lib/fields/field-descriptor'
import { type User } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

const ID_FIELD: FieldDescriptor<User> = {
  name: 'id',
  label: 'ID',
  type: 'text',
  render: (row) => <div className='ps-3'>{row.id}</div>,
}

const USERNAME_FIELD: FieldDescriptor<User> = {
  name: 'username',
  label: 'Username',
  type: 'text',
  render: (row) => <LongText className='max-w-36'>{row.username}</LongText>,
}

const EMAIL_FIELD: FieldDescriptor<User> = {
  name: 'email',
  label: 'Email',
  type: 'text',
}

const IS_ACTIVE_FIELD: FieldDescriptor<User> = {
  name: 'is_active',
  label: 'Active',
  type: 'text',
  render: (row) => (
    <Badge variant={row.is_active ? 'outline' : 'secondary'}>
      {row.is_active ? 'Active' : 'Inactive'}
    </Badge>
  ),
}

const ROLES_FIELD: FieldDescriptor<User> = {
  name: 'roles',
  label: 'Roles',
  type: 'text',
  render: (row) => (
    <div className='flex flex-wrap gap-1'>
      {row.roles.length === 0 ? (
        <span className='text-muted-foreground'>—</span>
      ) : (
        row.roles.map((role) => (
          <Badge key={role} variant='outline' className='capitalize'>
            {role}
          </Badge>
        ))
      )}
    </div>
  ),
}

export function createUsersColumns(
  onManageRoles: (row: User) => void
): ColumnDef<User>[] {
  return [
    renderColumn(ID_FIELD, { columnDef: { enableHiding: false } }),
    renderColumn(USERNAME_FIELD, { columnDef: { enableHiding: false } }),
    renderColumn(EMAIL_FIELD),
    renderColumn(IS_ACTIVE_FIELD, { columnDef: { enableSorting: false } }),
    renderColumn(ROLES_FIELD, {
      columnDef: {
        enableSorting: false,
        filterFn: (row, id, value: string[]) =>
          (row.getValue(id) as string[]).some((role) => value.includes(role)),
      },
    }),
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions row={row} onManageRoles={onManageRoles} />
      ),
    },
  ]
}
