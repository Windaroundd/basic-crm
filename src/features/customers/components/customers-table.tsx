import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

export function CustomersTable({
  data,
  isLoading,
  canDelete,
  onEdit,
  onDelete,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'all'>(
    'all',
  )
  const [leadFilter, setLeadFilter] = useState<'all' | 'lead' | 'normal'>('all')

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tên
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => row.original.email || '—',
      },
      {
        accessorKey: 'phone',
        header: 'Điện thoại',
        cell: ({ row }) => row.original.phone || '—',
      },
      {
        accessorKey: 'company',
        header: 'Công ty',
        cell: ({ row }) => row.original.company || '—',
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        filterFn: 'equals',
        cell: ({ row }) => {
          const status = row.original.status as CustomerStatus
          return (
            <Badge variant={statusVariant[status] ?? 'outline'}>
              {statusLabels[status] ?? status}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'is_lead',
        header: 'Tiềm năng',
        filterFn: 'equals',
        cell: ({ row }) =>
          row.original.is_lead ? (
            <Badge variant="secondary">Tiềm năng</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'created_at',
        header: 'Ngày tạo',
        cell: ({ row }) => formatDate(row.original.created_at),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Thao tác</span>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(row.original)}
              aria-label="Sửa"
            >
              <Pencil />
            </Button>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDelete(row.original)}
                aria-label="Xóa"
              >
                <Trash2 />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [canDelete, onEdit, onDelete],
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  function handleStatusChange(value: CustomerStatus | 'all' | null) {
    const next = value ?? 'all'
    setStatusFilter(next)
    table.getColumn('status')?.setFilterValue(next === 'all' ? undefined : next)
  }

  function handleLeadChange(value: 'all' | 'lead' | 'normal' | null) {
    const next = value ?? 'all'
    setLeadFilter(next)
    table
      .getColumn('is_lead')
      ?.setFilterValue(next === 'all' ? undefined : next === 'lead')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="Tìm theo tên, email, sđt, công ty…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">{statusLabels.active}</SelectItem>
            <SelectItem value="inactive">{statusLabels.inactive}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={leadFilter} onValueChange={handleLeadChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Lọc tiềm năng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả khách</SelectItem>
            <SelectItem value="lead">Chỉ tiềm năng</SelectItem>
            <SelectItem value="normal">Không tiềm năng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  Không có khách hàng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {table.getFilteredRowModel().rows.length} khách hàng
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  )
}
