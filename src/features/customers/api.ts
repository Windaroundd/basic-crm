import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { CustomerFormValues, CustomerStatus } from './schemas'
import type { Customer } from './types'

export type CustomerSortField = 'created_at' | 'name'

export type CustomerListParams = {
  q?: string
  status?: CustomerStatus
  lead?: boolean
  page: number
  pageSize: number
  sort: CustomerSortField
  dir: 'asc' | 'desc'
}

export type CustomerListItem = Customer & { price_count: number }

export type CustomerListResult = {
  rows: CustomerListItem[]
  total: number
}

function normalize(values: CustomerFormValues) {
  return {
    name: values.name.trim(),
    status: values.status,
    customer_type: values.customer_type,
    is_lead: values.is_lead,
    email: values.email?.trim() || null,
    phone: values.phone?.trim() || null,
    company: values.company?.trim() || null,
    position: values.position?.trim() || null,
    tax_code: values.tax_code?.trim() || null,
    website: values.website?.trim() || null,
    address: values.address?.trim() || null,
    city: values.city?.trim() || null,
    source: values.source || null,
    date_of_birth: values.date_of_birth || null,
    gender: values.gender || null,
    notes: values.notes?.trim() || null,
  }
}

export async function fetchCustomers(
  params: CustomerListParams,
): Promise<CustomerListResult> {
  const { q, status, lead, page, pageSize, sort, dir } = params

  let query = supabase
    .from('customers')
    .select('*, customer_prices(count)', { count: 'exact' })

  const term = q?.trim().replace(/[,()]/g, ' ')
  if (term) {
    const like = `%${term}%`
    query = query.or(
      `name.ilike.${like},email.ilike.${like},phone.ilike.${like},company.ilike.${like}`,
    )
  }
  if (status) query = query.eq('status', status)
  if (typeof lead === 'boolean') query = query.eq('is_lead', lead)

  const from = (page - 1) * pageSize
  query = query
    .order(sort, { ascending: dir === 'asc' })
    .range(from, from + pageSize - 1)

  const { data, error, count } = await query
  if (error) throw error

  const rows: CustomerListItem[] = (data ?? []).map((row) => {
    const { customer_prices, ...rest } = row as Customer & {
      customer_prices?: { count: number }[]
    }
    return { ...rest, price_count: customer_prices?.[0]?.count ?? 0 }
  })

  return { rows, total: count ?? 0 }
}

export type CustomerChartRow = Pick<
  Customer,
  'created_at' | 'source' | 'status' | 'is_lead'
>

export async function fetchCustomerChartRows(): Promise<CustomerChartRow[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('created_at, source, status, is_lead')
  if (error) throw error
  return data ?? []
}

export type CustomerStats = {
  total: number
  active: number
  lead: number
  newThisMonth: number
}

export async function fetchCustomerStats(): Promise<CustomerStats> {
  const base = () =>
    supabase.from('customers').select('*', { count: 'exact', head: true })

  const now = new Date()
  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString()

  const [total, active, lead, newThisMonth] = await Promise.all(
    [
      base(),
      base().eq('status', 'active'),
      base().eq('is_lead', true),
      base().gte('created_at', monthStart),
    ].map(async (q) => {
      const { count, error } = await q
      if (error) throw error
      return count ?? 0
    }),
  )

  return { total, active, lead, newThisMonth }
}

export async function createCustomer(values: CustomerFormValues) {
  const { data, error } = await supabase
    .from('customers')
    .insert(normalize(values))
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCustomer(id: string, values: CustomerFormValues) {
  const { data, error } = await supabase
    .from('customers')
    .update(normalize(values))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase.from('customers').delete().eq('id', id)
  if (error) throw error
}

// ---- Giá riêng theo khách ----

export type PricingProduct = Pick<
  Database['public']['Tables']['products']['Row'],
  'id' | 'name' | 'unit' | 'retail_price' | 'wholesale_price'
>

export async function fetchActiveProducts(): Promise<PricingProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, unit, retail_price, wholesale_price')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export type CustomerPrice = { product_id: string; price: number }

export async function fetchCustomerPrices(
  customerId: string,
): Promise<CustomerPrice[]> {
  const { data, error } = await supabase
    .from('customer_prices')
    .select('product_id, price')
    .eq('customer_id', customerId)
  if (error) throw error
  return data ?? []
}

export async function saveCustomerPrices(
  customerId: string,
  entries: { product_id: string; price: number | null }[],
) {
  const toUpsert = entries
    .filter((e) => e.price != null)
    .map((e) => ({
      customer_id: customerId,
      product_id: e.product_id,
      price: e.price as number,
    }))
  const toDelete = entries
    .filter((e) => e.price == null)
    .map((e) => e.product_id)

  if (toUpsert.length) {
    const { error } = await supabase
      .from('customer_prices')
      .upsert(toUpsert, { onConflict: 'customer_id,product_id' })
    if (error) throw error
  }
  if (toDelete.length) {
    const { error } = await supabase
      .from('customer_prices')
      .delete()
      .eq('customer_id', customerId)
      .in('product_id', toDelete)
    if (error) throw error
  }
}
