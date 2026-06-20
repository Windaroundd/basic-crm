import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchActiveProducts,
  fetchCustomerPrices,
  saveCustomerPrices,
} from '../api'

export function useActiveProducts() {
  return useQuery({
    queryKey: ['products', 'active'],
    queryFn: fetchActiveProducts,
  })
}

export function useCustomerPrices(customerId: string | undefined) {
  return useQuery({
    queryKey: ['customer-prices', customerId],
    queryFn: () => fetchCustomerPrices(customerId as string),
    enabled: !!customerId,
  })
}

export function useSaveCustomerPrices(customerId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (entries: { product_id: string; price: number | null }[]) =>
      saveCustomerPrices(customerId as string, entries),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customer-prices', customerId],
      })
      toast.success('Đã lưu giá riêng')
    },
    onError: (error) => toast.error(error.message),
  })
}
