import { type Row } from '@tanstack/react-table'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type User } from '../data/schema'

type DataTableRowActionsProps = {
  row: Row<User>
  onManageRoles: (row: User) => void
}

export function DataTableRowActions({
  row,
  onManageRoles,
}: DataTableRowActionsProps) {
  return (
    <Button
      variant='ghost'
      size='sm'
      className='space-x-1'
      onClick={() => onManageRoles(row.original)}
    >
      <ShieldCheck size={16} />
      <span>Manage roles</span>
    </Button>
  )
}
