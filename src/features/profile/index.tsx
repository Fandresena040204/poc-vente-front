import { Camera, Mail, MapPin, Phone } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const stats = [
  { label: 'Projects', value: 24 },
  { label: 'Followers', value: '1.2k' },
  { label: 'Following', value: 186 },
]

const activity = [
  { text: 'Shipped the Advanced Filters example', time: '2h ago' },
  { text: 'Commented on Invoice PDF bug', time: '1d ago' },
  { text: 'Joined the Engineering team', time: '3d ago' },
]

export function ProfilePage() {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main>
        <Card className='mb-6 overflow-hidden py-0'>
          <div className='h-32 bg-gradient-to-r from-primary to-primary/60' />
          <CardContent className='flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between'>
            <div className='flex items-end gap-4'>
              <div className='relative -mt-12'>
                <Avatar className='size-24 border-4 border-card'>
                  <AvatarImage src='/avatars/01.png' alt='Fandresena' />
                  <AvatarFallback>FM</AvatarFallback>
                </Avatar>
                <Button
                  size='icon'
                  variant='secondary'
                  className='absolute bottom-0 end-0 size-7 rounded-full'
                >
                  <Camera className='size-3.5' />
                </Button>
              </div>
              <div>
                <h2 className='text-xl font-bold'>Fandresena</h2>
                <p className='text-sm text-muted-foreground'>
                  Full-stack Developer · Admin Template
                </p>
              </div>
            </div>
            <div className='flex gap-6'>
              {stats.map((stat) => (
                <div key={stat.label} className='text-center'>
                  <p className='text-lg font-semibold'>{stat.value}</p>
                  <p className='text-xs text-muted-foreground'>{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue='about'>
          <TabsList>
            <TabsTrigger value='about'>About</TabsTrigger>
            <TabsTrigger value='edit'>Edit Profile</TabsTrigger>
            <TabsTrigger value='activity'>Activity</TabsTrigger>
          </TabsList>

          <TabsContent value='about'>
            <div className='grid gap-4 lg:grid-cols-3'>
              <Card className='lg:col-span-2'>
                <CardContent className='flex flex-col gap-3'>
                  <h3 className='font-semibold'>Bio</h3>
                  <p className='text-sm text-muted-foreground'>
                    Building admin dashboards and internal tools. Enjoys
                    clean UI, fast tables, and dark mode.
                  </p>
                  <Separator />
                  <div className='flex flex-wrap gap-2'>
                    {['React', 'TypeScript', 'TanStack', 'Tailwind'].map(
                      (skill) => (
                        <Badge key={skill} variant='secondary'>
                          {skill}
                        </Badge>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='flex flex-col gap-3 text-sm'>
                  <span className='flex items-center gap-2 text-muted-foreground'>
                    <Mail className='size-4' />
                    fandresenamickael04@gmail.com
                  </span>
                  <span className='flex items-center gap-2 text-muted-foreground'>
                    <Phone className='size-4' />
                    +261 34 00 000 00
                  </span>
                  <span className='flex items-center gap-2 text-muted-foreground'>
                    <MapPin className='size-4' />
                    Antananarivo, Madagascar
                  </span>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='edit'>
            <Card>
              <CardContent className='grid gap-4 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='profile-name'>Full name</Label>
                  <Input id='profile-name' defaultValue='Fandresena' />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='profile-email'>Email</Label>
                  <Input
                    id='profile-email'
                    type='email'
                    defaultValue='fandresenamickael04@gmail.com'
                  />
                </div>
                <div className='flex flex-col gap-2 sm:col-span-2'>
                  <Label htmlFor='profile-bio'>Bio</Label>
                  <Textarea
                    id='profile-bio'
                    rows={4}
                    defaultValue='Building admin dashboards and internal tools.'
                  />
                </div>
                <Button className='w-fit sm:col-span-2'>Save changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='activity'>
            <Card>
              <CardContent className='flex flex-col gap-4'>
                {activity.map((item, index) => (
                  <div key={index} className='flex items-center justify-between'>
                    <p className='text-sm'>{item.text}</p>
                    <span className='text-xs text-muted-foreground'>
                      {item.time}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
