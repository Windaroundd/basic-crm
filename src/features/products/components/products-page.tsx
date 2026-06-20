import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
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
import { formatVND } from '@/lib/utils'
import { useProducts } from '../hooks/use-products'
import type { Product } from '../types'
import { DeleteProductDialog } from './delete-product-dialog'
import { ProductFormDialog } from './product-form-dialog'

export function ProductsPage() {
  const { data, isLoading } = useProducts()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const products = data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Sản phẩm</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý sản phẩm và bảng giá (lẻ / sỉ)
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus />
          Thêm sản phẩm
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead className="text-right">Giá lẻ</TableHead>
              <TableHead className="text-right">Giá sỉ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Thao tác</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : products.length ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.unit || '—'}</TableCell>
                  <TableCell className="text-right">
                    {formatVND(product.retail_price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatVND(product.wholesale_price)}
                  </TableCell>
                  <TableCell>
                    {product.is_active ? (
                      <Badge variant="default">Còn bán</Badge>
                    ) : (
                      <Badge variant="outline">Ngừng</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditing(product)
                          setFormOpen(true)
                        }}
                        aria-label="Sửa"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleting(product)}
                        aria-label="Xóa"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground h-24 text-center"
                >
                  Chưa có sản phẩm nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing ?? undefined}
      />

      <DeleteProductDialog
        product={deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
      />
    </div>
  )
}
