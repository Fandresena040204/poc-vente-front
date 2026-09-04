import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Ban, CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { hasPermission } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAnnulerVente, useValiderVente } from '../hooks'
import { type Vente } from '../data/schema'
import { useVentesContext } from './ventes-provider'

type DataTableRowActionsProps = {
  row: Row<Vente>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useVentesContext()
  const validerVente = useValiderVente()
  const annulerVente = useAnnulerVente()
  const vente = row.original

  const canEdit = hasPermission('change_vente')
  const canDelete = hasPermission('delete_vente')
  const canValider = canEdit && vente.status === 'draft'
  const canAnnuler = canEdit && vente.status === 'validated'

  if (!canEdit && !canDelete) {
    return null
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        {canValider && (
          <DropdownMenuItem onClick={() => validerVente.mutate(vente.id)}>
            Valider
            <DropdownMenuShortcut>
              <CheckCircle2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {canAnnuler && (
          <DropdownMenuItem onClick={() => annulerVente.mutate(vente.id)}>
            Annuler
            <DropdownMenuShortcut>
              <Ban size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {(canValider || canAnnuler) && canEdit && <DropdownMenuSeparator />}
        {canEdit && (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(vente)
              setOpen('edit')
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <Pencil size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {canEdit && canDelete && <DropdownMenuSeparator />}
        {canDelete && (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(vente)
              setOpen('delete')
            }}
            className='text-red-500!'
          >
            Delete
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
