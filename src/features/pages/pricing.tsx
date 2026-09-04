import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { pricingTiers } from './data'

export function PricingPage() {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main>
        <div className='mb-8 text-center'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Simple, transparent pricing
          </h2>
          <p className='mx-auto mt-1 max-w-md text-muted-foreground'>
            Choose the plan that fits your team. Upgrade or downgrade at any
            time.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                'flex flex-col',
                tier.highlighted && 'border-primary shadow-lg'
              )}
            >
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  {tier.name}
                  {tier.highlighted && <Badge>Most popular</Badge>}
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className='flex-1'>
                <div className='mb-6 flex items-baseline gap-1'>
                  <span className='text-3xl font-bold'>{tier.price}</span>
                  <span className='text-sm text-muted-foreground'>
                    / {tier.period}
                  </span>
                </div>
                <ul className='flex flex-col gap-2 text-sm'>
                  {tier.features.map((feature) => (
                    <li key={feature} className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-primary' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className='w-full'
                  variant={tier.highlighted ? 'default' : 'outline'}
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className='mt-8'>
          <CardHeader>
            <CardTitle>Need a custom plan?</CardTitle>
            <CardDescription>
              Talk to our sales team for volume discounts and custom
              contracts.
            </CardDescription>
            <CardAction>
              <Button variant='outline'>Contact sales</Button>
            </CardAction>
          </CardHeader>
        </Card>
      </Main>
    </>
  )
}
