import { z } from 'zod'

export const userRoles = ['super_admin', 'admin', 'staff'] as const

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Tối thiểu 3 ký tự')
    .regex(/^[a-z0-9._-]+$/, 'Chỉ gồm chữ thường, số và . _ -'),
  full_name: z.string().optional(),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  role: z.enum(userRoles),
})

export type CreateUserValues = z.infer<typeof createUserSchema>

export const editUserSchema = z.object({
  full_name: z.string().optional(),
  role: z.enum(userRoles),
  password: z
    .union([z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'), z.literal('')])
    .optional(),
})

export type EditUserValues = z.infer<typeof editUserSchema>
