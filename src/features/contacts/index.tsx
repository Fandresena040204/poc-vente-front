import { useState } from 'react'
import { Mail, MapPin, Phone, Search as SearchIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { contacts } from './data'

export function ContactsPage() {
  const [query, setQuery] = useState('')

  const filtered = contacts.filter((contact) =>
    `${contact.name} ${contact.company} ${contact.role}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main>
        <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Contacts</h2>
            <p className='text-muted-foreground'>
              {filtered.length} of {contacts.length} contacts
            </p>
          </div>
          <div className='relative sm:w-64'>
            <SearchIcon className='absolute start-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search contacts...'
              className='ps-8'
            />
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filtered.map((contact) => (
            <Card key={contact.id}>
              <CardContent className='flex flex-col gap-3'>
                <div className='flex items-center gap-3'>
                  <Avatar className='size-12'>
                    <AvatarFallback>{contact.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-semibold'>{contact.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {contact.role} · {contact.company}
                    </p>
                  </div>
                </div>
                <div className='flex flex-col gap-1.5 text-sm text-muted-foreground'>
                  <span className='flex items-center gap-2'>
                    <Mail className='size-3.5' />
                    {contact.email}
                  </span>
                  <span className='flex items-center gap-2'>
                    <Phone className='size-3.5' />
                    {contact.phone}
                  </span>
                  <span className='flex items-center gap-2'>
                    <MapPin className='size-3.5' />
                    {contact.location}
                  </span>
                </div>
                <div className='flex flex-wrap gap-1'>
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className='col-span-full py-12 text-center text-sm text-muted-foreground'>
              No contacts match "{query}".
            </p>
          )}
        </div>
      </Main>
    </>
  )
}
