import { z } from 'zod'

export const signInSchema = z.object({
  username: z.string().min(1, 'Nhập tên đăng nhập'),
  password: z.string().min(1, 'Nhập mật khẩu'),
})

export type SignInValues = z.infer<typeof signInSchema>
