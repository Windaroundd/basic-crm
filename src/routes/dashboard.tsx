import { createFileRoute } from '@tanstack/react-router'
import { CustomersDashboard } from '@/features/customers'
import { requireAdmin } from '@/lib/route-guards'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAdmin,
  component: CustomersDashboard,
})
