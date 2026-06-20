import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteProduct } from '../hooks/use-products'
import type { Product } from '../types'

type Props = {
  product: Product | null
  onOpenChange: (open: boolean) => void
}

export function DeleteProductDialog({ product, onOpenChange }: Props) {
  const mutation = useDeleteProduct()

  return (
    <AlertDialog open={!!product} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
          <AlertDialogDescription>
            Xóa “{product?.name}”? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => {
              if (!product) return
              mutation.mutate(product.id, {
                onSuccess: () => onOpenChange(false),
              })
            }}
          >
            {mutation.isPending ? 'Đang xóa…' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
