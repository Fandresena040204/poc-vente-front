export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft'

export type InvoiceItem = {
  description: string
  quantity: number
  price: number
}

export type Invoice = {
  id: string
  customer: string
  email: string
  status: InvoiceStatus
  issued: string
  due: string
  items: InvoiceItem[]
}

export const invoices: Invoice[] = [
  {
    id: 'INV-2041',
    customer: 'Northwind Traders',
    email: 'billing@northwind.com',
    status: 'Paid',
    issued: '2026-07-01',
    due: '2026-07-15',
    items: [
      { description: 'Pro plan · August', quantity: 1, price: 29 },
      { description: 'Extra seats (3)', quantity: 3, price: 9 },
    ],
  },
  {
    id: 'INV-2042',
    customer: 'Globex Corp',
    email: 'ap@globex.com',
    status: 'Pending',
    issued: '2026-07-20',
    due: '2026-08-20',
    items: [
      { description: 'Enterprise plan · August', quantity: 1, price: 499 },
    ],
  },
  {
    id: 'INV-2043',
    customer: 'Initech',
    email: 'finance@initech.com',
    status: 'Overdue',
    issued: '2026-06-15',
    due: '2026-07-15',
    items: [
      { description: 'Pro plan · July', quantity: 1, price: 29 },
      { description: 'API overage', quantity: 1200, price: 0.01 },
    ],
  },
  {
    id: 'INV-2044',
    customer: 'Umbrella Group',
    email: 'accounts@umbrella.com',
    status: 'Paid',
    issued: '2026-07-25',
    due: '2026-08-08',
    items: [
      { description: 'Enterprise plan · August', quantity: 1, price: 499 },
    ],
  },
  {
    id: 'INV-2045',
    customer: 'Acme Inc',
    email: 'billing@acme.com',
    status: 'Draft',
    issued: '2026-08-10',
    due: '2026-08-24',
    items: [{ description: 'Pro plan · September', quantity: 1, price: 29 }],
  },
]

export function invoiceTotal(invoice: Invoice) {
  return invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  )
}

export const statusVariant: Record<
  InvoiceStatus,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  Paid: 'default',
  Pending: 'secondary',
  Overdue: 'destructive',
  Draft: 'outline',
}
