import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  updateCustomer,
} from '../api'
import type { CustomerFormValues } from '../schemas'

const LIST_KEY = ['customers', 'list'] as const

export function useCustomers() {
  return useQuery({
    queryKey: LIST_KEY,
    queryFn: fetchCustomers,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: CustomerFormValues) => createCustomer(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Đã thêm khách hàng')
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: CustomerFormValues }) =>
      updateCustomer(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Đã cập nhật khách hàng')
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Đã xóa khách hàng')
    },
    onError: (error) => toast.error(error.message),
  })
}
