import { Heart, ListMusic, Pause, SkipForward, Users } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Main } from '@/components/layout/main'

const listeningTrend = [
  { day: 'Mon', hours: 4.2 },
  { day: 'Tue', hours: 3.1 },
  { day: 'Wed', hours: 5.4 },
  { day: 'Thu', hours: 4.8 },
  { day: 'Fri', hours: 6.2 },
  { day: 'Sat', hours: 7.5 },
  { day: 'Sun', hours: 6.9 },
]

const topTracks = [
  { title: 'Midnight City Lights', artist: 'Nova Sound', plays: '2.4M' },
  { title: 'Golden Hour', artist: 'Wren & Co.', plays: '1.9M' },
  { title: 'Echo Chamber', artist: 'Static Bloom', plays: '1.6M' },
  { title: 'Paper Planes Rework', artist: 'Kite Theory', plays: '1.2M' },
  { title: 'Slow Burn', artist: 'Nova Sound', plays: '980K' },
]

const genres = [
  { name: 'Pop', percent: 34 },
  { name: 'Electronic', percent: 26 },
  { name: 'Hip-Hop', percent: 18 },
  { name: 'Indie', percent: 14 },
  { name: 'Jazz', percent: 8 },
]

export function MusicDashboard() {
  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Music Dashboard</h2>
          <p className='text-muted-foreground'>
            Listening activity and top tracks this week.
          </p>
        </div>

        <Card className='mb-4 overflow-hidden border-none bg-gradient-to-r from-violet-600 to-indigo-600 text-white'>
          <CardContent className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex size-16 items-center justify-center rounded-lg bg-white/20'>
                <ListMusic className='size-7' />
              </div>
              <div>
                <p className='text-xs tracking-wide text-white/70 uppercase'>
                  Now playing
                </p>
                <p className='text-lg font-semibold'>Midnight City Lights</p>
                <p className='text-sm text-white/80'>Nova Sound</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <button className='flex size-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30'>
                <Heart className='size-4' />
              </button>
              <button className='flex size-11 items-center justify-center rounded-full bg-white text-indigo-600'>
                <Pause className='size-5' />
              </button>
              <button className='flex size-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30'>
                <SkipForward className='size-4' />
              </button>
            </div>
          </CardContent>
        </Card>

        <div className='grid gap-4 lg:grid-cols-7'>
          <Card className='lg:col-span-4'>
            <CardHeader>
              <CardTitle>Listening hours</CardTitle>
              <CardDescription>Hours streamed per day</CardDescription>
            </CardHeader>
            <CardContent className='ps-0'>
              <ResponsiveContainer width='100%' height={260}>
                <BarChart data={listeningTrend}>
                  <XAxis
                    dataKey='day'
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}h`}
                  />
                  <Bar
                    dataKey='hours'
                    radius={[4, 4, 0, 0]}
                    fill='currentColor'
                    className='fill-violet-500'
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className='lg:col-span-3'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Users className='size-4' />
                Top genres
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
              {genres.map((genre) => (
                <div key={genre.name} className='flex flex-col gap-1'>
                  <div className='flex items-center justify-between text-sm'>
                    <span>{genre.name}</span>
                    <span className='text-muted-foreground'>
                      {genre.percent}%
                    </span>
                  </div>
                  <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
                    <div
                      className='h-full rounded-full bg-violet-500'
                      style={{ width: `${genre.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className='mt-4'>
          <CardHeader>
            <CardTitle>Top tracks</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-1'>
            {topTracks.map((track, index) => (
              <div
                key={track.title}
                className='flex items-center justify-between border-b py-2 text-sm last:border-b-0'
              >
                <div className='flex items-center gap-3'>
                  <span className='w-4 text-muted-foreground'>{index + 1}</span>
                  <div>
                    <p className='font-medium'>{track.title}</p>
                    <p className='text-xs text-muted-foreground'>
                      {track.artist}
                    </p>
                  </div>
                </div>
                <Badge variant='secondary'>{track.plays} plays</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
