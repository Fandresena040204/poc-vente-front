import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Main } from '@/components/layout/main'
import {
  priorityClasses,
  statusVariant,
  tickets,
  type TicketStatus,
} from './data'

const statuses: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed']

export function TicketsPage() {
  return (
    <>
      <Main>
        <div className='mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>Tickets</h2>
          <p className='text-muted-foreground'>
            Support requests submitted by customers.
          </p>
        </div>

        <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {statuses.map((status) => (
            <Card key={status}>
              <CardContent>
                <CardDescription>{status}</CardDescription>
                <CardTitle className='text-2xl'>
                  {tickets.filter((t) => t.status === status).length}
                </CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead className='text-end'>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className='font-medium'>{ticket.id}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell className='text-muted-foreground'>
                        {ticket.customer}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[ticket.status]}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(priorityClasses[ticket.priority])}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {ticket.assignee}
                      </TableCell>
                      <TableCell className='text-end text-muted-foreground'>
                        {ticket.updated}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
