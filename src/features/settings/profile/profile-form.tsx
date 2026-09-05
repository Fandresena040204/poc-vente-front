import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updateMe } from '@/features/auth/api'

const profileFormSchema = z.object({
  first_name: z.string().max(150, 'Must not be longer than 150 characters.'),
  last_name: z.string().max(150, 'Must not be longer than 150 characters.'),
  email: z
    .email('Please enter a valid email address.')
    .or(z.literal(''))
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { auth } = useAuthStore()
  const user = auth.user

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      auth.setUser(updatedUser)
      toast.success('Profile updated.')
    },
    onError: () => {
      toast.error('Failed to update profile.')
    },
  })

  function onSubmit(data: ProfileFormValues) {
    mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input value={user?.username ?? ''} disabled />
          </FormControl>
          <FormDescription>Your username cannot be changed.</FormDescription>
        </FormItem>
        <FormField
          control={form.control}
          name='first_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder='John' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='last_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder='Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='john.doe@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Updating...' : 'Update profile'}
        </Button>
      </form>
    </Form>
  )
}
