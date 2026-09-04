import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  MoreHorizontal,
  ShoppingBag,
  Star,
  Users,
  Wallet,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const statCards = [
  {
    label: 'Total Revenue',
    value: '$48,820',
    change: '+12.4%',
    trend: 'up' as const,
    icon: Wallet,
  },
  {
    label: 'Customers',
    value: '36,358',
    change: '+9.0%',
    trend: 'up' as const,
    icon: Users,
  },
  {
    label: 'Orders',
    value: '1,204',
    change: '-3.2%',
    trend: 'down' as const,
    icon: ShoppingBag,
  },
]

const progressCards = [
  { label: 'Storage used', value: 72, detail: '72 GB of 100 GB used' },
  { label: 'Monthly goal', value: 45, detail: '$4,500 of $10,000' },
]

export function WidgetCardsPage() {
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
          <h2 className='text-2xl font-bold tracking-tight'>Cards</h2>
          <p className='text-muted-foreground'>
            A gallery of card layouts for stats, profiles, and actions.
          </p>
        </div>

        <div className='flex flex-col gap-6'>
          <section>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
              Stat cards
            </h3>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {statCards.map((stat) => (
                <Card key={stat.label}>
                  <CardHeader>
                    <CardDescription>{stat.label}</CardDescription>
                    <CardTitle className='text-2xl'>{stat.value}</CardTitle>
                    <CardAction>
                      <span className='flex size-9 items-center justify-center rounded-full bg-muted'>
                        <stat.icon className='size-4' />
                      </span>
                    </CardAction>
                  </CardHeader>
                  <CardFooter>
                    <Badge
                      variant={stat.trend === 'up' ? 'default' : 'destructive'}
                      className='gap-1'
                    >
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className='size-3' />
                      ) : (
                        <ArrowDownRight className='size-3' />
                      )}
                      {stat.change}
                    </Badge>
                    <span className='text-xs text-muted-foreground'>
                      vs last month
                    </span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
              Profile card
            </h3>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader>
                  <div className='flex items-center gap-3'>
                    <Avatar className='size-12'>
                      <AvatarImage src='/avatars/01.png' alt='Mathew' />
                      <AvatarFallback>MA</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>Mathew Anderson</CardTitle>
                      <CardDescription>Product Designer</CardDescription>
                    </div>
                    <CardAction>
                      <Button variant='ghost' size='icon'>
                        <MoreHorizontal className='size-4' />
                      </Button>
                    </CardAction>
                  </div>
                </CardHeader>
                <CardContent className='flex items-center gap-1 text-sm text-amber-500'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className='size-4 fill-current' />
                  ))}
                  <span className='ms-1 text-muted-foreground'>4.9 (128 reviews)</span>
                </CardContent>
                <CardFooter className='gap-2'>
                  <Button size='sm' className='flex-1'>
                    Follow
                  </Button>
                  <Button size='sm' variant='outline' className='flex-1'>
                    Message
                  </Button>
                </CardFooter>
              </Card>

              <Card className='overflow-hidden py-0'>
                <div className='h-28 bg-gradient-to-br from-primary/70 to-primary' />
                <CardContent className='pt-0'>
                  <Avatar className='-mt-8 size-16 border-4 border-card'>
                    <AvatarImage src='/avatars/02.png' alt='Sarah Lee' />
                    <AvatarFallback>SL</AvatarFallback>
                  </Avatar>
                  <CardTitle className='mt-2'>Sarah Lee</CardTitle>
                  <CardDescription>Frontend Engineer · Remote</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button size='sm' variant='outline' className='w-full'>
                    View Profile
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Invoice #4021</CardTitle>
                  <CardDescription>Due 20 Aug 2026</CardDescription>
                  <CardAction>
                    <Badge variant='secondary'>Pending</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className='text-2xl font-semibold'>$1,240.00</p>
                </CardContent>
                <CardFooter className='gap-2'>
                  <Button size='sm' className='flex-1'>
                    <Download className='size-4' />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>

          <section>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
              Progress cards
            </h3>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {progressCards.map((item) => (
                <Card key={item.label}>
                  <CardHeader>
                    <CardTitle className='text-base'>{item.label}</CardTitle>
                    <CardDescription>{item.detail}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
                      <div
                        className='h-full rounded-full bg-primary'
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <p className='mt-2 text-end text-xs text-muted-foreground'>
                      {item.value}%
                    </p>
                  </CardContent>
                </Card>
              ))}
              <Card className='justify-center bg-muted/30 text-center'>
                <CardContent>
                  <p className='text-3xl font-bold'>+248</p>
                  <p className='text-sm text-muted-foreground'>
                    New signups this week
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </Main>
    </>
  )
}
