import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { blogPosts } from './data'

export function BlogPage() {
  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Blog</h2>
          <p className='text-muted-foreground'>
            Product updates, engineering notes, and customer stories.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {blogPosts.map((post) => (
            <Card key={post.id} className='overflow-hidden py-0'>
              <div className='h-32 bg-gradient-to-br from-muted to-muted/50' />
              <CardContent className='flex flex-col gap-3 pt-4 pb-6'>
                <Badge variant='secondary' className='w-fit'>
                  {post.category}
                </Badge>
                <h3 className='leading-snug font-semibold'>{post.title}</h3>
                <p className='line-clamp-2 text-sm text-muted-foreground'>
                  {post.excerpt}
                </p>
                <div className='flex items-center justify-between pt-2'>
                  <div className='flex items-center gap-2'>
                    <Avatar className='size-6'>
                      <AvatarFallback className='text-[10px]'>
                        {post.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-xs text-muted-foreground'>
                      {post.author}
                    </span>
                  </div>
                  <span className='text-xs text-muted-foreground'>
                    {post.date} · {post.readTime}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Main>
    </>
  )
}
