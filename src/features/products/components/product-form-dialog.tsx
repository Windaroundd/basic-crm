import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Input } from '@/components/ui/input'
import { useCreateProduct, useUpdateProduct } from '../hooks/use-products'
import { productSchema, type ProductValues } from '../schemas'
import type { Product } from '../types'

const EMPTY: ProductValues = {
  name: '',
  unit: '',
  retail_price: 0,
  wholesale_price: 0,
  is_active: true,
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
}

export function ProductFormDialog({ open, onOpenChange, product }: Props) {
  const isEdit = !!product
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const pending = createMutation.isPending || updateMutation.isPending

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: EMPTY,
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      product
        ? {
            name: product.name,
            unit: product.unit ?? '',
            retail_price: product.retail_price,
            wholesale_price: product.wholesale_price,
            is_active: product.is_active,
          }
        : EMPTY,
    )
  }, [open, product, form])

  function onSubmit(values: ProductValues) {
    if (isEdit && product) {
      updateMutation.mutate(
        { id: product.id, values },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      createMutation.mutate(values, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
          <DialogDescription>
            Đặt giá lẻ và giá sỉ cho từng sản phẩm.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sản phẩm *</FormLabel>
                  <FormControl>
                    <Input placeholder="Bánh bò thốt nốt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn vị</FormLabel>
                  <FormControl>
                    <Input placeholder="phần / ly / hộp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="retail_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá lẻ (₫)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1000}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wholesale_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá sỉ (₫)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1000}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    </FormControl>
                    <FormLabel className="mb-0">Còn bán</FormLabel>
                  </div>
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
