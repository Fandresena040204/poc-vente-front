import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
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
import { customers } from './data'

export function CustomersPage() {
  const activeCount = customers.filter((c) => c.status === 'Active').length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const totalOrders = customers.reduce((sum, c) => sum + c.orders, 0)

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
          <h2 className='text-2xl font-bold tracking-tight'>Customers</h2>
          <p className='text-muted-foreground'>
            {customers.length} customers, {activeCount} active
          </p>
        </div>

        <div className='mb-6 grid gap-4 sm:grid-cols-3'>
          <Card>
            <CardContent>
              <CardDescription>Total customers</CardDescription>
              <CardTitle className='text-2xl'>{customers.length}</CardTitle>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <CardDescription>Total orders</CardDescription>
              <CardTitle className='text-2xl'>{totalOrders}</CardTitle>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <CardDescription>Total revenue</CardDescription>
              <CardTitle className='text-2xl'>
                ${totalRevenue.toLocaleString()}
              </CardTitle>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-end'>Orders</TableHead>
                    <TableHead className='text-end'>Total spent</TableHead>
                    <TableHead className='text-end'>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Avatar className='size-8'>
                            <AvatarFallback className='text-xs'>
                              {customer.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className='font-medium'>{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {customer.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            customer.status === 'Active'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-end'>
                        {customer.orders}
                      </TableCell>
                      <TableCell className='text-end'>
                        ${customer.totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell className='text-end text-muted-foreground'>
                        {customer.joined}
                      </TableCell>
                    </TableRow>
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
