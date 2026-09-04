import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
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
import { cn } from '@/lib/utils'
import { invoiceSummary, products, statusLabels, teamMembers } from './data'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  Paid: 'default',
  Active: 'default',
  Pending: 'secondary',
  Away: 'secondary',
  Overdue: 'destructive',
  Offline: 'destructive',
}

export function BasicTablesPage() {
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
          <h2 className='text-2xl font-bold tracking-tight'>Basic Tables</h2>
          <p className='text-muted-foreground'>
            Simple, static tables built with shadcn/ui table primitives.
          </p>
        </div>

        <div className='flex flex-col gap-4'>
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>A simple table with a caption</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of members across teams.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className='text-end'>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.name}>
                      <TableCell className='font-medium'>{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.team}</TableCell>
                      <TableCell className='text-end'>
                        <Badge variant={statusVariant[member.status] ?? 'outline'}>
                          {member.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                A table with a footer summarizing totals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-end'>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceSummary.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                      <TableCell className='font-medium'>
                        {invoice.invoice}
                      </TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[invoice.status] ?? 'outline'}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-end'>
                        ${invoice.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                A compact, striped table with row separators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-end'>Price</TableHead>
                    <TableHead className='text-end'>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.slice(0, 6).map((product, index) => (
                    <TableRow
                      key={product.id}
                      className={cn(index % 2 === 1 && 'bg-muted/40')}
                    >
                      <TableCell className='font-medium'>
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === 'in-stock'
                              ? 'default'
                              : product.status === 'low-stock'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {statusLabels[product.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-end'>
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className='text-end'>{product.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
