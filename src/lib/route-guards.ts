import { redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

/** Yêu cầu đã đăng nhập, nếu chưa thì chuyển về /signin. */
export async function requireAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    throw redirect({ to: '/signin' })
  }
  return session
}

/** Yêu cầu role admin hoặc super_admin, nếu không thì chuyển về /customers. */
export async function requireAdmin() {
  const session = await requireAuth()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()
  if (
    !profile ||
    (profile.role !== 'admin' && profile.role !== 'super_admin')
  ) {
    throw redirect({ to: '/customers' })
  }
  return { session, profile }
}
