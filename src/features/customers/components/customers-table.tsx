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

type Props = {
  data: Customer[]
  isLoading: boolean
  canDelete: boolean
  sort: CustomerSortField
  dir: 'asc' | 'desc'
  onToggleSort: (field: CustomerSortField) => void
  onRowClick: (customer: Customer) => void
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

const COLS = 7

export function CustomersTable({
  data,
  isLoading,
  canDelete,
  sort,
  dir,
  onToggleSort,
  onRowClick,
  onEdit,
  onDelete,
}: Props) {
  const SortIcon =
    sort !== 'name' ? ArrowUpDown : dir === 'asc' ? ArrowUp : ArrowDown

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2"
                onClick={() => onToggleSort('name')}
              >
                Tên
                <SortIcon />
              </Button>
            </TableHead>
            <TableHead>Điện thoại</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Tiềm năng</TableHead>
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
              <TableRow
                key={customer.id}
                className="cursor-pointer"
                onClick={() => onRowClick(customer)}
              >
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.phone || '—'}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {customer.address || '—'}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {customer.notes || '—'}
                </TableCell>
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
                <TableCell>
                  <div
                    className="flex justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
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
