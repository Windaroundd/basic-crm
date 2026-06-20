export { CustomersPage } from './components/customers-page'
export {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from './hooks/use-customers'
export {
  customerFormSchema,
  customerStatuses,
  statusLabels,
  type CustomerFormValues,
  type CustomerStatus,
} from './schemas'
export type { Customer } from './types'
