import { PackagePlus } from 'lucide-react'
import { hasPermission } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { useProductsContext } from './products-provider'

export function ProductsPrimaryButtons() {
  const { setOpen } = useProductsContext()

  if (!hasPermission('add_product')) {
    return null
  }

  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Add Product</span> <PackagePlus size={18} />
    </Button>
  )
}
