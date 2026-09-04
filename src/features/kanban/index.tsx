import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { initialColumns, priorityClasses, type KanbanColumn } from './data'

export function KanbanPage() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns)
  const [draggingTask, setDraggingTask] = useState<{
    taskId: string
    fromColumn: string
  } | null>(null)

  const handleDrop = (toColumn: string) => {
    if (!draggingTask) return
    const { taskId, fromColumn } = draggingTask
    if (fromColumn === toColumn) {
      setDraggingTask(null)
      return
    }
    setColumns((prev) => {
      const source = prev.find((c) => c.id === fromColumn)
      const task = source?.tasks.find((t) => t.id === taskId)
      if (!task) return prev
      return prev.map((column) => {
        if (column.id === fromColumn) {
          return {
            ...column,
            tasks: column.tasks.filter((t) => t.id !== taskId),
          }
        }
        if (column.id === toColumn) {
          return { ...column, tasks: [...column.tasks, task] }
        }
        return column
      })
    })
    setDraggingTask(null)
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
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Kanban</h2>
          <p className='text-muted-foreground'>
            Drag a card to another column to update its status.
          </p>
        </div>

        <div className='flex gap-4 overflow-x-auto pb-2'>
          {columns.map((column) => (
            <div
              key={column.id}
              className='flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-muted/30 p-3'
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(column.id)}
            >
              <div className='flex items-center justify-between px-1'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{column.title}</span>
                  <Badge variant='secondary'>{column.tasks.length}</Badge>
                </div>
                <Button variant='ghost' size='icon' className='size-7'>
                  <Plus className='size-4' />
                </Button>
              </div>

              <div className='flex flex-col gap-2'>
                {column.tasks.map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() =>
                      setDraggingTask({ taskId: task.id, fromColumn: column.id })
                    }
                    className={cn(
                      'cursor-grab gap-3 py-3 active:cursor-grabbing',
                      draggingTask?.taskId === task.id && 'opacity-50'
                    )}
                  >
                    <CardContent className='flex flex-col gap-2 px-3'>
                      <div className='flex items-center justify-between'>
                        <Badge variant='outline' className='text-[10px]'>
                          {task.tag}
                        </Badge>
                        <Badge
                          className={cn(
                            'text-[10px]',
                            priorityClasses[task.priority]
                          )}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className='text-sm font-medium'>{task.title}</p>
                      <Avatar className='size-6'>
                        <AvatarFallback className='text-[10px]'>
                          {task.assignee}
                        </AvatarFallback>
                      </Avatar>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Main>
    </>
  )
}
