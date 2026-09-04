export type PricingTier = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'For solo builders trying things out.',
    features: [
      'Up to 3 projects',
      '1 GB storage',
      'Community support',
      'Basic analytics',
    ],
    cta: 'Get started',
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'For growing teams that need more power.',
    features: [
      'Unlimited projects',
      '50 GB storage',
      'Priority support',
      'Advanced analytics',
      'Role based access control',
    ],
    highlighted: true,
    cta: 'Start free trial',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For organizations with custom needs.',
    features: [
      'Unlimited everything',
      'Dedicated support engineer',
      'Custom integrations',
      'SSO & audit logs',
      'Uptime SLA',
    ],
    cta: 'Contact sales',
  },
]

export type Role = {
  name: string
  description: string
  users: number
}

export const roles: Role[] = [
  { name: 'Owner', description: 'Full access to everything', users: 1 },
  { name: 'Admin', description: 'Manage users and settings', users: 3 },
  { name: 'Editor', description: 'Create and edit content', users: 8 },
  { name: 'Viewer', description: 'Read-only access', users: 24 },
]

export const permissionGroups: {
  group: string
  permissions: string[]
}[] = [
  { group: 'Dashboard', permissions: ['View', 'Export'] },
  { group: 'Users', permissions: ['View', 'Create', 'Edit', 'Delete'] },
  { group: 'Billing', permissions: ['View', 'Manage'] },
  { group: 'Settings', permissions: ['View', 'Edit'] },
]

export const defaultRoleAccess: Record<string, Record<string, boolean>> = {
  Owner: {
    'Dashboard:View': true,
    'Dashboard:Export': true,
    'Users:View': true,
    'Users:Create': true,
    'Users:Edit': true,
    'Users:Delete': true,
    'Billing:View': true,
    'Billing:Manage': true,
    'Settings:View': true,
    'Settings:Edit': true,
  },
  Admin: {
    'Dashboard:View': true,
    'Dashboard:Export': true,
    'Users:View': true,
    'Users:Create': true,
    'Users:Edit': true,
    'Users:Delete': false,
    'Billing:View': true,
    'Billing:Manage': false,
    'Settings:View': true,
    'Settings:Edit': true,
  },
  Editor: {
    'Dashboard:View': true,
    'Dashboard:Export': false,
    'Users:View': true,
    'Users:Create': false,
    'Users:Edit': false,
    'Users:Delete': false,
    'Billing:View': false,
    'Billing:Manage': false,
    'Settings:View': true,
    'Settings:Edit': false,
  },
  Viewer: {
    'Dashboard:View': true,
    'Dashboard:Export': false,
    'Users:View': true,
    'Users:Create': false,
    'Users:Edit': false,
    'Users:Delete': false,
    'Billing:View': false,
    'Billing:Manage': false,
    'Settings:View': true,
    'Settings:Edit': false,
  },
}

export type Integration = {
  id: string
  name: string
  description: string
  category: string
  connected: boolean
}

export const integrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notified about activity directly in Slack.',
    category: 'Communication',
    connected: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Sync issues and pull requests automatically.',
    category: 'Developer tools',
    connected: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept payments and manage subscriptions.',
    category: 'Payments',
    connected: false,
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to thousands of apps without code.',
    category: 'Automation',
    connected: false,
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track traffic and user behaviour.',
    category: 'Analytics',
    connected: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync docs and knowledge base pages.',
    category: 'Productivity',
    connected: false,
  },
]

export type ApiKey = {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
  scope: 'Full access' | 'Read only'
}

export const apiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production',
    key: 'sk_live_51Hd9r2K8Xj3nQe7mZ',
    created: '2026-01-14',
    lastUsed: '2026-08-10',
    scope: 'Full access',
  },
  {
    id: '2',
    name: 'Staging',
    key: 'sk_test_9fA1cP0mV5uT8wY2',
    created: '2026-03-02',
    lastUsed: '2026-08-05',
    scope: 'Full access',
  },
  {
    id: '3',
    name: 'Analytics dashboard',
    key: 'sk_read_3rE6nB4kL1oQ9zX',
    created: '2026-05-20',
    lastUsed: '2026-07-30',
    scope: 'Read only',
  },
]
