import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
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

export function AreaChartPage() {
  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Area Chart</h2>
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
              <AreaChart data={monthlyVisitors}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey='mobile'
                  type='natural'
                  fill='var(--color-mobile)'
                  fillOpacity={0.4}
                  stroke='var(--color-mobile)'
                  stackId='a'
                />
                <Area
                  dataKey='desktop'
                  type='natural'
                  fill='var(--color-desktop)'
                  fillOpacity={0.4}
                  stroke='var(--color-desktop)'
                  stackId='a'
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
