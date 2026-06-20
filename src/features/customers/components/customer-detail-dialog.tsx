import type { ReactNode } from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  customerTypeLabels,
  genderLabels,
  sourceLabels,
  statusLabels,
  type CustomerSource,
  type CustomerStatus,
  type CustomerType,
  type Gender,
} from '../schemas'
import type { Customer } from '../types'

function formatDate(iso?: string | null) {
  return iso ? new Date(iso).toLocaleDateString('vi-VN') : '—'
}

function Field({
  label,
  value,
  copy,
}: {
  label: string
  value: ReactNode
  copy?: string | null
}) {
  const canCopy = !!copy

  async function handleCopy() {
    if (!copy) return
    try {
      await navigator.clipboard.writeText(copy)
      toast.success(`Đã copy ${label.toLowerCase()}`)
    } catch {
      toast.error('Không copy được')
    }
  }

  return (
    <div
      className={cn(
        'grid grid-cols-3 gap-2 py-1.5',
        canCopy &&
          'hover:bg-muted/50 focus-visible:bg-muted/50 -mx-2 cursor-pointer rounded px-2 outline-none',
      )}
      role={canCopy ? 'button' : undefined}
      tabIndex={canCopy ? 0 : undefined}
      title={canCopy ? 'Bấm để copy' : undefined}
      onClick={canCopy ? handleCopy : undefined}
      onKeyDown={
        canCopy
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCopy()
              }
            }
          : undefined
      }
    >
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="col-span-2 flex items-center gap-1.5 text-sm break-words">
        {value || '—'}
        {canCopy && (
          <Copy className="text-muted-foreground size-3.5 shrink-0 opacity-60" />
        )}
      </span>
    </div>
  )
}

type Props = {
  customer: Customer | null
  onOpenChange: (open: boolean) => void
  onEdit: (customer: Customer) => void
  onManagePrices: (customer: Customer) => void
  canManage: boolean
}

export function CustomerDetailDialog({
  customer,
  onOpenChange,
  onEdit,
  onManagePrices,
  canManage,
}: Props) {
  return (
    <Dialog open={!!customer} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {customer && (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-2 text-xl">
                {customer.name}
                <Badge
                  variant={customer.status === 'active' ? 'default' : 'outline'}
                >
                  {statusLabels[customer.status as CustomerStatus] ??
                    customer.status}
                </Badge>
                {customer.is_lead && (
                  <Badge variant="secondary">Tiềm năng</Badge>
                )}
                {customer.customer_type === 'wholesale' && (
                  <Badge variant="secondary">Sỉ</Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="divide-y">
              <Field
                label="Điện thoại"
                value={customer.phone}
                copy={customer.phone}
              />
              <Field
                label="Địa chỉ"
                value={customer.address}
                copy={customer.address}
              />
              <Field
                label="Loại khách"
                value={
                  customerTypeLabels[customer.customer_type as CustomerType]
                }
                copy={
                  customerTypeLabels[customer.customer_type as CustomerType]
                }
              />
              <Field
                label="Ghi chú"
                value={customer.notes}
                copy={customer.notes}
              />
              <Field
                label="Email"
                value={customer.email}
                copy={customer.email}
              />
              <Field
                label="Công ty"
                value={customer.company}
                copy={customer.company}
              />
              <Field
                label="Chức vụ"
                value={customer.position}
                copy={customer.position}
              />
              <Field
                label="Mã số thuế"
                value={customer.tax_code}
                copy={customer.tax_code}
              />
              <Field
                label="Website"
                value={
                  customer.website ? (
                    <a
                      href={customer.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline underline-offset-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {customer.website}
                    </a>
                  ) : null
                }
                copy={customer.website}
              />
              <Field
                label="Tỉnh/Thành phố"
                value={customer.city}
                copy={customer.city}
              />
              <Field
                label="Nguồn"
                value={
                  customer.source
                    ? sourceLabels[customer.source as CustomerSource]
                    : null
                }
                copy={
                  customer.source
                    ? sourceLabels[customer.source as CustomerSource]
                    : null
                }
              />
              <Field
                label="Ngày sinh"
                value={formatDate(customer.date_of_birth)}
                copy={
                  customer.date_of_birth
                    ? formatDate(customer.date_of_birth)
                    : null
                }
              />
              <Field
                label="Giới tính"
                value={
                  customer.gender
                    ? genderLabels[customer.gender as Gender]
                    : null
                }
                copy={
                  customer.gender
                    ? genderLabels[customer.gender as Gender]
                    : null
                }
              />
              <Field
                label="Ngày tạo"
                value={formatDate(customer.created_at)}
                copy={formatDate(customer.created_at)}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Đóng
              </Button>
              {canManage && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onManagePrices(customer)}
                >
                  Giá riêng
                </Button>
              )}
              {canManage && (
                <Button type="button" onClick={() => onEdit(customer)}>
                  Sửa
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
