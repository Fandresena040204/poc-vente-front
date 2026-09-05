import { Link } from '@tanstack/react-router'
import { ReceiptText } from 'lucide-react'
import { hasPermission } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'

export function VentesPrimaryButtons() {
  if (!hasPermission('add_vente')) {
    return null
  }

  return (
    <Button className='space-x-1' asChild>
      <Link to='/ventes/saisie'>
        <span>Add Vente</span> <ReceiptText size={18} />
      </Link>
    </Button>
  )
}
