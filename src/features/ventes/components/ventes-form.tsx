import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { type Product } from '@/features/products/data/schema'
import { type FieldDescriptor, type FieldOption } from '@/lib/fields/field-descriptor'
import { Button } from '@/components/ui/button'
import { Form, FormLabel } from '@/components/ui/form'
import { RenderFormField } from '@/components/fields/render-form-field'
import { useCustomers } from '@/features/customers/hooks'
import { useProducts } from '@/features/products/hooks'
import { type Vente, type VenteForm, venteFormSchema } from '../data/schema'
import { useCreateVente, useUpdateVente } from '../hooks'

type VentesFormProps = {
  currentRow?: Vente
  onSuccess: () => void
  onCancel: () => void
}

const emptyLine = { product: '', quantity: '1', unit_price: '0.00' }

export function VentesForm({
  currentRow,
  onSuccess,
  onCancel,
}: VentesFormProps) {
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
      ? updateVente.mutateAsync({ id: currentRow.id, payload: values })
      : createVente.mutateAsync(values)

    mutation.then(() => {
      form.reset()
      onSuccess()
    })
  }

  const customerOptions: FieldOption[] = (customers ?? []).map((customer) => ({
    label: customer.name,
    value: customer.id,
  }))
  const customerField: FieldDescriptor<VenteForm> = {
    name: 'customer',
    label: 'Customer',
    type: 'select',
    placeholder: 'Select a customer',
    options: customerOptions,
  }
  const productOptions: FieldOption[] = (products ?? []).map((product) => ({
    label: `${product.name} (${product.sku})`,
    value: product.id,
    data: product,
  }))

  function lineFields(index: number): FieldDescriptor<VenteForm>[] {
    return [
      {
        name: `lines.${index}.product`,
        label: 'Product',
        type: 'select',
        placeholder: 'Product',
        options: productOptions,
        fillsFields: (selected) => ({
          [`lines.${index}.unit_price`]: (selected.data as Product)
            .default_price,
        }),
      },
      {
        name: `lines.${index}.quantity`,
        label: 'Quantity',
        type: 'number',
        placeholder: 'Qty',
      },
      {
        name: `lines.${index}.unit_price`,
        label: 'Unit price',
        type: 'number',
        placeholder: 'Unit price',
      },
    ]
  }

  return (
    <Form {...form}>
      <form
        id='vente-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='max-w-2xl space-y-4'
      >
        <RenderFormField
          descriptor={customerField}
          form={form}
          layout='grid-label'
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
          {fields.map((field, index) => {
            const [productField, quantityField, unitPriceField] =
              lineFields(index)
            return (
              <div
                key={field.id}
                className='grid grid-cols-12 items-start gap-2 rounded-md border p-2'
              >
                <RenderFormField
                  descriptor={productField}
                  form={form}
                  hideLabel
                  className='col-span-5 space-y-0'
                />
                <RenderFormField
                  descriptor={quantityField}
                  form={form}
                  hideLabel
                  className='col-span-3 space-y-0'
                />
                <RenderFormField
                  descriptor={unitPriceField}
                  form={form}
                  hideLabel
                  className='col-span-3 space-y-0'
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
            )
          })}
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={isPending}>
            {isPending && <Loader2 className='animate-spin' />}
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
