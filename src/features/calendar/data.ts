export type CalendarEvent = {
  id: string
  title: string
  date: string
  color: 'blue' | 'green' | 'amber' | 'rose' | 'violet'
}

const today = new Date()
const y = today.getFullYear()
const m = today.getMonth()

function d(day: number) {
  return new Date(y, m, day).toISOString().slice(0, 10)
}

export const calendarEvents: CalendarEvent[] = [
  { id: '1', title: 'Design review', date: d(2), color: 'blue' },
  { id: '2', title: 'Sprint planning', date: d(3), color: 'violet' },
  { id: '3', title: 'Client call', date: d(3), color: 'amber' },
  { id: '4', title: 'Release v2.4', date: d(5), color: 'green' },
  { id: '5', title: '1:1 with manager', date: d(8), color: 'blue' },
  { id: '6', title: 'Product demo', date: d(8), color: 'rose' },
  { id: '7', title: 'Team lunch', date: d(8), color: 'green' },
  { id: '8', title: 'QA handoff', date: d(11), color: 'amber' },
  { id: '9', title: 'Marketing sync', date: d(14), color: 'violet' },
  { id: '10', title: 'Board meeting', date: d(18), color: 'rose' },
  { id: '11', title: 'Hackathon', date: d(21), color: 'blue' },
  { id: '12', title: 'Payroll run', date: d(25), color: 'green' },
  { id: '13', title: 'Customer webinar', date: d(27), color: 'amber' },
]

export const colorClasses: Record<CalendarEvent['color'], string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  green:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  amber:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  violet:
    'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
}
