import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Customer } from '../types'

function isThisMonth(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  )
}

export function CustomerStats({ customers }: { customers: Customer[] }) {
  const stats = [
    { label: 'Tổng khách hàng', value: customers.length },
    {
      label: 'Đang hoạt động',
      value: customers.filter((c) => c.status === 'active').length,
    },
    {
      label: 'Khách tiềm năng',
      value: customers.filter((c) => c.is_lead).length,
    },
    {
      label: 'Mới trong tháng',
      value: customers.filter((c) => isThisMonth(c.created_at)).length,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
