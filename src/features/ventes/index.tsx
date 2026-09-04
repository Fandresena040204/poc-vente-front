import { getRouteApi } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useCustomers } from '@/features/customers/hooks'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { VentesDialogs } from './components/ventes-dialogs'
import { VentesPrimaryButtons } from './components/ventes-primary-buttons'
import { VentesProvider } from './components/ventes-provider'
import { VentesTable } from './components/ventes-table'
import { useVentes } from './hooks'

const route = getRouteApi('/_authenticated/ventes/')

export function Ventes() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { data: ventes, isLoading, isError } = useVentes()
  const { data: customers, isLoading: isLoadingCustomers } = useCustomers()

  const loading = isLoading || isLoadingCustomers

  return (
    <VentesProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Ventes</h2>
            <p className='text-muted-foreground'>Manage your ventes here.</p>
          </div>
          <VentesPrimaryButtons />
        </div>
        {loading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='animate-spin' />
          </div>
        ) : isError ? (
          <p className='text-destructive'>Failed to load ventes.</p>
        ) : (
          <VentesTable
            data={ventes ?? []}
            customers={customers ?? []}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>

      <VentesDialogs />
    </VentesProvider>
  )
}
