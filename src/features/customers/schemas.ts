import { z } from 'zod'

export const customerStatuses = ['active', 'inactive'] as const
export type CustomerStatus = (typeof customerStatuses)[number]

export const statusLabels: Record<CustomerStatus, string> = {
  active: 'Đang hoạt động',
  inactive: 'Ngừng hoạt động',
}

export const customerSources = [
  'referral',
  'ads',
  'website',
  'social',
  'other',
] as const
export type CustomerSource = (typeof customerSources)[number]

export const sourceLabels: Record<CustomerSource, string> = {
  referral: 'Giới thiệu',
  ads: 'Quảng cáo',
  website: 'Website',
  social: 'Mạng xã hội',
  other: 'Khác',
}

export const genders = ['male', 'female', 'other'] as const
export type Gender = (typeof genders)[number]

export const genderLabels: Record<Gender, string> = {
  male: 'Nam',
  female: 'Nữ',
  other: 'Khác',
}

export const customerFormSchema = z.object({
  // Bắt buộc
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  phone: z.string().trim().min(1, 'Nhập số điện thoại'),
  address: z.string().trim().min(1, 'Nhập địa chỉ'),
  status: z.enum(customerStatuses),
  is_lead: z.boolean(),
  // Optional
  email: z
    .union([z.string().email('Email không hợp lệ'), z.literal('')])
    .optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  tax_code: z.string().optional(),
  website: z
    .union([z.string().url('Website không hợp lệ'), z.literal('')])
    .optional(),
  city: z.string().optional(),
  source: z.union([z.enum(customerSources), z.literal('')]).optional(),
  date_of_birth: z.string().optional(),
  gender: z.union([z.enum(genders), z.literal('')]).optional(),
  notes: z.string().optional(),
})

export type CustomerFormValues = z.infer<typeof customerFormSchema>
