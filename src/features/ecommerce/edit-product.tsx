import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { products } from '@/features/tables/data'
import { ProductForm } from './product-form'

export function EditProductPage() {
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
          <h2 className='text-2xl font-bold tracking-tight'>Edit Product</h2>
          <p className='text-muted-foreground'>
            Update details for {products[0].name}.
          </p>
        </div>
        <ProductForm mode='edit' initialProduct={products[0]} />
      </Main>
    </>
  )
}
