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
