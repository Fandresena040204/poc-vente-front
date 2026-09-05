import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
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

export function BarChartPage() {
  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Bar Chart</h2>
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
              <BarChart data={monthlyVisitors}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey='desktop' fill='var(--color-desktop)' radius={4} />
                <Bar dataKey='mobile' fill='var(--color-mobile)' radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
