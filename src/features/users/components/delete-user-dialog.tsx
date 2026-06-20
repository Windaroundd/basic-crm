import type { Profile } from '@/features/auth'
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
import { useDeleteUser } from '../hooks/use-users'

type Props = {
  user: Profile | null
  onOpenChange: (open: boolean) => void
}

export function DeleteUserDialog({ user, onOpenChange }: Props) {
  const mutation = useDeleteUser()

  return (
    <AlertDialog open={!!user} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa tài khoản?</AlertDialogTitle>
          <AlertDialogDescription>
            Xóa tài khoản “{user?.username}”? Người dùng sẽ không đăng nhập được
            nữa. Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => {
              if (!user) return
              mutation.mutate(user.id, {
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
