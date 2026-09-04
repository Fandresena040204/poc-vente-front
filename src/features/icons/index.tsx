import { useMemo, useState } from 'react'
import * as icons from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const iconEntries = Object.entries(icons).filter(
  (entry): entry is [string, icons.LucideIcon] =>
    entry[0] !== 'default' &&
    entry[0] !== 'createLucideIcon' &&
    entry[0][0] === entry[0][0].toUpperCase() &&
    typeof entry[1] === 'object' &&
    entry[1] !== null &&
    '$$typeof' in entry[1]
)

export function IconsPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return iconEntries
    return iconEntries.filter(([name]) => name.toLowerCase().includes(needle))
  }, [query])

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
    toast.success(`Copied "${name}"`)
  }

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
            <h2 className='text-2xl font-bold tracking-tight'>Icons</h2>
            <p className='text-muted-foreground'>
              {filtered.length} of {iconEntries.length} lucide-react icons.
              Click one to copy its name.
            </p>
          </div>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search icons...'
            className='sm:w-64'
          />
        </div>

        <Card>
          <CardContent>
            <div className='grid grid-cols-3 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10'>
              {filtered.slice(0, 300).map(([name, Icon]) => (
                <button
                  key={name}
                  type='button'
                  onClick={() => copyName(name)}
                  className='flex flex-col items-center gap-2 rounded-md border border-transparent p-3 text-center hover:border-border hover:bg-muted'
                  title={name}
                >
                  <Icon className='size-5' />
                  <span className='w-full truncate text-[10px] text-muted-foreground'>
                    {name}
                  </span>
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className='py-12 text-center text-sm text-muted-foreground'>
                No icons match "{query}".
              </p>
            )}
            {filtered.length > 300 && (
              <p className='mt-4 text-center text-xs text-muted-foreground'>
                Showing first 300 results. Refine your search to see more.
              </p>
            )}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
