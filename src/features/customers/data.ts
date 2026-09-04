export type Customer = {
  id: string
  name: string
  initials: string
  email: string
  company: string
  orders: number
  totalSpent: number
  status: 'Active' | 'Inactive'
  joined: string
}

export const customers: Customer[] = [
  {
    id: 'CUS-001',
    name: 'Northwind Traders',
    initials: 'NT',
    email: 'billing@northwind.com',
    company: 'Northwind Traders',
    orders: 34,
    totalSpent: 12480,
    status: 'Active',
    joined: '2025-02-14',
  },
  {
    id: 'CUS-002',
    name: 'Globex Corp',
    initials: 'GC',
    email: 'ap@globex.com',
    company: 'Globex Corp',
    orders: 21,
    totalSpent: 8760,
    status: 'Active',
    joined: '2025-05-03',
  },
  {
    id: 'CUS-003',
    name: 'Initech',
    initials: 'IN',
    email: 'finance@initech.com',
    company: 'Initech',
    orders: 9,
    totalSpent: 2140,
    status: 'Active',
    joined: '2025-08-21',
  },
  {
    id: 'CUS-004',
    name: 'Umbrella Group',
    initials: 'UG',
    email: 'accounts@umbrella.com',
    company: 'Umbrella Group',
    orders: 47,
    totalSpent: 20310,
    status: 'Active',
    joined: '2024-11-09',
  },
  {
    id: 'CUS-005',
    name: 'Acme Inc',
    initials: 'AI',
    email: 'billing@acme.com',
    company: 'Acme Inc',
    orders: 3,
    totalSpent: 340,
    status: 'Inactive',
    joined: '2026-01-18',
  },
  {
    id: 'CUS-006',
    name: 'Wayne Enterprises',
    initials: 'WE',
    email: 'procurement@wayne.com',
    company: 'Wayne Enterprises',
    orders: 62,
    totalSpent: 35800,
    status: 'Active',
    joined: '2024-06-30',
  },
  {
    id: 'CUS-007',
    name: 'Stark Industries',
    initials: 'SI',
    email: 'ap@stark.com',
    company: 'Stark Industries',
    orders: 15,
    totalSpent: 6120,
    status: 'Inactive',
    joined: '2025-09-12',
  },
]
