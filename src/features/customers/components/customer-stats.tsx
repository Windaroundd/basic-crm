import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCustomerStats } from '../hooks/use-customers'

export function CustomerStats() {
  const { data, isLoading } = useCustomerStats()

  const stats = [
    { label: 'Tổng khách hàng', value: data?.total },
    { label: 'Đang hoạt động', value: data?.active },
    { label: 'Khách tiềm năng', value: data?.lead },
    { label: 'Mới trong tháng', value: data?.newThisMonth },
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
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-2xl font-semibold">{stat.value ?? 0}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
