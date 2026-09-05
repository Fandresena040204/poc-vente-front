import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type User } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='ps-3'>{row.getValue('id')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Username' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('username')}</LongText>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Active' />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue('is_active') ? 'outline' : 'secondary'}>
        {row.getValue('is_active') ? 'Active' : 'Inactive'}
      </Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'roles',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Roles' />
    ),
    cell: ({ row }) => {
      const roles = row.getValue<string[]>('roles')
      return (
        <div className='flex flex-wrap gap-1'>
          {roles.length === 0 ? (
            <span className='text-muted-foreground'>—</span>
          ) : (
            roles.map((role) => (
              <Badge key={role} variant='outline' className='capitalize'>
                {role}
              </Badge>
            ))
          )}
        </div>
      )
    },
    filterFn: (row, id, value) =>
      row.getValue<string[]>(id).some((role) => value.includes(role)),
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
