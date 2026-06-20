import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/features/auth'
import type { CreateUserValues, EditUserValues } from './schemas'

export async function fetchUsers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

async function invokeManageUsers(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('manage-users', {
    body,
  })
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const payload = await error.context.json().catch(() => null)
      throw new Error(payload?.error ?? error.message)
    }
    throw error
  }
  if (data?.error) throw new Error(data.error as string)
  return data
}

export function createUser(values: CreateUserValues) {
  return invokeManageUsers({
    action: 'create',
    username: values.username,
    password: values.password,
    full_name: values.full_name ?? null,
    role: values.role,
  })
}

export function updateUser(id: string, values: EditUserValues) {
  return invokeManageUsers({
    action: 'update',
    id,
    role: values.role,
    full_name: values.full_name ?? null,
    password: values.password ? values.password : undefined,
  })
}

export function deleteUser(id: string) {
  return invokeManageUsers({ action: 'delete', id })
}
