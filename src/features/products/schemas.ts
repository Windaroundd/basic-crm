import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  unit: z.string().optional(),
  retail_price: z.number().min(0, 'Giá không hợp lệ'),
  wholesale_price: z.number().min(0, 'Giá không hợp lệ'),
  is_active: z.boolean(),
})

export type ProductValues = z.infer<typeof productSchema>
