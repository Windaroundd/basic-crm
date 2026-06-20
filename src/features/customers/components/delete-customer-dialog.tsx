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
import { useDeleteCustomer } from '../hooks/use-customers'
import type { Customer } from '../types'

type Props = {
  customer: Customer | null
  onOpenChange: (open: boolean) => void
}

export function DeleteCustomerDialog({ customer, onOpenChange }: Props) {
  const mutation = useDeleteCustomer()

  return (
    <AlertDialog open={!!customer} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa khách hàng?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa “{customer?.name}”? Hành động này không thể
            hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => {
              if (!customer) return
              mutation.mutate(customer.id, {
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
