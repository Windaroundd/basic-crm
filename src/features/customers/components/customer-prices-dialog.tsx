import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatVND } from '@/lib/utils'
import {
  useActiveProducts,
  useCustomerPrices,
  useSaveCustomerPrices,
} from '../hooks/use-customer-prices'

export type PriceEntry = { product_id: string; price: number | null }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  customerType: 'retail' | 'wholesale'
  /** Có id => lưu thẳng DB (khách đã tồn tại). Không có => chế độ nháp. */
  customerId?: string
  /** Nháp: giá đã chọn từ trước (khi thêm khách mới). */
  initial?: { product_id: string; price: number }[]
  /** Nháp: trả giá về cho form cha xử lý khi lưu khách. */
  onSaved?: (entries: PriceEntry[]) => void
}

export function CustomerPricesDialog({
  open,
  onOpenChange,
  name,
  customerType,
  customerId,
  initial,
  onSaved,
}: Props) {
  const isWholesale = customerType === 'wholesale'
  const { data: products, isLoading } = useActiveProducts()
  const { data: livePrices } = useCustomerPrices(customerId)
  const mutation = useSaveCustomerPrices(customerId)

  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    const src = customerId ? livePrices : initial
    const map: Record<string, string> = {}
    for (const p of src ?? []) map[p.product_id] = String(p.price)
    setValues(map)
  }, [open, customerId, livePrices, initial])

  function handleSave() {
    if (!products) return
    const entries: PriceEntry[] = products.map((p) => {
      const raw = (values[p.id] ?? '').trim()
      const num = Number(raw)
      return {
        product_id: p.id,
        price: raw === '' || Number.isNaN(num) ? null : num,
      }
    })

    if (customerId) {
      mutation.mutate(entries, { onSuccess: () => onOpenChange(false) })
    } else {
      onSaved?.(entries)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Giá riêng — {name}</DialogTitle>
          <DialogDescription>
            Đặt giá riêng cho khách này. Để trống = dùng giá{' '}
            {isWholesale ? 'sỉ' : 'lẻ'} mặc định.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead className="text-right">
                  Giá mặc định ({isWholesale ? 'sỉ' : 'lẻ'})
                </TableHead>
                <TableHead className="text-right">Giá riêng (₫)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(products ?? []).map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {p.name}
                    {p.unit ? (
                      <span className="text-muted-foreground"> / {p.unit}</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right">
                    {formatVND(
                      isWholesale ? p.wholesale_price : p.retail_price,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="Mặc định"
                      className="ml-auto w-32"
                      value={values[p.id] ?? ''}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [p.id]: e.target.value,
                        }))
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
              {!products?.length && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-muted-foreground h-20 text-center"
                  >
                    Chưa có sản phẩm. Thêm ở trang Sản phẩm trước.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={mutation.isPending || !products?.length}
            onClick={handleSave}
          >
            {mutation.isPending ? 'Đang lưu…' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
