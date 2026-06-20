import { Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth, signOut, roleLabels } from '@/features/auth'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'

export function Header() {
  const { isAuthenticated, isAdmin, profile, role } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  async function handleSignOut() {
    await signOut()
    queryClient.clear()
    toast.success('Đã đăng xuất')
    navigate({ to: '/signin' })
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto flex items-center gap-4 p-4">
        {isAdmin && (
          <Link to="/dashboard" className="font-semibold [&.active]:underline">
            Tổng quan
          </Link>
        )}
        {isAuthenticated && (
          <Link to="/customers" className="font-semibold [&.active]:underline">
            Khách hàng
          </Link>
        )}
        {isAdmin && (
          <Link to="/products" className="[&.active]:underline">
            Sản phẩm
          </Link>
        )}
        {isAdmin && (
          <Link to="/users" className="[&.active]:underline">
            Nhân viên
          </Link>
        )}
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              {profile && (
                <Link
                  to="/account"
                  className="text-muted-foreground hover:text-foreground [&.active]:text-foreground hidden text-sm sm:inline [&.active]:underline"
                >
                  {profile.username}
                  {role ? ` · ${roleLabels[role]}` : ''}
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <Link to="/signin" className="[&.active]:underline">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
