export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'

export type Order = {
  id: string
  customer: string
  items: number
  total: number
  status: OrderStatus
  date: string
}

export const orders: Order[] = [
  {
    id: 'ORD-3001',
    customer: 'Northwind Traders',
    items: 4,
    total: 312.5,
    status: 'Delivered',
    date: '2026-08-01',
  },
  {
    id: 'ORD-3002',
    customer: 'Globex Corp',
    items: 2,
    total: 179.98,
    status: 'Shipped',
    date: '2026-08-05',
  },
  {
    id: 'ORD-3003',
    customer: 'Wayne Enterprises',
    items: 8,
    total: 964.2,
    status: 'Processing',
    date: '2026-08-08',
  },
  {
    id: 'ORD-3004',
    customer: 'Initech',
    items: 1,
    total: 89.99,
    status: 'Pending',
    date: '2026-08-09',
  },
  {
    id: 'ORD-3005',
    customer: 'Stark Industries',
    items: 5,
    total: 540.0,
    status: 'Delivered',
    date: '2026-08-02',
  },
  {
    id: 'ORD-3006',
    customer: 'Umbrella Group',
    items: 3,
    total: 245.75,
    status: 'Cancelled',
    date: '2026-07-28',
  },
  {
    id: 'ORD-3007',
    customer: 'Acme Inc',
    items: 6,
    total: 412.4,
    status: 'Shipped',
    date: '2026-08-07',
  },
  {
    id: 'ORD-3008',
    customer: 'Northwind Traders',
    items: 2,
    total: 158.0,
    status: 'Processing',
    date: '2026-08-10',
  },
]

export const statusVariant: Record<
  OrderStatus,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  Pending: 'secondary',
  Processing: 'secondary',
  Shipped: 'default',
  Delivered: 'default',
  Cancelled: 'destructive',
}
