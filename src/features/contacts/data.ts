export type Contact = {
  id: string
  name: string
  initials: string
  role: string
  company: string
  email: string
  phone: string
  location: string
  tags: string[]
}

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Lee',
    initials: 'SL',
    role: 'Frontend Engineer',
    company: 'Acme Inc',
    email: 'sarah.lee@acme.com',
    phone: '+1 (555) 210-3344',
    location: 'Remote',
    tags: ['Engineering'],
  },
  {
    id: '2',
    name: 'Mathew Anderson',
    initials: 'MA',
    role: 'Product Designer',
    company: 'Acme Inc',
    email: 'mathew.a@acme.com',
    phone: '+1 (555) 452-9981',
    location: 'New York, US',
    tags: ['Design'],
  },
  {
    id: '3',
    name: 'Jonathan Doe',
    initials: 'JD',
    role: 'Engineering Manager',
    company: 'Acme Inc',
    email: 'jonathan.doe@acme.com',
    phone: '+1 (555) 771-2290',
    location: 'Austin, US',
    tags: ['Engineering', 'Management'],
  },
  {
    id: '4',
    name: 'Priya Nair',
    initials: 'PN',
    role: 'Marketing Lead',
    company: 'Northwind Traders',
    email: 'priya.nair@northwind.com',
    phone: '+44 20 7946 0958',
    location: 'London, UK',
    tags: ['Marketing'],
  },
  {
    id: '5',
    name: 'Carlos Mendes',
    initials: 'CM',
    role: 'Sales Director',
    company: 'Globex Corp',
    email: 'carlos.mendes@globex.com',
    phone: '+55 11 98765-4321',
    location: 'São Paulo, BR',
    tags: ['Sales'],
  },
  {
    id: '6',
    name: 'Hana Kobayashi',
    initials: 'HK',
    role: 'Customer Success',
    company: 'Initech',
    email: 'hana.k@initech.com',
    phone: '+81 3-1234-5678',
    location: 'Tokyo, JP',
    tags: ['Support'],
  },
  {
    id: '7',
    name: 'Liam O\'Connor',
    initials: 'LO',
    role: 'Backend Engineer',
    company: 'Acme Inc',
    email: 'liam.oconnor@acme.com',
    phone: '+353 1 234 5678',
    location: 'Dublin, IE',
    tags: ['Engineering'],
  },
  {
    id: '8',
    name: 'Fatima Zahra',
    initials: 'FZ',
    role: 'Finance Manager',
    company: 'Umbrella Group',
    email: 'fatima.zahra@umbrella.com',
    phone: '+971 4 123 4567',
    location: 'Dubai, AE',
    tags: ['Finance'],
  },
]
