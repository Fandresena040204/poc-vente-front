export type ProductStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export type Product = {
  id: string
  name: string
  category: string
  status: ProductStatus
  price: number
  stock: number
  updatedAt: string
}

export const statusLabels: Record<ProductStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
}

export const products: Product[] = [
  {
    id: 'PRD-001',
    name: 'Wireless Mouse',
    category: 'Accessories',
    status: 'in-stock',
    price: 29.99,
    stock: 142,
    updatedAt: '2026-07-02',
  },
  {
    id: 'PRD-002',
    name: 'Mechanical Keyboard',
    category: 'Accessories',
    status: 'in-stock',
    price: 89.99,
    stock: 58,
    updatedAt: '2026-07-10',
  },
  {
    id: 'PRD-003',
    name: '27" Monitor',
    category: 'Displays',
    status: 'low-stock',
    price: 249.0,
    stock: 6,
    updatedAt: '2026-07-15',
  },
  {
    id: 'PRD-004',
    name: 'USB-C Hub',
    category: 'Accessories',
    status: 'in-stock',
    price: 39.5,
    stock: 76,
    updatedAt: '2026-07-18',
  },
  {
    id: 'PRD-005',
    name: 'Laptop Stand',
    category: 'Accessories',
    status: 'out-of-stock',
    price: 45.0,
    stock: 0,
    updatedAt: '2026-06-28',
  },
  {
    id: 'PRD-006',
    name: 'Webcam 1080p',
    category: 'Peripherals',
    status: 'in-stock',
    price: 59.99,
    stock: 34,
    updatedAt: '2026-07-20',
  },
  {
    id: 'PRD-007',
    name: 'Noise Cancelling Headset',
    category: 'Audio',
    status: 'low-stock',
    price: 129.0,
    stock: 4,
    updatedAt: '2026-07-22',
  },
  {
    id: 'PRD-008',
    name: 'Desk Lamp',
    category: 'Office',
    status: 'in-stock',
    price: 24.99,
    stock: 210,
    updatedAt: '2026-07-05',
  },
  {
    id: 'PRD-009',
    name: 'Ergonomic Chair',
    category: 'Office',
    status: 'in-stock',
    price: 349.0,
    stock: 12,
    updatedAt: '2026-07-11',
  },
  {
    id: 'PRD-010',
    name: 'Portable SSD 1TB',
    category: 'Storage',
    status: 'in-stock',
    price: 99.0,
    stock: 88,
    updatedAt: '2026-07-19',
  },
  {
    id: 'PRD-011',
    name: 'Graphics Tablet',
    category: 'Peripherals',
    status: 'out-of-stock',
    price: 179.0,
    stock: 0,
    updatedAt: '2026-06-30',
  },
  {
    id: 'PRD-012',
    name: 'Bluetooth Speaker',
    category: 'Audio',
    status: 'low-stock',
    price: 69.99,
    stock: 9,
    updatedAt: '2026-07-23',
  },
]

export const invoiceSummary = [
  { invoice: 'INV-1001', customer: 'Acme Corp.', amount: 1250.0, status: 'Paid' },
  { invoice: 'INV-1002', customer: 'Globex Inc.', amount: 890.5, status: 'Pending' },
  { invoice: 'INV-1003', customer: 'Initech', amount: 430.0, status: 'Paid' },
  { invoice: 'INV-1004', customer: 'Umbrella LLC', amount: 2100.0, status: 'Overdue' },
  { invoice: 'INV-1005', customer: 'Soylent Co.', amount: 150.75, status: 'Paid' },
]

export const teamMembers = [
  { name: 'Alice Martin', role: 'Product Designer', team: 'Design', status: 'Active' },
  { name: 'Bruno Rakoto', role: 'Backend Engineer', team: 'Engineering', status: 'Active' },
  { name: 'Chloé Rasoanaivo', role: 'QA Engineer', team: 'Engineering', status: 'Away' },
  { name: 'David Andria', role: 'Sales Lead', team: 'Sales', status: 'Active' },
  { name: 'Elodie Ravao', role: 'HR Manager', team: 'People', status: 'Offline' },
]
