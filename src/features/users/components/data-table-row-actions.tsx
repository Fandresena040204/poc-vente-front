import { type Row } from '@tanstack/react-table'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type User } from '../data/schema'
import { useUsersContext } from './users-provider'

type DataTableRowActionsProps = {
  row: Row<User>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useUsersContext()

  return (
    <Button
      variant='ghost'
      size='sm'
      className='space-x-1'
      onClick={() => {
        setCurrentRow(row.original)
        setOpen('roles')
      }}
    >
      <ShieldCheck size={16} />
      <span>Manage roles</span>
    </Button>
  )
}
