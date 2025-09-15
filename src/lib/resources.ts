import { supabase } from './supabase'
import type { Database } from './supabase'

export type Resource = Database['public']['Tables']['resources']['Row']
export type ResourceInsert = Database['public']['Tables']['resources']['Insert']
export type ResourceUpdate = Database['public']['Tables']['resources']['Update']

export interface CreateResourceData {
  title: string
  description: string
  category: string
  location: string
  image_url?: string
}

export interface UpdateResourceData extends Partial<CreateResourceData> {
  is_available?: boolean
}

// Get all resources (public)
export async function getResources(limit = 20, offset = 0) {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      users (
        id,
        name,
        email,
        location
      )
    `)
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

// Get resources by user (private)
export async function getUserResources(userId: string) {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Get single resource with user info
export async function getResource(id: string) {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      users (
        id,
        name,
        email,
        location,
        avatar
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Create new resource
export async function createResource(resourceData: CreateResourceData, userId: string) {
  const { data, error } = await supabase
    .from('resources')
    .insert({
      ...resourceData,
      user_id: userId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Update resource
export async function updateResource(id: string, resourceData: UpdateResourceData, userId: string) {
  const { data, error } = await supabase
    .from('resources')
    .update({
      ...resourceData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId) // Ensure user owns the resource
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete resource
export async function deleteResource(id: string, userId: string) {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)
    .eq('user_id', userId) // Ensure user owns the resource

  if (error) throw error
}

// Toggle resource availability
export async function toggleResourceAvailability(id: string, userId: string) {
  // First get the current state
  const { data: resource, error: fetchError } = await supabase
    .from('resources')
    .select('is_available')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (fetchError) throw fetchError

  // Then update it
  const { data, error } = await supabase
    .from('resources')
    .update({ 
      is_available: !resource.is_available,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Search resources
export async function searchResources(query: string, category?: string, limit = 20) {
  let queryBuilder = supabase
    .from('resources')
    .select(`
      *,
      users (
        id,
        name,
        email,
        location
      )
    `)
    .eq('is_available', true)

  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (category && category !== 'all') {
    queryBuilder = queryBuilder.eq('category', category)
  }

  const { data, error } = await queryBuilder
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
