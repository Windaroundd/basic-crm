import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  fetchCustomerChartRows,
  fetchCustomerStats,
  updateCustomer,
  type CustomerListParams,
} from '../api'
import type { CustomerFormValues } from '../schemas'

export function useCustomers(params: CustomerListParams) {
  return useQuery({
    queryKey: ['customers', 'list', params],
    queryFn: () => fetchCustomers(params),
    placeholderData: keepPreviousData,
  })
}

export function useCustomerStats() {
  return useQuery({
    queryKey: ['customers', 'stats'],
    queryFn: fetchCustomerStats,
  })
}

export function useCustomerCharts() {
  return useQuery({
    queryKey: ['customers', 'charts'],
    queryFn: fetchCustomerChartRows,
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
