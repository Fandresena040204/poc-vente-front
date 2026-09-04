import { ShieldPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRolesContext } from './roles-provider'

export function RolesPrimaryButtons() {
  const { setOpen } = useRolesContext()

  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Add Role</span> <ShieldPlus size={18} />
    </Button>
  )
}
