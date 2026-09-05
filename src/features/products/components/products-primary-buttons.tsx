import { Link } from '@tanstack/react-router'
import { PackagePlus } from 'lucide-react'
import { hasPermission } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'

export function ProductsPrimaryButtons() {
  if (!hasPermission('add_product')) {
    return null
  }

  return (
    <Button className='space-x-1' asChild>
      <Link to='/products/saisie'>
        <span>Add Product</span> <PackagePlus size={18} />
      </Link>
    </Button>
  )
}
