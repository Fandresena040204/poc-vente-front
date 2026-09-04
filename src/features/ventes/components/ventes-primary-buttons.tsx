import { ReceiptText } from 'lucide-react'
import { hasPermission } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { useVentesContext } from './ventes-provider'

export function VentesPrimaryButtons() {
  const { setOpen } = useVentesContext()

  if (!hasPermission('add_vente')) {
    return null
  }

  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Add Vente</span> <ReceiptText size={18} />
    </Button>
  )
}
