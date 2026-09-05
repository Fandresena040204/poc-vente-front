import { useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { calendarEvents, colorClasses } from './data'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarPage() {
  const [cursor, setCursor] = useState(new Date())

  const monthStart = startOfMonth(cursor)
  const monthEnd = endOfMonth(cursor)
  const gridStart = startOfWeek(monthStart)
  const gridEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const eventsFor = (day: Date) =>
    calendarEvents.filter((event) => isSameDay(new Date(event.date), day))

  return (
    <>
      <Main>
        <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Calendar</h2>
            <p className='text-muted-foreground'>
              {format(cursor, 'MMMM yyyy')}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setCursor((prev) => subMonths(prev, 1))}
            >
              <ChevronLeft className='size-4' />
            </Button>
            <Button variant='outline' onClick={() => setCursor(new Date())}>
              Today
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setCursor((prev) => addMonths(prev, 1))}
            >
              <ChevronRight className='size-4' />
            </Button>
            <Button className='ms-2'>
              <Plus className='size-4' />
              New event
            </Button>
          </div>
        </div>

        <Card>
          <CardContent>
            <div className='grid grid-cols-7 border-b text-center text-xs font-medium text-muted-foreground'>
              {weekdays.map((day) => (
                <div key={day} className='pb-2'>
                  {day}
                </div>
              ))}
            </div>
            <div className='grid grid-cols-7'>
              {days.map((day) => {
                const dayEvents = eventsFor(day)
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'flex min-h-24 flex-col gap-1 border-e border-b p-1.5 [&:nth-child(7n)]:border-e-0',
                      !isSameMonth(day, cursor) && 'bg-muted/30'
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-6 items-center justify-center rounded-full text-xs',
                        !isSameMonth(day, cursor) && 'text-muted-foreground',
                        isToday(day) && 'bg-primary text-primary-foreground'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    <div className='flex flex-col gap-1'>
                      {dayEvents.slice(0, 2).map((event) => (
                        <span
                          key={event.id}
                          className={cn(
                            'truncate rounded px-1.5 py-0.5 text-[11px] font-medium',
                            colorClasses[event.color]
                          )}
                        >
                          {event.title}
                        </span>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className='text-[11px] text-muted-foreground'>
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
