import { useState } from 'react'
import { CreditCard, Landmark, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { products } from '@/features/tables/data'

const cartItems = [
  { product: products[0], qty: 1 },
  { product: products[2], qty: 2 },
]

const paymentMethods = [
  { value: 'card', label: 'Credit card', icon: CreditCard },
  { value: 'bank', label: 'Bank transfer', icon: Landmark },
  { value: 'wallet', label: 'Digital wallet', icon: Wallet },
]

export function CheckoutPage() {
  const [payment, setPayment] = useState('card')

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  )
  const shipping = 9.99
  const total = subtotal + shipping

  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Checkout</h2>
          <p className='text-muted-foreground'>
            Review your order and complete your purchase.
          </p>
        </div>

        <div className='grid gap-4 lg:grid-cols-5'>
          <div className='flex flex-col gap-4 lg:col-span-3'>
            <Card>
              <CardHeader>
                <CardTitle>Shipping address</CardTitle>
              </CardHeader>
              <CardContent className='grid gap-4 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='checkout-name'>Full name</Label>
                  <Input id='checkout-name' placeholder='Fandresena' />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='checkout-email'>Email</Label>
                  <Input
                    id='checkout-email'
                    type='email'
                    placeholder='you@example.com'
                  />
                </div>
                <div className='flex flex-col gap-2 sm:col-span-2'>
                  <Label htmlFor='checkout-address'>Address</Label>
                  <Input id='checkout-address' placeholder='Street address' />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='checkout-city'>City</Label>
                  <Input id='checkout-city' placeholder='Antananarivo' />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='checkout-zip'>Postal code</Label>
                  <Input id='checkout-zip' placeholder='101' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={payment}
                  onValueChange={setPayment}
                  className='gap-3'
                >
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      htmlFor={method.value}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-md border p-3',
                        payment === method.value && 'border-primary'
                      )}
                    >
                      <RadioGroupItem value={method.value} id={method.value} />
                      <method.icon className='size-4 text-muted-foreground' />
                      <span className='text-sm'>{method.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <Card className='h-fit lg:col-span-2'>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className='flex items-center justify-between text-sm'
                >
                  <span>
                    {item.product.name}
                    <span className='ms-1 text-muted-foreground'>
                      × {item.qty}
                    </span>
                  </span>
                  <span>${(item.product.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className='flex items-center justify-between text-sm text-muted-foreground'>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className='flex items-center justify-between text-sm text-muted-foreground'>
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <Separator />
              <div className='flex items-center justify-between font-semibold'>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className='w-full'>Place order</Button>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
