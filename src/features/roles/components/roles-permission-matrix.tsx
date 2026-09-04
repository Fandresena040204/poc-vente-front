import { Fragment } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUpdateRole } from '../hooks'
import { type Role } from '../data/schema'
import { useRolesContext } from './roles-provider'

const RESOURCES = [
  { label: 'Customers', model: 'customer' },
  { label: 'Products', model: 'product' },
  { label: 'Ventes', model: 'vente' },
] as const

const ACTIONS = [
  { label: 'View', action: 'view' },
  { label: 'Add', action: 'add' },
  { label: 'Change', action: 'change' },
  { label: 'Delete', action: 'delete' },
] as const

type RolesPermissionMatrixProps = {
  roles: Role[]
}

export function RolesPermissionMatrix({ roles }: RolesPermissionMatrixProps) {
  const updateRole = useUpdateRole()
  const { setOpen, setCurrentRow } = useRolesContext()

  function toggle(role: Role, codename: string, checked: boolean) {
    const permissions = checked
      ? [...role.permissions, codename]
      : role.permissions.filter((p) => p !== codename)

    updateRole.mutate({ id: role.id, payload: { name: role.name, permissions } })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions matrix</CardTitle>
        <CardDescription>
          Toggle a checkbox to grant or revoke a permission for a role. Saved
          immediately.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                {roles.map((role) => (
                  <TableHead key={role.id} className='text-center'>
                    <div className='flex items-center justify-center gap-1'>
                      <span className='capitalize'>{role.name}</span>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6'
                        onClick={() => {
                          setCurrentRow(role)
                          setOpen('delete')
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {RESOURCES.map((resource) => (
                <Fragment key={resource.model}>
                  <TableRow className='bg-muted/40'>
                    <TableCell colSpan={roles.length + 1} className='font-medium'>
                      {resource.label}
                    </TableCell>
                  </TableRow>
                  {ACTIONS.map(({ label, action }) => {
                    const codename = `${action}_${resource.model}`
                    return (
                      <TableRow key={codename}>
                        <TableCell className='ps-6 text-muted-foreground'>
                          {label}
                        </TableCell>
                        {roles.map((role) => (
                          <TableCell key={role.id} className='text-center'>
                            <Checkbox
                              checked={role.permissions.includes(codename)}
                              onCheckedChange={(checked) =>
                                toggle(role, codename, !!checked)
                              }
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
