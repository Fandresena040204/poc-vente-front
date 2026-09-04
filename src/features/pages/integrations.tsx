import { useState } from 'react'
import { Plug } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { integrations as initialIntegrations } from './data'

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(initialIntegrations)

  const toggle = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    )
  }

  const connectedCount = integrations.filter((i) => i.connected).length

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
          <h2 className='text-2xl font-bold tracking-tight'>Integrations</h2>
          <p className='text-muted-foreground'>
            {connectedCount} of {integrations.length} integrations connected.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <span className='flex size-10 items-center justify-center rounded-lg bg-muted'>
                    <Plug className='size-5' />
                  </span>
                  <div>
                    <CardTitle className='text-base'>
                      {integration.name}
                    </CardTitle>
                    <Badge variant='outline' className='mt-1'>
                      {integration.category}
                    </Badge>
                  </div>
                </div>
                <CardAction>
                  <Switch
                    checked={integration.connected}
                    onCheckedChange={() => toggle(integration.id)}
                  />
                </CardAction>
                <CardDescription className='pt-2'>
                  {integration.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Main>
    </>
  )
}
