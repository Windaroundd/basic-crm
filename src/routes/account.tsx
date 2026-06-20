import { createFileRoute } from '@tanstack/react-router'
import { ChangePasswordForm, useAuth, roleLabels } from '@/features/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { requireAuth } from '@/lib/route-guards'

export const Route = createFileRoute('/account')({
  beforeLoad: requireAuth,
  component: AccountPage,
})

function AccountPage() {
  const { profile, role } = useAuth()

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tài khoản</CardTitle>
          <CardDescription>
            {profile?.username}
            {role ? ` · ${roleLabels[role]}` : ''}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
          <CardDescription>
            Nhập mật khẩu hiện tại để xác nhận, rồi đặt mật khẩu mới.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
