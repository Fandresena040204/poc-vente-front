import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Ventes } from '@/features/ventes'

const ventesSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(
      z.union([
        z.literal('draft'),
        z.literal('validated'),
        z.literal('cancelled'),
      ])
    )
    .optional()
    .catch([]),
})

export const Route = createFileRoute('/_authenticated/ventes/')({
  validateSearch: ventesSearchSchema,
  component: Ventes,
})
