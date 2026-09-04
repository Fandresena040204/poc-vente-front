import { useState } from 'react'
import { Minus, Plus, Star, Truck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { products, statusLabels } from '@/features/tables/data'

const product = products[1]
const thumbs = ['A', 'B', 'C', 'D']

export function ProductDetailsPage() {
  const [qty, setQty] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main>
        <div className='grid gap-6 lg:grid-cols-2'>
          <div className='flex flex-col gap-3'>
            <div className='flex h-80 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/50 text-6xl font-semibold text-muted-foreground'>
              {thumbs[activeThumb]}
            </div>
            <div className='flex gap-2'>
              {thumbs.map((thumb, index) => (
                <button
                  key={thumb}
                  onClick={() => setActiveThumb(index)}
                  className={`flex size-16 items-center justify-center rounded-md border text-lg font-medium text-muted-foreground ${
                    activeThumb === index ? 'border-primary' : 'border-border'
                  }`}
                >
                  {thumb}
                </button>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div>
              <Badge variant='outline'>{product.category}</Badge>
              <h2 className='mt-2 text-2xl font-bold tracking-tight'>
                {product.name}
              </h2>
              <div className='mt-1 flex items-center gap-1 text-amber-500'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className='size-4 fill-current' />
                ))}
                <span className='ms-1 text-sm text-muted-foreground'>
                  4.7 (312 reviews)
                </span>
              </div>
            </div>

            <p className='text-3xl font-bold'>${product.price.toFixed(2)}</p>

            <p className='text-sm text-muted-foreground'>
              A reliable, high-quality {product.name.toLowerCase()} built for
              everyday use. Backed by a 2-year warranty and free returns
              within 30 days.
            </p>

            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Truck className='size-4' />
              Free shipping · Delivery in 3-5 business days
            </div>

            <Badge
              variant={
                product.status === 'in-stock'
                  ? 'default'
                  : product.status === 'low-stock'
                    ? 'secondary'
                    : 'destructive'
              }
              className='w-fit'
            >
              {statusLabels[product.status]} · {product.stock} left
            </Badge>

            <Separator />

            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <Button
                  size='icon'
                  variant='outline'
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className='size-4' />
                </Button>
                <span className='w-6 text-center'>{qty}</span>
                <Button size='icon' variant='outline' onClick={() => setQty((q) => q + 1)}>
                  <Plus className='size-4' />
                </Button>
              </div>
              <Button className='flex-1'>Add to cart</Button>
              <Button variant='outline' className='flex-1'>
                Buy now
              </Button>
            </div>
          </div>
        </div>

        <Card className='mt-8'>
          <CardContent>
            <Tabs defaultValue='description'>
              <TabsList>
                <TabsTrigger value='description'>Description</TabsTrigger>
                <TabsTrigger value='specs'>Specifications</TabsTrigger>
                <TabsTrigger value='reviews'>Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value='description' className='text-sm text-muted-foreground'>
                Designed for comfort and durability, the {product.name} fits
                seamlessly into any workspace. Its minimalist design pairs
                well with any desk setup.
              </TabsContent>
              <TabsContent value='specs' className='text-sm text-muted-foreground'>
                <ul className='flex flex-col gap-1'>
                  <li>Category: {product.category}</li>
                  <li>SKU: {product.id}</li>
                  <li>Last updated: {product.updatedAt}</li>
                </ul>
              </TabsContent>
              <TabsContent value='reviews' className='text-sm text-muted-foreground'>
                No written reviews yet — be the first to leave one.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
