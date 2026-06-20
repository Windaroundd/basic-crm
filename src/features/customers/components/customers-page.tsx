import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '@/features/auth'
import { Button } from '@/components/ui/button'
import { useCustomers } from '../hooks/use-customers'
import type { Customer } from '../types'
import { CustomerFormDialog } from './customer-form-dialog'
import { CustomerStats } from './customer-stats'
import { CustomersTable } from './customers-table'
import { DeleteCustomerDialog } from './delete-customer-dialog'

export function CustomersPage() {
  const { isAdmin } = useAuth()
  const { data, isLoading } = useCustomers()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [deleting, setDeleting] = useState<Customer | null>(null)

  const customers = data ?? []

  function handleAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(customer: Customer) {
    setEditing(customer)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Khách hàng</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý thông tin khách hàng
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus />
          Thêm khách hàng
        </Button>
      </div>

      <CustomerStats customers={customers} />

      <CustomersTable
        data={customers}
        isLoading={isLoading}
        canDelete={isAdmin}
        onEdit={handleEdit}
        onDelete={setDeleting}
      />

      <CustomerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        customer={editing ?? undefined}
      />

      <DeleteCustomerDialog
        customer={deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
      />
    </div>
  )
}
