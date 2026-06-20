import { supabase } from '@/lib/supabase'
import type { SignInValues } from './schemas'
import type { Profile } from './types'

// Supabase Auth dùng email; ta map username -> email ẩn cố định.
// Người dùng chỉ thấy/nhập username, không cần email thật.
export const USERNAME_DOMAIN = 'users.thimut.local'

export function emailForUsername(username: string) {
  return `${username.trim().toLowerCase()}@${USERNAME_DOMAIN}`
}

export async function signIn({ username, password }: SignInValues) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailForUsername(username),
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function changePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string
  newPassword: string
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) throw new Error('Phiên đăng nhập đã hết hạn')

  // Xác minh mật khẩu hiện tại bằng cách đăng nhập lại
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })
  if (verifyError) throw new Error('Mật khẩu hiện tại không đúng')

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

export async function getMyProfile(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  if (error) throw error
  return data
}
