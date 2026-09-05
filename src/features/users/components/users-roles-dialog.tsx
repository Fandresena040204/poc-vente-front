import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useRoles } from '@/features/roles/hooks'
import { type User } from '../data/schema'
import { useAssignRole, useRemoveRole } from '../hooks'

type UsersRolesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersRolesDialog({
  open,
  onOpenChange,
  currentRow,
}: UsersRolesDialogProps) {
  const { data: roles } = useRoles()
  const assignRole = useAssignRole()
  const removeRole = useRemoveRole()
  const [selected, setSelected] = useState<string[]>(currentRow.roles)
  const isPending = assignRole.isPending || removeRole.isPending

  function toggle(role: string, checked: boolean) {
    setSelected((prev) =>
      checked ? [...prev, role] : prev.filter((r) => r !== role)
    )
  }

  async function handleSave() {
    const toAdd = selected.filter((role) => !currentRow.roles.includes(role))
    const toRemove = currentRow.roles.filter((role) => !selected.includes(role))

    await Promise.all([
      ...toAdd.map((role) =>
        assignRole.mutateAsync({ id: currentRow.id, role })
      ),
      ...toRemove.map((role) =>
        removeRole.mutateAsync({ id: currentRow.id, role })
      ),
    ])

    toast.success('Roles updated.')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Manage roles — {currentRow.username}</DialogTitle>
          <DialogDescription>
            Toggle roles to assign or remove them for this user.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-3 py-2'>
          {(roles ?? []).map((role) => (
            <Label
              key={role.id}
              className='flex items-center gap-2 font-normal'
            >
              <Checkbox
                checked={selected.includes(role.name)}
                onCheckedChange={(checked) => toggle(role.name, !!checked)}
              />
              {role.name}
            </Label>
          ))}
          {roles?.length === 0 && (
            <p className='text-sm text-muted-foreground'>No roles yet.</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className='animate-spin' />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
