import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createUser, deleteUser, fetchUsers, updateUser } from '../api'
import type { CreateUserValues, EditUserValues } from '../schemas'

const LIST_KEY = ['users', 'list'] as const

export function useUsers() {
  return useQuery({
    queryKey: LIST_KEY,
    queryFn: fetchUsers,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: CreateUserValues) => createUser(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Đã tạo tài khoản')
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: EditUserValues }) =>
      updateUser(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Đã cập nhật tài khoản')
    },
    onError: (error) => toast.error(error.message),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Đã xóa tài khoản')
    },
    onError: (error) => toast.error(error.message),
  })
}
