import { supabase } from '@/lib/supabase'
import type { CustomerFormValues } from './schemas'
import type { Customer } from './types'

function normalize(values: CustomerFormValues) {
  return {
    name: values.name.trim(),
    status: values.status,
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

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
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
