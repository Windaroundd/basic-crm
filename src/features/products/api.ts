import { supabase } from '@/lib/supabase'
import type { ProductValues } from './schemas'
import type { Product } from './types'

function normalize(values: ProductValues) {
  return {
    name: values.name.trim(),
    unit: values.unit?.trim() || null,
    retail_price: values.retail_price,
    wholesale_price: values.wholesale_price,
    is_active: values.is_active,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createProduct(values: ProductValues) {
  const { data, error } = await supabase
    .from('products')
    .insert(normalize(values))
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProduct(id: string, values: ProductValues) {
  const { data, error } = await supabase
    .from('products')
    .update(normalize(values))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}
