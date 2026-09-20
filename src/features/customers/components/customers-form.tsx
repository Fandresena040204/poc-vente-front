import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { type FieldDescriptor } from '@/lib/fields/field-descriptor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { RenderFormField } from '@/components/fields/render-form-field'
import { useCreateCustomer, useUpdateCustomer } from '../hooks'
import { type Customer, type CustomerForm, customerFormSchema } from '../data/schema'

type CustomersFormProps = {
  currentRow?: Customer
  /** Reçoit l'entité créée/modifiée (ex: pour une création rapide en popup qui sélectionne la valeur créée — voir `FieldDescriptor.quickCreate`). */
  onSuccess: (result: Customer) => void
  onCancel: () => void
}

const CUSTOMER_FIELDS: FieldDescriptor<CustomerForm>[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Acme Corp',
    autoComplete: 'off',
  },
  { name: 'email', label: 'Email', type: 'text', placeholder: 'contact@acme.test' },
  { name: 'phone', label: 'Phone', type: 'text', placeholder: '+123456789' },
]

export function CustomersForm({
  currentRow,
  onSuccess,
  onCancel,
}: CustomersFormProps) {
  const isEdit = !!currentRow
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const isPending = createCustomer.isPending || updateCustomer.isPending

  const form = useForm<CustomerForm>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          email: currentRow.email,
          phone: currentRow.phone,
        }
      : {
          name: '',
          email: '',
          phone: '',
        },
  })

  function onSubmit(values: CustomerForm) {
    const mutation = isEdit
      ? updateCustomer.mutateAsync({ id: currentRow.id, payload: values })
      : createCustomer.mutateAsync(values)

    mutation.then((result) => {
      form.reset()
      onSuccess(result)
    })
  }

  return (
    <Form {...form}>
      <form
        id='customer-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='max-w-xl space-y-4'
      >
        {CUSTOMER_FIELDS.map((field) => (
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
