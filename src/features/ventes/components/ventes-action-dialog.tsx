import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useCustomers } from '@/features/customers/hooks'
import { useProducts } from '@/features/products/hooks'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { useCreateVente, useUpdateVente } from '../hooks'
import { type Vente, type VenteForm, venteFormSchema } from '../data/schema'

type VentesActionDialogProps = {
  currentRow?: Vente
  open: boolean
  onOpenChange: (open: boolean) => void
}

const emptyLine = { product: '', quantity: '1', unit_price: '0.00' }

export function VentesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: VentesActionDialogProps) {
  const isEdit = !!currentRow
  const { data: customers } = useCustomers()
  const { data: products } = useProducts()
  const createVente = useCreateVente()
  const updateVente = useUpdateVente()
  const isPending = createVente.isPending || updateVente.isPending

  const form = useForm<VenteForm>({
    resolver: zodResolver(venteFormSchema),
    defaultValues: isEdit
      ? {
          customer: currentRow.customer,
          lines: currentRow.lines.map((line) => ({
            id: line.id,
            product: line.product,
            quantity: line.quantity,
            unit_price: line.unit_price,
          })),
        }
      : {
          customer: '',
          lines: [emptyLine],
        },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines',
  })

  function onSubmit(values: VenteForm) {
    const mutation = isEdit
      ? updateVente.mutateAsync({ id: currentRow.id, values })
      : createVente.mutateAsync(values)

    mutation.then(() => {
      form.reset()
      onOpenChange(false)
    })
  }

  const customerOptions = (customers ?? []).map((customer) => ({
    label: customer.name,
    value: customer.id,
  }))
  const productOptions = (products ?? []).map((product) => ({
    label: `${product.name} (${product.sku})`,
    value: product.id,
  }))

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit Vente' : 'Add New Vente'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the vente here. ' : 'Create a new vente here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='vente-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='customer'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Customer
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a customer'
                      className='col-span-4'
                      items={customerOptions}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <FormLabel>Lines</FormLabel>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => append(emptyLine)}
                  >
                    <Plus size={14} /> Add line
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className='grid grid-cols-12 items-start gap-2 rounded-md border p-2'
                  >
                    <FormField
                      control={form.control}
                      name={`lines.${index}.product`}
                      render={({ field }) => (
                        <FormItem className='col-span-5 space-y-0'>
                          <SelectDropdown
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder='Product'
                            items={productOptions}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`lines.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className='col-span-3 space-y-0'>
                          <FormControl>
                            <Input placeholder='Qty' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`lines.${index}.unit_price`}
                      render={({ field }) => (
                        <FormItem className='col-span-3 space-y-0'>
                          <FormControl>
                            <Input placeholder='Unit price' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='col-span-1'
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='vente-form' disabled={isPending}>
            {isPending && <Loader2 className='animate-spin' />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
