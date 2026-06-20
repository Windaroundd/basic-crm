import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCustomerCharts } from '../hooks/use-customers'
import {
  customerSources,
  sourceLabels,
  statusLabels,
  type CustomerStatus,
} from '../schemas'

const CHART_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
]

export function CustomerCharts() {
  const { data, isLoading } = useCustomerCharts()

  const { byMonth, bySource, byStatus } = useMemo(() => {
    const rows = data ?? []
    const now = new Date()

    const byMonth = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`,
        count: 0,
      }
    })
    for (const row of rows) {
      const d = new Date(row.created_at)
      const bucket = byMonth.find(
        (m) => m.key === `${d.getFullYear()}-${d.getMonth()}`,
      )
      if (bucket) bucket.count += 1
    }

    const bySource = customerSources
      .map((source) => ({
        name: sourceLabels[source],
        value: rows.filter((r) => r.source === source).length,
      }))
      .filter((s) => s.value > 0)
    const unknown = rows.filter((r) => !r.source).length
    if (unknown) bySource.push({ name: 'Chưa rõ', value: unknown })

    const byStatus = (['active', 'inactive'] as CustomerStatus[])
      .map((status) => ({
        name: statusLabels[status],
        value: rows.filter((r) => r.status === status).length,
      }))
      .filter((s) => s.value > 0)

    return { byMonth, bySource, byStatus }
  }, [data])

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 lg:col-span-2" />
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Khách hàng mới (6 tháng gần nhất)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="count"
                name="Khách mới"
                fill="var(--color-chart-1)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theo nguồn khách hàng</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {bySource.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bySource}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {bySource.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground">Chưa có dữ liệu</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theo trạng thái</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {byStatus.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {byStatus.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground">Chưa có dữ liệu</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
