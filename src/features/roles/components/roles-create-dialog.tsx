import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
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
import { useCreateRole } from '../hooks'

const createRoleFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
})
type CreateRoleForm = z.infer<typeof createRoleFormSchema>

type RolesCreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RolesCreateDialog({ open, onOpenChange }: RolesCreateDialogProps) {
  const createRole = useCreateRole()

  const form = useForm<CreateRoleForm>({
    resolver: zodResolver(createRoleFormSchema),
    defaultValues: { name: '' },
  })

  function onSubmit(values: CreateRoleForm) {
    createRole
      .mutateAsync({ name: values.name, permissions: [] })
      .then(() => {
        form.reset()
        onOpenChange(false)
      })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Add New Role</DialogTitle>
          <DialogDescription>
            Create a new role here. You can grant permissions from the matrix
            once it exists.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='role-create-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='manager' autoComplete='off' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='role-create-form'
            disabled={createRole.isPending}
          >
            {createRole.isPending && <Loader2 className='animate-spin' />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
