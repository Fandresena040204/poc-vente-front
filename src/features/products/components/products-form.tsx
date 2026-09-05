import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  type Product,
  type ProductForm,
  productFormSchema,
} from '../data/schema'
import { useCreateProduct, useUpdateProduct } from '../hooks'

type ProductsFormProps = {
  currentRow?: Product
  onSuccess: () => void
  onCancel: () => void
}

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
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Clavier mécanique'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='sku'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>SKU</FormLabel>
              <FormControl>
                <Input
                  placeholder='SKU-001'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='default_price'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>
                Default price
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='19.99'
                  className='col-span-4'
                  inputMode='decimal'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
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
