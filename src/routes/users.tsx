import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '@/features/users'
import { requireAdmin } from '@/lib/route-guards'

export const Route = createFileRoute('/users')({
  beforeLoad: requireAdmin,
  component: UsersPage,
})
