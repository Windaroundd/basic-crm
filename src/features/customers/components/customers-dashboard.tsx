import { CustomerCharts } from './customer-charts'
import { CustomerStats } from './customer-stats'

export function CustomersDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tổng quan</h1>
        <p className="text-muted-foreground text-sm">Thống kê khách hàng</p>
      </div>
      <CustomerStats />
      <CustomerCharts />
    </div>
  )
}
