import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowDownRight, ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { orders, statusVariant } from '@/features/orders/data'
import { products } from '@/features/tables/data'

const salesTrend = [
  { day: 'Mon', sales: 2400 },
  { day: 'Tue', sales: 1980 },
  { day: 'Wed', sales: 3120 },
  { day: 'Thu', sales: 2780 },
  { day: 'Fri', sales: 3860 },
  { day: 'Sat', sales: 4320 },
  { day: 'Sun', sales: 3540 },
]

const stats = [
  {
    label: 'Revenue',
    value: '$48,820',
    change: '+12.4%',
    trend: 'up' as const,
    icon: DollarSign,
  },
  {
    label: 'Orders',
    value: orders.length.toString(),
    change: '+8.2%',
    trend: 'up' as const,
    icon: ShoppingCart,
  },
  {
    label: 'Customers',
    value: '1,204',
    change: '+4.1%',
    trend: 'up' as const,
    icon: Users,
  },
  {
    label: 'Low stock items',
    value: products.filter((p) => p.status === 'low-stock').length.toString(),
    change: '-2',
    trend: 'down' as const,
    icon: Package,
  },
]

const topProducts = [...products]
  .sort((a, b) => b.stock - a.stock)
  .slice(0, 5)

export function EcommerceDashboard() {
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
            eCommerce Dashboard
          </h2>
          <p className='text-muted-foreground'>
            Sales performance and inventory at a glance.
          </p>
        </div>

        <div className='mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className='text-2xl'>{stat.value}</CardTitle>
                <CardAction>
                  <span className='flex size-9 items-center justify-center rounded-full bg-muted'>
                    <stat.icon className='size-4' />
                  </span>
                </CardAction>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={stat.trend === 'up' ? 'default' : 'destructive'}
                  className='gap-1'
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className='size-3' />
                  ) : (
                    <ArrowDownRight className='size-3' />
                  )}
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='grid gap-4 lg:grid-cols-7'>
          <Card className='lg:col-span-4'>
            <CardHeader>
              <CardTitle>Sales this week</CardTitle>
              <CardDescription>Daily revenue in USD</CardDescription>
            </CardHeader>
            <CardContent className='ps-0'>
              <ResponsiveContainer width='100%' height={280}>
                <AreaChart data={salesTrend}>
                  <XAxis
                    dataKey='day'
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip />
                  <Area
                    type='monotone'
                    dataKey='sales'
                    stroke='currentColor'
                    fill='currentColor'
                    fillOpacity={0.2}
                    strokeWidth={2}
                    className='text-primary'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className='lg:col-span-3'>
            <CardHeader>
              <CardTitle>Top products by stock</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  className='flex items-center justify-between text-sm'
                >
                  <span>{product.name}</span>
                  <span className='text-muted-foreground'>
                    {product.stock} units
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className='mt-4'>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-end'>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className='font-medium'>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-end'>
                        ${order.total.toFixed(2)}
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
