import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateCustomer, useUpdateCustomer } from '../hooks/use-customers'
import {
  customerFormSchema,
  customerSources,
  genders,
  genderLabels,
  sourceLabels,
  statusLabels,
  type CustomerFormValues,
} from '../schemas'
import type { Customer } from '../types'

const EMPTY: CustomerFormValues = {
  name: '',
  phone: '',
  address: '',
  status: 'active',
  is_lead: false,
  email: '',
  company: '',
  position: '',
  tax_code: '',
  website: '',
  city: '',
  source: '',
  date_of_birth: '',
  gender: '',
  notes: '',
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer
}

export function CustomerFormDialog({ open, onOpenChange, customer }: Props) {
  const isEdit = !!customer
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()
  const pending = createMutation.isPending || updateMutation.isPending

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: EMPTY,
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      customer
        ? {
            name: customer.name,
            phone: customer.phone ?? '',
            address: customer.address ?? '',
            status: customer.status as CustomerFormValues['status'],
            is_lead: customer.is_lead,
            email: customer.email ?? '',
            company: customer.company ?? '',
            position: customer.position ?? '',
            tax_code: customer.tax_code ?? '',
            website: customer.website ?? '',
            city: customer.city ?? '',
            source: (customer.source ?? '') as CustomerFormValues['source'],
            date_of_birth: customer.date_of_birth ?? '',
            gender: (customer.gender ?? '') as CustomerFormValues['gender'],
            notes: customer.notes ?? '',
          }
        : EMPTY,
    )
  }, [open, customer, form])

  function onSubmit(values: CustomerFormValues) {
    if (isEdit && customer) {
      updateMutation.mutate(
        { id: customer.id, values },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      createMutation.mutate(values, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Sửa khách hàng' : 'Thêm khách hàng'}
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium">Tên</span>,{' '}
            <span className="font-medium">Số điện thoại</span> và{' '}
            <span className="font-medium">Địa chỉ</span> là bắt buộc, các mục
            khác có thể bỏ trống.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
            noValidate
          >
            {/* Thông tin bắt buộc */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại *</FormLabel>
                  <FormControl>
                    <Input placeholder="0901234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ *</FormLabel>
                  <FormControl>
                    <Input placeholder="Số nhà, đường, phường…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    items={statusLabels}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">
                        {statusLabels.active}
                      </SelectItem>
                      <SelectItem value="inactive">
                        {statusLabels.inactive}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_lead"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    </FormControl>
                    <FormLabel className="mb-0">Khách tiềm năng</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thông tin thêm (không bắt buộc) */}
            <p className="text-muted-foreground border-t pt-4 text-xs font-medium tracking-wide uppercase">
              Thông tin thêm (không bắt buộc)
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Công ty</FormLabel>
                    <FormControl>
                      <Input placeholder="Công ty TNHH..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chức vụ</FormLabel>
                    <FormControl>
                      <Input placeholder="Giám đốc, Trưởng phòng…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tax_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã số thuế</FormLabel>
                    <FormControl>
                      <Input placeholder="0312345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                    <FormControl>
                      <Input placeholder="TP. Hồ Chí Minh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nguồn khách hàng</FormLabel>
                    <Select
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? '')}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn nguồn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customerSources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {sourceLabels[source]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? '')}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genders.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {genderLabels[gender]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Input placeholder="Ghi chú thêm…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? 'Đang lưu…' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
