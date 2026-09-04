import { useState } from 'react'
import {
  Archive,
  File,
  Inbox,
  Reply,
  Search as SearchIcon,
  Send,
  Star,
  Trash2,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { emails, type Email } from './data'

const folders: { id: Email['folder']; label: string; icon: typeof Inbox }[] = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'drafts', label: 'Drafts', icon: File },
  { id: 'starred', label: 'Starred', icon: Star },
]

export function MailPage() {
  const [folder, setFolder] = useState<Email['folder']>('inbox')
  const [query, setQuery] = useState('')
  const folderEmails = emails.filter((email) => email.folder === folder)
  const [selectedId, setSelectedId] = useState<string | undefined>(
    folderEmails[0]?.id
  )

  const filtered = folderEmails.filter((email) =>
    `${email.subject} ${email.from}`.toLowerCase().includes(query.toLowerCase())
  )
  const selected =
    filtered.find((email) => email.id === selectedId) ?? filtered[0]

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main fixed>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Email</h2>
          <p className='text-muted-foreground'>
            {emails.filter((e) => e.unread).length} unread messages
          </p>
        </div>

        <div className='flex flex-1 overflow-hidden rounded-lg border'>
          <div className='flex w-44 shrink-0 flex-col gap-1 border-e bg-muted/20 p-2'>
            {folders.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setFolder(item.id)
                  setSelectedId(undefined)
                }}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted',
                  folder === item.id && 'bg-muted font-medium'
                )}
              >
                <item.icon className='size-4' />
                {item.label}
                {item.id === 'inbox' && (
                  <Badge variant='secondary' className='ms-auto'>
                    {emails.filter((e) => e.folder === 'inbox' && e.unread).length}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          <div className='flex w-80 shrink-0 flex-col border-e'>
            <div className='border-b p-2'>
              <div className='relative'>
                <SearchIcon className='absolute start-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder='Search mail...'
                  className='ps-8'
                />
              </div>
            </div>
            <div className='flex-1 overflow-y-auto'>
              {filtered.map((email) => (
                <button
                  key={email.id}
                  onClick={() => setSelectedId(email.id)}
                  className={cn(
                    'flex w-full flex-col gap-1 border-b p-3 text-start hover:bg-muted/50',
                    selected?.id === email.id && 'bg-muted'
                  )}
                >
                  <div className='flex items-center justify-between'>
                    <span
                      className={cn(
                        'text-sm',
                        email.unread ? 'font-semibold' : 'font-medium'
                      )}
                    >
                      {email.from}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {email.date}
                    </span>
                  </div>
                  <p className='truncate text-sm'>{email.subject}</p>
                  <p className='truncate text-xs text-muted-foreground'>
                    {email.preview}
                  </p>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className='p-6 text-center text-sm text-muted-foreground'>
                  No emails found.
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-1 flex-col'>
            {selected ? (
              <>
                <div className='flex items-center justify-between border-b p-3'>
                  <div className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarFallback>{selected.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>{selected.from}</p>
                      <p className='text-xs text-muted-foreground'>
                        {selected.date}
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-1'>
                    <Button variant='ghost' size='icon'>
                      <Reply className='size-4' />
                    </Button>
                    <Button variant='ghost' size='icon'>
                      <Archive className='size-4' />
                    </Button>
                    <Button variant='ghost' size='icon'>
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </div>
                <div className='flex-1 overflow-y-auto p-4'>
                  <h3 className='mb-3 text-lg font-semibold'>
                    {selected.subject}
                  </h3>
                  <Separator className='mb-3' />
                  <p className='whitespace-pre-line text-sm leading-relaxed'>
                    {selected.body}
                  </p>
                </div>
              </>
            ) : (
              <div className='flex flex-1 items-center justify-center text-sm text-muted-foreground'>
                No message selected
              </div>
            )}
          </div>
        </div>
      </Main>
    </>
  )
}
