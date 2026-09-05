import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
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
import { monthlyVisitors } from './data'

const chartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function LineChartPage() {
  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Line Chart</h2>
          <p className='text-muted-foreground'>
            Showing total visitors for the last 6 months
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Visitors</CardTitle>
            <CardDescription>Desktop vs mobile</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart data={monthlyVisitors}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey='desktop'
                  type='monotone'
                  stroke='var(--color-desktop)'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey='mobile'
                  type='monotone'
                  stroke='var(--color-mobile)'
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
