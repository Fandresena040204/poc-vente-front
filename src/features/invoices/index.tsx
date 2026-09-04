import { useState } from 'react'
import { Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
import { invoiceTotal, invoices, statusVariant } from './data'

export function InvoicesPage() {
  const [selectedId, setSelectedId] = useState(invoices[0].id)
  const selected = invoices.find((invoice) => invoice.id === selectedId)!

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
          <h2 className='text-2xl font-bold tracking-tight'>Invoices</h2>
          <p className='text-muted-foreground'>
            Select an invoice to preview its details.
          </p>
        </div>

        <div className='grid gap-4 lg:grid-cols-5'>
          <Card className='lg:col-span-3'>
            <CardContent>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due</TableHead>
                      <TableHead className='text-end'>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        onClick={() => setSelectedId(invoice.id)}
                        data-state={
                          invoice.id === selectedId ? 'selected' : undefined
                        }
                        className='cursor-pointer data-[state=selected]:bg-muted'
                      >
                        <TableCell className='font-medium'>
                          {invoice.id}
                        </TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[invoice.status]}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-muted-foreground'>
                          {invoice.due}
                        </TableCell>
                        <TableCell className='text-end'>
                          ${invoiceTotal(invoice).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                {selected.id}
                <Badge variant={statusVariant[selected.status]}>
                  {selected.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                {selected.customer} · {selected.email}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <div className='flex justify-between text-sm text-muted-foreground'>
                <span>Issued {selected.issued}</span>
                <span>Due {selected.due}</span>
              </div>
              <Separator />
              <div className='flex flex-col gap-2'>
                {selected.items.map((item) => (
                  <div
                    key={item.description}
                    className='flex items-center justify-between text-sm'
                  >
                    <span>
                      {item.description}
                      <span className='ms-1 text-muted-foreground'>
                        × {item.quantity}
                      </span>
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className='flex items-center justify-between font-semibold'>
                <span>Total</span>
                <span>${invoiceTotal(selected).toFixed(2)}</span>
              </div>
              <Button className='w-full'>
                <Download className='size-4' />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
