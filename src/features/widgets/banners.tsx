import { AlertTriangle, ArrowRight, Rocket, Sparkles, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Main } from '@/components/layout/main'

export function WidgetBannersPage() {
  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Banners</h2>
          <p className='text-muted-foreground'>
            Promo, alert, and newsletter banners for calling out important
            content.
          </p>
        </div>

        <div className='flex flex-col gap-6'>
          <section>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
              Promo banners
            </h3>
            <div className='flex flex-col gap-4'>
              <Card className='overflow-hidden border-none bg-gradient-to-r from-primary to-primary/70 text-primary-foreground'>
                <CardContent className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='flex items-start gap-3'>
                    <Sparkles className='mt-1 size-6 shrink-0' />
                    <div>
                      <p className='text-lg font-semibold'>
                        Upgrade to Pro and unlock advanced analytics
                      </p>
                      <p className='text-sm text-primary-foreground/80'>
                        Get unlimited exports, custom dashboards, and priority
                        support.
                      </p>
                    </div>
                  </div>
                  <Button variant='secondary' className='shrink-0'>
                    Upgrade now
                    <ArrowRight className='size-4' />
                  </Button>
                </CardContent>
              </Card>

              <Card className='border-dashed'>
                <CardContent className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='flex items-start gap-3'>
                    <Rocket className='mt-1 size-6 shrink-0 text-muted-foreground' />
                    <div>
                      <p className='font-semibold'>
                        v2.4 is here — faster tables and new chart types
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        See what changed in the latest release.
                      </p>
                    </div>
                  </div>
                  <Button variant='outline' className='shrink-0'>
                    Read changelog
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
              Dismissible banner
            </h3>
            <Card className='bg-muted/40'>
              <CardContent className='flex items-center justify-between gap-4'>
                <p className='text-sm'>
                  We use cookies to improve your experience. By continuing you
                  agree to our{' '}
                  <span className='underline underline-offset-2'>
                    cookie policy
                  </span>
                  .
                </p>
                <Button variant='ghost' size='icon' className='shrink-0'>
                  <X className='size-4' />
                </Button>
              </CardContent>
            </Card>
          </section>

          <section>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
              Alert banners
            </h3>
            <div className='flex flex-col gap-4'>
              <Alert>
                <Sparkles />
                <AlertTitle>New feature available</AlertTitle>
                <AlertDescription>
                  Advanced filters now support range operators for numbers and
                  dates.
                </AlertDescription>
              </Alert>
              <Alert variant='destructive'>
                <AlertTriangle />
                <AlertTitle>Action required</AlertTitle>
                <AlertDescription>
                  Your payment method expires soon. Update it to avoid service
                  interruption.
                </AlertDescription>
              </Alert>
            </div>
          </section>

          <section>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
              Newsletter banner
            </h3>
            <Card>
              <CardContent className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <p className='font-semibold'>Subscribe to our newsletter</p>
                  <p className='text-sm text-muted-foreground'>
                    Product updates and tips, once a month, no spam.
                  </p>
                </div>
                <div className='flex w-full max-w-sm gap-2'>
                  <Input placeholder='you@example.com' type='email' />
                  <Button className='shrink-0'>Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </Main>
    </>
  )
}
