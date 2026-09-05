import { useState } from 'react'
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Info,
  LogOut,
  Settings,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DatePicker } from '@/components/date-picker'
import { Main } from '@/components/layout/main'

const accordionItems = [
  {
    title: 'What is this admin template built with?',
    content: 'React 19, Vite, TanStack Router, TailwindCSS 4, and shadcn/ui.',
  },
  {
    title: 'Can I customize the color palette?',
    content: 'Yes, tokens are defined as CSS variables in index.css.',
  },
  {
    title: 'Does it support dark mode?',
    content: 'Yes, toggle it from the theme switch in the header.',
  },
]

const carouselSlides = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5']

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className='flex flex-wrap items-center gap-3'>
        {children}
      </CardContent>
    </Card>
  )
}

function Accordion() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className='flex w-full flex-col gap-2'>
      {accordionItems.map((item, index) => (
        <Collapsible
          key={item.title}
          open={open === index}
          onOpenChange={(isOpen) => setOpen(isOpen ? index : null)}
          className='rounded-md border'
        >
          <CollapsibleTrigger className='flex w-full items-center justify-between p-3 text-start text-sm font-medium'>
            {item.title}
            <ChevronDown
              className={cn(
                'size-4 shrink-0 transition-transform',
                open === index && 'rotate-180'
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className='px-3 pb-3 text-sm text-muted-foreground'>
            {item.content}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}

export function UiElementsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>UI Elements</h2>
          <p className='text-muted-foreground'>
            A gallery of shadcn/ui components used across this admin.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <Section title='Avatar'>
            <Avatar>
              <AvatarImage src='/avatars/01.png' alt='User' />
              <AvatarFallback>FM</AvatarFallback>
            </Avatar>
            <Avatar className='size-12'>
              <AvatarFallback>SL</AvatarFallback>
            </Avatar>
            <Avatar className='size-8'>
              <AvatarFallback className='text-xs'>MA</AvatarFallback>
            </Avatar>
          </Section>

          <Section title='Badge'>
            <Badge>Default</Badge>
            <Badge variant='secondary'>Secondary</Badge>
            <Badge variant='destructive'>Destructive</Badge>
            <Badge variant='outline'>Outline</Badge>
          </Section>

          <Section title='Tooltip' description='Hover the button'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline'>Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Helpful hint appears here</TooltipContent>
            </Tooltip>
          </Section>

          <Section title='Skeleton' description='Loading placeholders'>
            <div className='flex items-center gap-3'>
              <Skeleton className='size-10 rounded-full' />
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-3 w-32' />
                <Skeleton className='h-3 w-24' />
              </div>
            </div>
          </Section>

          <Section title='Alert'>
            <div className='flex w-full flex-col gap-3'>
              <Alert>
                <Info />
                <AlertTitle>Heads up</AlertTitle>
                <AlertDescription>
                  This is a default informational alert.
                </AlertDescription>
              </Alert>
              <Alert variant='destructive'>
                <Trash2 />
                <AlertTitle>Danger</AlertTitle>
                <AlertDescription>
                  This action can't be undone.
                </AlertDescription>
              </Alert>
            </div>
          </Section>

          <Section title='Progress bar'>
            <div className='flex w-full flex-col gap-3'>
              {[35, 68, 90].map((value) => (
                <div key={value} className='flex items-center gap-3'>
                  <div className='h-2 flex-1 overflow-hidden rounded-full bg-muted'>
                    <div
                      className='h-full rounded-full bg-primary'
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className='w-10 text-end text-xs text-muted-foreground'>
                    {value}%
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section title='Breadcrumb'>
            <nav className='flex items-center gap-1 text-sm text-muted-foreground'>
              <span className='hover:text-foreground'>Home</span>
              <ChevronRight className='size-3.5' />
              <span className='hover:text-foreground'>Ecommerce</span>
              <ChevronRight className='size-3.5' />
              <span className='font-medium text-foreground'>
                Product Details
              </span>
            </nav>
          </Section>

          <Section title='Tabs'>
            <Tabs defaultValue='tab1' className='w-full'>
              <TabsList>
                <TabsTrigger value='tab1'>Account</TabsTrigger>
                <TabsTrigger value='tab2'>Password</TabsTrigger>
                <TabsTrigger value='tab3'>Team</TabsTrigger>
              </TabsList>
              <TabsContent
                value='tab1'
                className='text-sm text-muted-foreground'
              >
                Manage your account settings here.
              </TabsContent>
              <TabsContent
                value='tab2'
                className='text-sm text-muted-foreground'
              >
                Update your password here.
              </TabsContent>
              <TabsContent
                value='tab3'
                className='text-sm text-muted-foreground'
              >
                Invite and manage teammates.
              </TabsContent>
            </Tabs>
          </Section>

          <Section title='Dropdown'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  Open menu
                  <ChevronDown className='size-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className='size-4' />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className='size-4' />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant='destructive'>
                  <LogOut className='size-4' />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Section>

          <Section title='Accordion'>
            <Accordion />
          </Section>

          <Section title='Card'>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Sparkles className='size-4' />
                  Feature card
                </CardTitle>
                <CardDescription>A nested card example</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button size='sm' variant='outline'>
                  Learn more
                </Button>
              </CardFooter>
            </Card>
          </Section>

          <Section title='Carousel' description='Horizontal scroll-snap'>
            <div className='flex w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-2'>
              {carouselSlides.map((slide) => (
                <div
                  key={slide}
                  className='flex h-24 w-40 shrink-0 snap-start items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground'
                >
                  {slide}
                </div>
              ))}
            </div>
          </Section>

          <Section title='Dialog'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline'>Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete item</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the item.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant='outline'>Cancel</Button>
                  <Button variant='destructive'>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Section>

          <Section title='Drawer'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline'>
                  <Bell className='size-4' />
                  Open drawer
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                  <SheetDescription>
                    You have 3 unread notifications.
                  </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                  <Button className='w-full'>Mark all as read</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </Section>

          <Section title='Datepicker'>
            <DatePicker selected={selectedDate} onSelect={setSelectedDate} />
          </Section>
        </div>
      </Main>
    </>
  )
}
