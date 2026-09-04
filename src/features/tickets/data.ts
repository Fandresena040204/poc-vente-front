export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export type Ticket = {
  id: string
  subject: string
  customer: string
  status: TicketStatus
  priority: TicketPriority
  assignee: string
  updated: string
}

export const tickets: Ticket[] = [
  {
    id: 'TCK-1042',
    subject: 'Unable to export CSV from data table',
    customer: 'Northwind Traders',
    status: 'Open',
    priority: 'High',
    assignee: 'Sarah Lee',
    updated: '2026-08-12',
  },
  {
    id: 'TCK-1041',
    subject: 'Dashboard charts not loading on Safari',
    customer: 'Globex Corp',
    status: 'In Progress',
    priority: 'Urgent',
    assignee: 'Jonathan Doe',
    updated: '2026-08-11',
  },
  {
    id: 'TCK-1040',
    subject: 'Question about role based permissions',
    customer: 'Initech',
    status: 'Open',
    priority: 'Low',
    assignee: 'Unassigned',
    updated: '2026-08-11',
  },
  {
    id: 'TCK-1039',
    subject: 'Invoice PDF shows wrong tax total',
    customer: 'Umbrella Group',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Mathew Anderson',
    updated: '2026-08-10',
  },
  {
    id: 'TCK-1038',
    subject: 'Request: bulk delete for tasks',
    customer: 'Acme Inc',
    status: 'Resolved',
    priority: 'Medium',
    assignee: 'Sarah Lee',
    updated: '2026-08-09',
  },
  {
    id: 'TCK-1037',
    subject: 'Slack integration stopped sending alerts',
    customer: 'Northwind Traders',
    status: 'Resolved',
    priority: 'Medium',
    assignee: 'Jonathan Doe',
    updated: '2026-08-08',
  },
  {
    id: 'TCK-1036',
    subject: 'Cannot reset password via email link',
    customer: 'Globex Corp',
    status: 'Closed',
    priority: 'Urgent',
    assignee: 'Mathew Anderson',
    updated: '2026-08-05',
  },
  {
    id: 'TCK-1035',
    subject: 'Feature request: dark mode for print view',
    customer: 'Initech',
    status: 'Closed',
    priority: 'Low',
    assignee: 'Sarah Lee',
    updated: '2026-08-02',
  },
]

export const statusVariant: Record<
  TicketStatus,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  Open: 'secondary',
  'In Progress': 'default',
  Resolved: 'outline',
  Closed: 'outline',
}

export const priorityClasses: Record<TicketPriority, string> = {
  Low: 'bg-muted text-muted-foreground',
  Medium:
    'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  High: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
}
