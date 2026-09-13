import { Link } from '@tanstack/react-router'
import { ShieldPlus } from 'lucide-react'
import { hasRole } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'

export function RolesPrimaryButtons() {
  // Roles est protégé par IsAdminRole côté backend (rôle 'admin' direct),
  // pas par le système générique de permissions add_role/view_role.
  if (!hasRole('admin')) {
    return null
  }

  return (
    <Button className='space-x-1' asChild>
      <Link to='/roles/saisie'>
        <span>Add Role</span> <ShieldPlus size={18} />
      </Link>
    </Button>
  )
}
