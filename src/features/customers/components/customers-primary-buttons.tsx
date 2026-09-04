import { UserPlus } from 'lucide-react'
import { hasPermission } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { useCustomersContext } from './customers-provider'

export function CustomersPrimaryButtons() {
  const { setOpen } = useCustomersContext()

  if (!hasPermission('add_customer')) {
    return null
  }

  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Add Customer</span> <UserPlus size={18} />
    </Button>
  )
}
