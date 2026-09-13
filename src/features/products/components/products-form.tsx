import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { type FieldDescriptor } from '@/lib/fields/field-descriptor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { RenderFormField } from '@/components/fields/render-form-field'
import { useCreateProduct, useUpdateProduct } from '../hooks'
import { type Product, type ProductForm, productFormSchema } from '../data/schema'

type ProductsFormProps = {
  currentRow?: Product
  onSuccess: () => void
  onCancel: () => void
}

const PRODUCT_FIELDS: FieldDescriptor<ProductForm>[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Clavier mécanique',
    autoComplete: 'off',
  },
  {
    name: 'sku',
    label: 'SKU',
    type: 'text',
    placeholder: 'SKU-001',
    autoComplete: 'off',
  },
  {
    name: 'default_price',
    label: 'Default price',
    type: 'number',
    placeholder: '19.99',
  },
]

export function ProductsForm({
  currentRow,
  onSuccess,
  onCancel,
}: ProductsFormProps) {
  const isEdit = !!currentRow
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const isPending = createProduct.isPending || updateProduct.isPending

  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          sku: currentRow.sku,
          default_price: currentRow.default_price,
        }
      : {
          name: '',
          sku: '',
          default_price: '',
        },
  })

  function onSubmit(values: ProductForm) {
    const mutation = isEdit
      ? updateProduct.mutateAsync({ id: currentRow.id, payload: values })
      : createProduct.mutateAsync(values)

    mutation.then(() => {
      form.reset()
      onSuccess()
    })
  }

  return (
    <Form {...form}>
      <form
        id='product-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='max-w-xl space-y-4'
      >
        {PRODUCT_FIELDS.map((field) => (
          <RenderFormField
            key={field.name}
            descriptor={field}
            form={form}
            layout='grid-label'
          />
        ))}
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
