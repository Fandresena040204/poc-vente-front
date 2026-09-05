import { useMemo, useState } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { products, statusLabels } from '@/features/tables/data'

export function ShopPage() {
  const [cart, setCart] = useState<Record<string, number>>({})

  const addToCart = (id: string) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))

  const removeFromCart = (id: string) =>
    setCart((prev) => {
      const next = { ...prev }
      if (!next[id]) return next
      next[id] -= 1
      if (next[id] <= 0) delete next[id]
      return next
    })

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    [cart]
  )
  const cartTotal = useMemo(
    () =>
      products.reduce(
        (sum, product) => sum + (cart[product.id] ?? 0) * product.price,
        0
      ),
    [cart]
  )

  return (
    <>
      <Main>
        <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Shop</h2>
            <p className='text-muted-foreground'>
              Browse the product catalog and add items to your cart.
            </p>
          </div>
          <Badge variant='secondary' className='w-fit gap-2 px-3 py-2 text-sm'>
            <ShoppingCart className='size-4' />
            {cartCount} items · ${cartTotal.toFixed(2)}
          </Badge>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {products.map((product) => {
            const qty = cart[product.id] ?? 0
            return (
              <Card key={product.id} className='overflow-hidden py-0'>
                <div className='flex h-28 items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-3xl font-semibold text-muted-foreground'>
                  {product.name.charAt(0)}
                </div>
                <CardContent className='flex flex-col gap-2 pt-4 pb-4'>
                  <div className='flex items-start justify-between gap-2'>
                    <p className='leading-snug font-medium'>{product.name}</p>
                    <Badge
                      variant={
                        product.status === 'in-stock'
                          ? 'default'
                          : product.status === 'low-stock'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className='shrink-0'
                    >
                      {statusLabels[product.status]}
                    </Badge>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {product.category}
                  </p>
                  <div className='flex items-center justify-between pt-2'>
                    <span className='text-lg font-semibold'>
                      ${product.price.toFixed(2)}
                    </span>
                    {qty === 0 ? (
                      <Button
                        size='sm'
                        onClick={() => addToCart(product.id)}
                        disabled={product.status === 'out-of-stock'}
                      >
                        Add to cart
                      </Button>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <Button
                          size='icon'
                          variant='outline'
                          className='size-7'
                          onClick={() => removeFromCart(product.id)}
                        >
                          <Minus className='size-3.5' />
                        </Button>
                        <span className='w-4 text-center text-sm'>{qty}</span>
                        <Button
                          size='icon'
                          variant='outline'
                          className='size-7'
                          onClick={() => addToCart(product.id)}
                        >
                          <Plus className='size-3.5' />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Main>
    </>
  )
}
