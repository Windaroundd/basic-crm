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
import type { Customer } from '../types'

type Props = {
  customer: Customer | null
  onOpenChange: (open: boolean) => void
}

export function CustomerPricesDialog({ customer, onOpenChange }: Props) {
  const isWholesale = customer?.customer_type === 'wholesale'
  const { data: products, isLoading } = useActiveProducts()
  const { data: prices } = useCustomerPrices(customer?.id)
  const mutation = useSaveCustomerPrices(customer?.id)

  // input riêng theo product_id (chuỗi rỗng = dùng giá mặc định)
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!customer) return
    const map: Record<string, string> = {}
    for (const p of prices ?? []) map[p.product_id] = String(p.price)
    setValues(map)
  }, [customer, prices])

  function handleSave() {
    if (!products) return
    const entries = products.map((p) => {
      const raw = (values[p.id] ?? '').trim()
      const num = Number(raw)
      return {
        product_id: p.id,
        price: raw === '' || Number.isNaN(num) ? null : num,
      }
    })
    mutation.mutate(entries, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={!!customer} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Giá riêng — {customer?.name}</DialogTitle>
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
