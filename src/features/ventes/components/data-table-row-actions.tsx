import { type Row } from '@tanstack/react-table'
import { Ban, CheckCircle2 } from 'lucide-react'
import { hasPermission } from '@/stores/auth-store'
import { ResourceRowActions } from '@/components/crud/resource-row-actions'
import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu'
import { useAnnulerVente, useValiderVente } from '../hooks'
import { type Vente } from '../data/schema'

type DataTableRowActionsProps = {
  row: Row<Vente>
  onDelete: (row: Vente) => void
}

export function DataTableRowActions({ row, onDelete }: DataTableRowActionsProps) {
  const validerVente = useValiderVente()
  const annulerVente = useAnnulerVente()
  const vente = row.original

  const canEdit = hasPermission('change_vente')
  const canValider = canEdit && vente.status === 'draft'
  const canAnnuler = canEdit && vente.status === 'validated'

  return (
    <ResourceRowActions
      resourceKey='vente'
      editTo='/ventes/saisie/$id'
      editParams={{ id: vente.id }}
      onDelete={() => onDelete(vente)}
      extraActions={
        canValider || canAnnuler ? (
          <>
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
          </>
        ) : undefined
      }
    />
  )
}
