import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useAuth } from '@/features/auth'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CustomerListParams, CustomerSortField } from '../api'
import { useCustomers } from '../hooks/use-customers'
import { statusLabels } from '../schemas'
import type { Customer } from '../types'
import { CustomerFormDialog } from './customer-form-dialog'
import { CustomerStats } from './customer-stats'
import { CustomersTable } from './customers-table'
import { DeleteCustomerDialog } from './delete-customer-dialog'

const PAGE_SIZE = 10
const route = getRouteApi('/customers')

export function CustomersPage() {
  const { isAdmin } = useAuth()
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const page = search.page ?? 1
  const sort = search.sort ?? 'created_at'
  const dir = search.dir ?? 'desc'

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [deleting, setDeleting] = useState<Customer | null>(null)

  // Ô tìm kiếm: gõ -> debounce -> cập nhật URL (reset về trang 1)
  const [qInput, setQInput] = useState(search.q ?? '')
  const debouncedQ = useDebounce(qInput, 300)
  useEffect(() => {
    if ((debouncedQ || undefined) !== search.q) {
      navigate({
        search: (prev) => ({ ...prev, q: debouncedQ || undefined, page: 1 }),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ])

  const params: CustomerListParams = {
    q: search.q,
    status: search.status,
    lead: search.lead,
    page,
    pageSize: PAGE_SIZE,
    sort,
    dir,
  }

  const { data, isLoading, isFetching } = useCustomers(params)
  const rows = data?.rows ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  function setSearch(patch: Partial<typeof search>) {
    navigate({ search: (prev) => ({ ...prev, ...patch }) })
  }

  function toggleSort(field: CustomerSortField) {
    setSearch({
      sort: field,
      dir: sort === field && dir === 'asc' ? 'desc' : 'asc',
    })
  }

  const statusValue = search.status ?? 'all'
  const leadValue =
    search.lead === undefined ? 'all' : search.lead ? 'lead' : 'normal'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Khách hàng</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý thông tin khách hàng
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus />
          Thêm khách hàng
        </Button>
      </div>

      <CustomerStats />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="grid flex-1 gap-1.5">
          <span className="text-muted-foreground text-xs font-medium">
            Tìm kiếm
          </span>
          <Input
            placeholder="Tên, email, số điện thoại, công ty…"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <span className="text-muted-foreground text-xs font-medium">
            Trạng thái
          </span>
          <Select
            items={{
              all: 'Tất cả trạng thái',
              active: statusLabels.active,
              inactive: statusLabels.inactive,
            }}
            value={statusValue}
            onValueChange={(value) =>
              setSearch({
                status: value === 'all' ? undefined : (value as 'active'),
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">{statusLabels.active}</SelectItem>
              <SelectItem value="inactive">{statusLabels.inactive}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <span className="text-muted-foreground text-xs font-medium">
            Phân loại
          </span>
          <Select
            items={{
              all: 'Tất cả khách',
              lead: 'Chỉ tiềm năng',
              normal: 'Không tiềm năng',
            }}
            value={leadValue}
            onValueChange={(value) =>
              setSearch({
                lead: value === 'all' ? undefined : value === 'lead',
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khách</SelectItem>
              <SelectItem value="lead">Chỉ tiềm năng</SelectItem>
              <SelectItem value="normal">Không tiềm năng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <CustomersTable
        data={rows}
        isLoading={isLoading || isFetching}
        canDelete={isAdmin}
        sort={sort}
        dir={dir}
        onToggleSort={toggleSort}
        onEdit={(customer) => {
          setEditing(customer)
          setFormOpen(true)
        }}
        onDelete={setDeleting}
      />

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{total} khách hàng</p>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            Trang {page}/{totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setSearch({ page: page - 1 })}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setSearch({ page: page + 1 })}
          >
            Sau
          </Button>
        </div>
      </div>

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
