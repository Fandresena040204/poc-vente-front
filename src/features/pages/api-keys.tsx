import { useState } from 'react'
import { Copy, KeyRound, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { apiKeys as initialApiKeys } from './data'

function maskKey(key: string) {
  return `${key.slice(0, 8)}${'•'.repeat(10)}${key.slice(-4)}`
}

export function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState(initialApiKeys)

  const revoke = (id: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== id))
    toast.success('API key revoked')
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard')
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
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>API Keys</h2>
            <p className='text-muted-foreground'>
              Manage keys used to authenticate requests to the API.
            </p>
          </div>
          <Button>
            <Plus className='size-4' />
            Create key
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active keys</CardTitle>
            <CardDescription>
              {apiKeys.length} key{apiKeys.length === 1 ? '' : 's'} active
            </CardDescription>
            <CardAction>
              <KeyRound className='size-4 text-muted-foreground' />
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last used</TableHead>
                    <TableHead className='text-end'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className='font-medium'>{key.name}</TableCell>
                      <TableCell className='font-mono text-xs'>
                        {maskKey(key.key)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            key.scope === 'Full access' ? 'default' : 'secondary'
                          }
                        >
                          {key.scope}
                        </Badge>
                      </TableCell>
                      <TableCell>{key.created}</TableCell>
                      <TableCell>{key.lastUsed}</TableCell>
                      <TableCell className='text-end'>
                        <div className='flex justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => copyKey(key.key)}
                          >
                            <Copy className='size-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => revoke(key.id)}
                          >
                            <Trash2 className='size-4 text-destructive' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {apiKeys.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className='h-24 text-center'>
                        No API keys yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
