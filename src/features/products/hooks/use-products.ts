import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '../api'
import type { ProductValues } from '../schemas'

export function useProducts() {
  return useQuery({
    queryKey: ['products', 'list'],
    queryFn: fetchProducts,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ProductValues) => createProduct(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Đã thêm sản phẩm')
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProductValues }) =>
      updateProduct(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Đã cập nhật sản phẩm')
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Đã xóa sản phẩm')
    },
    onError: (error) => toast.error(error.message),
  })
}
