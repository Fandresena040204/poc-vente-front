import { Fragment, useState } from 'react'
import { Badge } from '@/components/ui/badge'
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
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { defaultRoleAccess, permissionGroups, roles } from './data'

export function RoleBasedAccessPage() {
  const [access, setAccess] =
    useState<Record<string, Record<string, boolean>>>(defaultRoleAccess)

  const toggle = (role: string, key: string) => {
    setAccess((prev) => ({
      ...prev,
      [role]: { ...prev[role], [key]: !prev[role][key] },
    }))
  }

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Role Based Access
          </h2>
          <p className='text-muted-foreground'>
            Manage what each role can see and do across the product.
          </p>
        </div>

        <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {roles.map((role) => (
            <Card key={role.name}>
              <CardHeader>
                <CardTitle className='flex items-center justify-between text-base'>
                  {role.name}
                  <Badge variant='secondary'>{role.users} users</Badge>
                </CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Permissions matrix</CardTitle>
            <CardDescription>
              Toggle a checkbox to grant or revoke access for a role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    {roles.map((role) => (
                      <TableHead key={role.name} className='text-center'>
                        {role.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionGroups.map((group) => (
                    <Fragment key={group.group}>
                      <TableRow className='bg-muted/40'>
                        <TableCell
                          colSpan={roles.length + 1}
                          className='font-medium'
                        >
                          {group.group}
                        </TableCell>
                      </TableRow>
                      {group.permissions.map((permission) => {
                        const key = `${group.group}:${permission}`
                        return (
                          <TableRow key={key}>
                            <TableCell className='ps-6 text-muted-foreground'>
                              {permission}
                            </TableCell>
                            {roles.map((role) => (
                              <TableCell
                                key={role.name}
                                className='text-center'
                              >
                                <Checkbox
                                  checked={access[role.name]?.[key] ?? false}
                                  onCheckedChange={() =>
                                    toggle(role.name, key)
                                  }
                                  disabled={role.name === 'Owner'}
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
      </Main>
    </>
  )
}
