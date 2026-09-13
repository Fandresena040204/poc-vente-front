import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { type FieldDescriptor } from '@/lib/fields/field-descriptor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { RenderFormField } from '@/components/fields/render-form-field'
import { useCreateRole } from '../hooks'

const createRoleFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
})
type CreateRoleForm = z.infer<typeof createRoleFormSchema>

const ROLE_FIELDS: FieldDescriptor<CreateRoleForm>[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'manager',
    autoComplete: 'off',
  },
]

type RolesFormProps = {
  onSuccess: () => void
  onCancel: () => void
}

export function RolesForm({ onSuccess, onCancel }: RolesFormProps) {
  const createRole = useCreateRole()

  const form = useForm<CreateRoleForm>({
    resolver: zodResolver(createRoleFormSchema),
    defaultValues: { name: '' },
  })

  function onSubmit(values: CreateRoleForm) {
    createRole.mutateAsync({ name: values.name, permissions: [] }).then(() => {
      form.reset()
      onSuccess()
    })
  }

  return (
    <Form {...form}>
      <form
        id='role-create-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='max-w-xl space-y-4'
      >
        {ROLE_FIELDS.map((field) => (
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
          <Button type='submit' disabled={createRole.isPending}>
            {createRole.isPending && <Loader2 className='animate-spin' />}
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
