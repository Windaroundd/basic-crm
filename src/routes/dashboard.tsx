import { createFileRoute } from '@tanstack/react-router'
import { CustomersDashboard } from '@/features/customers'
import { requireAuth } from '@/lib/route-guards'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAuth,
  component: CustomersDashboard,
})
