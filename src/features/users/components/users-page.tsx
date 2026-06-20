import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAuth, type Profile } from '@/features/auth'
import { Button } from '@/components/ui/button'
import { useUsers } from '../hooks/use-users'
import { CreateUserDialog } from './create-user-dialog'
import { DeleteUserDialog } from './delete-user-dialog'
import { EditUserDialog } from './edit-user-dialog'
import { UsersTable } from './users-table'

export function UsersPage() {
  const { user, isSuperAdmin } = useAuth()
  const { data, isLoading } = useUsers()
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Profile | null>(null)
  const [deleting, setDeleting] = useState<Profile | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Người dùng</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý tài khoản và phân quyền
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus />
          Thêm tài khoản
        </Button>
      </div>

      <UsersTable
        data={data ?? []}
        isLoading={isLoading}
        currentUserId={user?.id}
        isSuperAdmin={isSuperAdmin}
        onEdit={setEditing}
        onDelete={setDeleting}
      />

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />

      <EditUserDialog
        user={editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
      />

      <DeleteUserDialog
        user={deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
      />
    </div>
  )
}
