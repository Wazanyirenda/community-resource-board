import { supabase } from './supabase'

const STORAGE_BUCKET = 'resource-images'

export interface ImageUploadResult {
  url: string
  path: string
  error?: string
}

// Upload image to Supabase Storage
export async function uploadImage(file: File, userId: string): Promise<ImageUploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { url: '', path: '', error: 'Please select an image file' }
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return { url: '', path: '', error: 'Image must be smaller than 5MB' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      return { url: '', path: '', error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path)

    return {
      url: publicUrl,
      path: data.path,
    }
  } catch (error: any) {
    return { url: '', path: '', error: error.message || 'Upload failed' }
  }
}

// Delete image from Supabase Storage
export async function deleteImage(path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Delete failed' }
  }
}

// Generate optimized image URL with transformations
export function getOptimizedImageUrl(url: string, width?: number, height?: number, quality = 80): string {
  if (!url || !url.includes('supabase')) return url
  
  const params = new URLSearchParams()
  if (width) params.append('width', width.toString())
  if (height) params.append('height', height.toString())
  params.append('quality', quality.toString())
  params.append('format', 'webp')
  
  return `${url}?${params.toString()}`
}

