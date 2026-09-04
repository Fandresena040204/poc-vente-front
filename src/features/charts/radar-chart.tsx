import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { monthlyVisitors } from './data'

const chartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function RadarChartPage() {
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
          <h2 className='text-2xl font-bold tracking-tight'>Radar Chart</h2>
          <p className='text-muted-foreground'>
            Showing desktop visitors for the last 6 months
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Visitors</CardTitle>
            <CardDescription>Desktop</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className='mx-auto aspect-square max-h-[300px]'
            >
              <RadarChart data={monthlyVisitors}>
                <ChartTooltip content={<ChartTooltipContent />} />
                <PolarAngleAxis dataKey='month' />
                <PolarGrid />
                <Radar
                  dataKey='desktop'
                  fill='var(--color-desktop)'
                  fillOpacity={0.6}
                  stroke='var(--color-desktop)'
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
