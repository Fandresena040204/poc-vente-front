import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type ResourceDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Nom de la ressource affiché dans le titre, ex: "Product", "Vente". */
  resourceLabel: string
  /** Affiché en gras dans le texte de confirmation ("Are you sure you want to delete <itemLabel>?"). */
  itemLabel: string
  /** Valeur exacte que l'utilisateur doit retaper (name/sku/id...). */
  confirmValue: string
  /** Libellé du champ de confirmation, ex: "Name", "SKU", "ID". */
  confirmFieldLabel: string
  confirmPlaceholder?: string
  /** Phrase additionnelle affichée sous le texte de confirmation (ex: conséquences spécifiques à la ressource). */
  extraNote?: string
  /** Appel standard (`useDeleteX().mutateAsync(id)`) ou custom — le dialog ne fait qu'attendre la promesse. */
  onDelete: () => Promise<unknown>
  isPending: boolean
}

export function ResourceDeleteDialog({
  open,
  onOpenChange,
  resourceLabel,
  itemLabel,
  confirmValue,
  confirmFieldLabel,
  confirmPlaceholder,
  extraNote,
  onDelete,
  isPending,
}: ResourceDeleteDialogProps) {
  const [value, setValue] = useState('')
  const formId = `resource-delete-form-${resourceLabel.toLowerCase()}`

  const handleDelete = () => {
    if (value.trim() !== confirmValue) return
    onDelete().then(() => onOpenChange(false))
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form={formId}
      disabled={value.trim() !== confirmValue || isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {resourceLabel}
        </span>
      }
      desc={
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{itemLabel}</span>?{' '}
            {extraNote ?? 'This action cannot be undone.'}
          </p>

          <Label className='my-2'>
            {confirmFieldLabel}:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                confirmPlaceholder ??
                `Enter ${confirmFieldLabel.toLowerCase()} to confirm deletion.`
              }
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText='Delete'
      destructive
    />
  )
}
