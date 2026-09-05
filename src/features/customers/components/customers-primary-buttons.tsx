import { Link } from '@tanstack/react-router'
import { UserPlus } from 'lucide-react'
import { hasPermission } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'

export function CustomersPrimaryButtons() {
  if (!hasPermission('add_customer')) {
    return null
  }

  return (
    <Button className='space-x-1' asChild>
      <Link to='/customers/saisie'>
        <span>Add Customer</span> <UserPlus size={18} />
      </Link>
    </Button>
  )
}
