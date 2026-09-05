import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Product } from '../data/schema'
import { useDeleteProduct } from '../hooks'

type ProductsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Product
}

export function ProductsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ProductsDeleteDialogProps) {
  const [value, setValue] = useState('')
  const deleteProduct = useDeleteProduct()

  const handleDelete = () => {
    if (value.trim() !== currentRow.sku) return

    deleteProduct.mutate(currentRow.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='products-delete-form'
      disabled={value.trim() !== currentRow.sku || deleteProduct.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete Product
        </span>
      }
      desc={
        <form
          id='products-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>? This action
            cannot be undone.
          </p>

          <Label className='my-2'>
            SKU:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter product SKU to confirm deletion.'
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
