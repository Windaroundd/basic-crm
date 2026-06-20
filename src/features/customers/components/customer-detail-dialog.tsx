import type { ReactNode } from 'react'
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

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-1.5">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="col-span-2 text-sm break-words">{value || '—'}</span>
    </div>
  )
}

type Props = {
  customer: Customer | null
  onOpenChange: (open: boolean) => void
  onEdit: (customer: Customer) => void
}

export function CustomerDetailDialog({
  customer,
  onOpenChange,
  onEdit,
}: Props) {
  return (
    <Dialog open={!!customer} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {customer && (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-2">
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
                label="Loại khách"
                value={
                  customerTypeLabels[customer.customer_type as CustomerType]
                }
              />
              <Field label="Điện thoại" value={customer.phone} />
              <Field label="Email" value={customer.email} />
              <Field label="Công ty" value={customer.company} />
              <Field label="Chức vụ" value={customer.position} />
              <Field label="Mã số thuế" value={customer.tax_code} />
              <Field
                label="Website"
                value={
                  customer.website ? (
                    <a
                      href={customer.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      {customer.website}
                    </a>
                  ) : null
                }
              />
              <Field label="Địa chỉ" value={customer.address} />
              <Field label="Tỉnh/Thành phố" value={customer.city} />
              <Field
                label="Nguồn"
                value={
                  customer.source
                    ? sourceLabels[customer.source as CustomerSource]
                    : null
                }
              />
              <Field
                label="Ngày sinh"
                value={formatDate(customer.date_of_birth)}
              />
              <Field
                label="Giới tính"
                value={
                  customer.gender
                    ? genderLabels[customer.gender as Gender]
                    : null
                }
              />
              <Field label="Ghi chú" value={customer.notes} />
              <Field label="Ngày tạo" value={formatDate(customer.created_at)} />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Đóng
              </Button>
              <Button type="button" onClick={() => onEdit(customer)}>
                Sửa
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
