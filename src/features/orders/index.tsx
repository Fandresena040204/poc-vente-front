import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Main } from '@/components/layout/main'
import { orders, statusVariant } from './data'

export function OrdersPage() {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Orders</h2>
          <p className='text-muted-foreground'>
            {orders.length} orders · ${totalRevenue.toFixed(2)} total
          </p>
        </div>

        <Card>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className='text-end'>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-end'>Total</TableHead>
                    <TableHead className='text-end'>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className='font-medium'>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className='text-end'>{order.items}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-end'>
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell className='text-end text-muted-foreground'>
                        {order.date}
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
