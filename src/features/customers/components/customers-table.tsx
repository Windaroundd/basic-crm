import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CustomerSortField } from '../api'
import { statusLabels, type CustomerStatus } from '../schemas'
import type { Customer } from '../types'

const statusVariant: Record<
  CustomerStatus,
  'default' | 'secondary' | 'outline'
> = {
  active: 'default',
  inactive: 'outline',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN')
}

type Props = {
  data: Customer[]
  isLoading: boolean
  canDelete: boolean
  sort: CustomerSortField
  dir: 'asc' | 'desc'
  onToggleSort: (field: CustomerSortField) => void
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

const COLS = 8

export function CustomersTable({
  data,
  isLoading,
  canDelete,
  sort,
  dir,
  onToggleSort,
  onEdit,
  onDelete,
}: Props) {
  function SortButton({
    field,
    label,
  }: {
    field: CustomerSortField
    label: string
  }) {
    const Icon =
      sort !== field ? ArrowUpDown : dir === 'asc' ? ArrowUp : ArrowDown
    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => onToggleSort(field)}
      >
        {label}
        <Icon />
      </Button>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton field="name" label="Tên" />
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Điện thoại</TableHead>
            <TableHead>Công ty</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Tiềm năng</TableHead>
            <TableHead>
              <SortButton field="created_at" label="Ngày tạo" />
            </TableHead>
            <TableHead className="text-right">
              <span className="sr-only">Thao tác</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: COLS }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length ? (
            data.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email || '—'}</TableCell>
                <TableCell>{customer.phone || '—'}</TableCell>
                <TableCell>{customer.company || '—'}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      statusVariant[customer.status as CustomerStatus] ??
                      'outline'
                    }
                  >
                    {statusLabels[customer.status as CustomerStatus] ??
                      customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {customer.is_lead ? (
                    <Badge variant="secondary">Tiềm năng</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(customer.created_at)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(customer)}
                      aria-label="Sửa"
                    >
                      <Pencil />
                    </Button>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(customer)}
                        aria-label="Xóa"
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={COLS}
                className="text-muted-foreground h-24 text-center"
              >
                Không có khách hàng nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
