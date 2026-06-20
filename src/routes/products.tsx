import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@/features/products'
import { requireAdmin } from '@/lib/route-guards'

export const Route = createFileRoute('/products')({
  beforeLoad: requireAdmin,
  component: ProductsPage,
})
