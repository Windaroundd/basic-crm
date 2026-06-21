import { roleLabels, type Profile, type Role } from '@/features/auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const roleVariant: Record<Role, 'default' | 'secondary' | 'outline'> = {
  super_admin: 'default',
  admin: 'secondary',
  staff: 'outline',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN')
}

type Props = {
  data: Profile[]
  isLoading: boolean
  currentUserId?: string
  isSuperAdmin: boolean
  onEdit: (user: Profile) => void
  onDelete: (user: Profile) => void
}

export function UsersTable({
  data,
  isLoading,
  currentUserId,
  isSuperAdmin,
  onEdit,
  onDelete,
}: Props) {
  // admin: chỉ sửa được staff, nhưng xóa được cả admin (trừ super_admin)
  const canEdit = (user: Profile) => isSuperAdmin || user.role === 'staff'
  const canDelete = (user: Profile) =>
    isSuperAdmin || user.role !== 'super_admin'

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên đăng nhập</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">
              <span className="sr-only">Thao tác</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length ? (
            data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.full_name || '—'}</TableCell>
                <TableCell>
                  <Badge variant={roleVariant[user.role]}>
                    {roleLabels[user.role]}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={!canEdit(user)}
                      onClick={() => onEdit(user)}
                      aria-label="Sửa"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={!canDelete(user) || user.id === currentUserId}
                      onClick={() => onDelete(user)}
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
                colSpan={5}
                className="text-muted-foreground h-24 text-center"
              >
                Chưa có tài khoản nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
