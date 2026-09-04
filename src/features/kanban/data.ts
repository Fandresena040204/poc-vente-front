export type KanbanTask = {
  id: string
  title: string
  tag: string
  priority: 'Low' | 'Medium' | 'High'
  assignee: string
}

export type KanbanColumn = {
  id: string
  title: string
  tasks: KanbanTask[]
}

export const initialColumns: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    tasks: [
      {
        id: 't1',
        title: 'Research competitor pricing pages',
        tag: 'Research',
        priority: 'Low',
        assignee: 'SL',
      },
      {
        id: 't2',
        title: 'Write onboarding email sequence',
        tag: 'Marketing',
        priority: 'Medium',
        assignee: 'MA',
      },
      {
        id: 't3',
        title: 'Explore dark mode chart palette',
        tag: 'Design',
        priority: 'Low',
        assignee: 'JD',
      },
    ],
  },
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: 't4',
        title: 'Implement advanced filters export',
        tag: 'Engineering',
        priority: 'High',
        assignee: 'FM',
      },
      {
        id: 't5',
        title: 'Fix pagination reset bug',
        tag: 'Bug',
        priority: 'High',
        assignee: 'SL',
      },
      {
        id: 't6',
        title: 'Add role based access page',
        tag: 'Engineering',
        priority: 'Medium',
        assignee: 'MA',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      {
        id: 't7',
        title: 'Rebuild sidebar navigation',
        tag: 'Engineering',
        priority: 'High',
        assignee: 'FM',
      },
      {
        id: 't8',
        title: 'Design new invoice template',
        tag: 'Design',
        priority: 'Medium',
        assignee: 'JD',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: 't9',
        title: 'Ship charts sidebar menu',
        tag: 'Engineering',
        priority: 'Medium',
        assignee: 'FM',
      },
      {
        id: 't10',
        title: 'Add basic and data tables',
        tag: 'Engineering',
        priority: 'Medium',
        assignee: 'FM',
      },
      {
        id: 't11',
        title: 'User research interviews',
        tag: 'Research',
        priority: 'Low',
        assignee: 'SL',
      },
    ],
  },
]

export const priorityClasses: Record<KanbanTask['priority'], string> = {
  Low: 'bg-muted text-muted-foreground',
  Medium:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  High: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
}
