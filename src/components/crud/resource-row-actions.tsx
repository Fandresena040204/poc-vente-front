import { type ReactNode } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link, type LinkProps } from '@tanstack/react-router'
import { Pencil, Trash2 } from 'lucide-react'
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

type ResourceRowActionsProps = {
  /** Nom du modèle Django en minuscules, dérive les codenames `change_<resourceKey>`/`delete_<resourceKey>`. */
  resourceKey: string
  editTo: string
  editParams: Record<string, string>
  onDelete: () => void
  /**
   * Actions custom insérées avant Edit/Delete (ex: Valider/Annuler pour les
   * Ventes) — au caller de ne les fournir que si elles doivent apparaître
   * (le séparateur qui suit n'est affiché que dans ce cas).
   */
  extraActions?: ReactNode
}

/**
 * Menu d'actions générique d'une ligne de liste (Edit/Delete + actions
 * custom optionnelles), factorisé depuis Products/Customers/Ventes qui
 * avaient chacun leur propre copie quasi identique de ce composant.
 */
export function ResourceRowActions({
  resourceKey,
  editTo,
  editParams,
  onDelete,
  extraActions,
}: ResourceRowActionsProps) {
  const canEdit = hasPermission(`change_${resourceKey}`)
  const canDelete = hasPermission(`delete_${resourceKey}`)

  if (!canEdit && !canDelete && !extraActions) {
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
        {extraActions}
        {extraActions && <DropdownMenuSeparator />}
        {canEdit && (
          <DropdownMenuItem asChild>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Link to={editTo as LinkProps['to']} params={editParams as any}>
              Edit
              <DropdownMenuShortcut>
                <Pencil size={16} />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        )}
        {canEdit && canDelete && <DropdownMenuSeparator />}
        {canDelete && (
          <DropdownMenuItem onClick={onDelete} className='text-red-500!'>
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
