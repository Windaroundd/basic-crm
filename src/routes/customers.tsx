import { createFileRoute } from '@tanstack/react-router'
import { CustomersPage } from '@/features/customers'
import { requireAuth } from '@/lib/route-guards'

export const Route = createFileRoute('/customers')({
  beforeLoad: requireAuth,
  component: CustomersPage,
})
