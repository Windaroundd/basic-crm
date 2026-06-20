import type { Database } from '@/types/database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Role = Database['public']['Enums']['app_role']

export const roleLabels: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  staff: 'Nhân viên',
}
