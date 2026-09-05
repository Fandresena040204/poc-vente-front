import { RadialBar, RadialBarChart } from 'recharts'
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
import { Main } from '@/components/layout/main'
import { browserVisitors } from './data'

const chartConfig = {
  visitors: { label: 'Visitors' },
  chrome: { label: 'Chrome', color: 'var(--chart-1)' },
  safari: { label: 'Safari', color: 'var(--chart-2)' },
  firefox: { label: 'Firefox', color: 'var(--chart-3)' },
  edge: { label: 'Edge', color: 'var(--chart-4)' },
  other: { label: 'Other', color: 'var(--chart-5)' },
} satisfies ChartConfig

export function RadialChartPage() {
  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Radial Chart</h2>
          <p className='text-muted-foreground'>
            Showing total visitors by browser
          </p>
        </div>
        <Card className='flex flex-col'>
          <CardHeader>
            <CardTitle>Visitors by Browser</CardTitle>
            <CardDescription>Current period</CardDescription>
          </CardHeader>
          <CardContent className='flex-1'>
            <ChartContainer
              config={chartConfig}
              className='mx-auto aspect-square max-h-[300px]'
            >
              <RadialBarChart
                data={browserVisitors}
                innerRadius={30}
                outerRadius={110}
              >
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <RadialBar dataKey='visitors' background />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
