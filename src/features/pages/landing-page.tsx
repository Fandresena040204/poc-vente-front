import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Table2,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Main } from '@/components/layout/main'

const features = [
  {
    icon: BarChart3,
    title: 'Real-time analytics',
    description: 'Track every metric that matters with live dashboards.',
  },
  {
    icon: Table2,
    title: 'Powerful data tables',
    description: 'Sort, filter, export, and build multi-criteria queries.',
  },
  {
    icon: ShieldCheck,
    title: 'Role based access',
    description: 'Fine-grained permissions for every team member.',
  },
  {
    icon: Zap,
    title: 'Built for speed',
    description: 'A snappy interface powered by React and Vite.',
  },
]

export function LandingPage() {
  return (
    <>
      <Main>
        <section className='flex flex-col items-center gap-6 rounded-xl border bg-gradient-to-b from-muted/50 to-transparent px-6 py-16 text-center'>
          <span className='inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground'>
            <Sparkles className='size-3.5' />
            Now with advanced multi-criteria filters
          </span>
          <h1 className='max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl'>
            Manage your product from a single dashboard
          </h1>
          <p className='max-w-xl text-muted-foreground'>
            Everything you need to run your business — analytics, tables,
            orders, and team management — in one fast, clean admin.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <Button size='lg'>
              Get started free
              <ArrowRight className='size-4' />
            </Button>
            <Button size='lg' variant='outline'>
              View demo
            </Button>
          </div>
        </section>

        <section className='mt-12'>
          <div className='mb-8 text-center'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Everything you need, built in
            </h2>
            <p className='mt-1 text-muted-foreground'>
              No plugins to install, no extra config.
            </p>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className='flex flex-col gap-3'>
                  <span className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <feature.icon className='size-5' />
                  </span>
                  <p className='font-semibold'>{feature.title}</p>
                  <p className='text-sm text-muted-foreground'>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className='mt-12'>
          <Card className='overflow-hidden border-none bg-gradient-to-r from-primary to-primary/70 text-primary-foreground'>
            <CardContent className='flex flex-col items-center gap-4 py-8 text-center'>
              <h2 className='text-2xl font-bold'>Ready to get started?</h2>
              <p className='max-w-md text-primary-foreground/80'>
                Join thousands of teams already using this dashboard to run
                their operations.
              </p>
              <Button size='lg' variant='secondary'>
                Create your account
                <ArrowRight className='size-4' />
              </Button>
            </CardContent>
          </Card>
        </section>
      </Main>
    </>
  )
}
