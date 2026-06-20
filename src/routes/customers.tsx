import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { CustomersPage } from '@/features/customers'
import { requireAuth } from '@/lib/route-guards'

const searchSchema = z.object({
  q: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  lead: z.boolean().optional(),
  page: z.number().int().min(1).optional(),
  sort: z.enum(['created_at', 'name']).optional(),
  dir: z.enum(['asc', 'desc']).optional(),
})

export const Route = createFileRoute('/customers')({
  beforeLoad: requireAuth,
  validateSearch: (search) => searchSchema.parse(search),
  component: CustomersPage,
})
