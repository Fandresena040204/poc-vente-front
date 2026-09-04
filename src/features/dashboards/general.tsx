import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import {
  CheckCircle2,
  Clock,
  ListTodo,
  MessageSquare,
  TrendingUp,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const productivityTrend = [
  { week: 'W1', tasks: 18 },
  { week: 'W2', tasks: 24 },
  { week: 'W3', tasks: 20 },
  { week: 'W4', tasks: 31 },
  { week: 'W5', tasks: 27 },
  { week: 'W6', tasks: 35 },
]

const stats = [
  { label: 'Tasks completed', value: '128', icon: CheckCircle2 },
  { label: 'Tasks in progress', value: '14', icon: ListTodo },
  { label: 'Avg. response time', value: '2.4h', icon: Clock },
  { label: 'Open conversations', value: '9', icon: MessageSquare },
]

const activity = [
  { text: 'Sarah Lee completed "Fix pagination reset bug"', time: '10m ago' },
  { text: 'Mathew Anderson commented on Invoice #4021', time: '42m ago' },
  { text: 'Jonathan Doe moved "Rebuild sidebar" to In Progress', time: '1h ago' },
  { text: 'New ticket opened: Unable to export CSV', time: '2h ago' },
  { text: 'Fandresena shipped the Advanced Filters example', time: '3h ago' },
]

export function GeneralDashboard() {
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
            General Dashboard
          </h2>
          <p className='text-muted-foreground'>
            A quick overview of team activity and productivity.
          </p>
        </div>

        <div className='mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className='flex items-center gap-3'>
                <span className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                  <stat.icon className='size-5' />
                </span>
                <div>
                  <p className='text-xl font-semibold'>{stat.value}</p>
                  <p className='text-xs text-muted-foreground'>{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='grid gap-4 lg:grid-cols-7'>
          <Card className='lg:col-span-4'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='size-4' />
                Productivity trend
              </CardTitle>
              <CardDescription>Tasks completed per week</CardDescription>
            </CardHeader>
            <CardContent className='ps-0'>
              <ResponsiveContainer width='100%' height={260}>
                <LineChart data={productivityTrend}>
                  <XAxis
                    dataKey='week'
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
                  />
                  <Line
                    type='monotone'
                    dataKey='tasks'
                    stroke='currentColor'
                    className='text-primary'
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className='lg:col-span-3'>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
              {activity.map((item, index) => (
                <div key={index} className='flex items-start justify-between gap-3 text-sm'>
                  <p>{item.text}</p>
                  <span className='shrink-0 text-xs text-muted-foreground'>
                    {item.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
