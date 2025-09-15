'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ImagePlus, X } from 'lucide-react'
import { RESOURCE_CATEGORIES, type ResourceCategory } from '@/lib/constants'
import type { Resource } from '@/lib/resources'
import { ImageUpload } from '@/components/ImageUpload'

interface ResourceFormProps {
  resource?: Resource
  onSubmit: (data: ResourceFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  title: string
  description: string
  submitLabel: string
}

export interface ResourceFormData {
  title: string
  description: string
  category: ResourceCategory
  location: string
  image_url?: string
}

export function ResourceForm({
  resource,
  onSubmit,
  onCancel,
  isLoading = false,
  title,
  description,
  submitLabel
}: ResourceFormProps) {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: resource?.title || '',
    description: resource?.description || '',
    category: (resource?.category as ResourceCategory) || 'other',
    location: resource?.location || '',
    image_url: resource?.image_url || ''
  })
  const [error, setError] = useState('')
  const [imageError, setImageError] = useState('')

  const handleChange = (field: keyof ResourceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    if (field === 'image_url') setImageError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }
    if (!formData.location.trim()) {
      setError('Location is required')
      return
    }

    try {
      await onSubmit(formData)
    } catch (error: any) {
      setError(error.message || 'Something went wrong')
    }
  }

  const selectedCategory = RESOURCE_CATEGORIES.find(cat => cat.value === formData.category)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Resource Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Electric Drill, Math Textbook, Free Piano Lessons"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleChange('category', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div>
                      <div className="font-medium">{category.label}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory && (
              <p className="text-sm text-gray-600">
                {selectedCategory.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the resource, its condition, any special instructions, and how it can help others..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={isLoading}
              rows={4}
              required
            />
            <p className="text-sm text-gray-500">
              Be specific! Include condition, pickup instructions, and any requirements.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="e.g., Downtown Seattle, Near University District, 12345"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-sm text-gray-500">
              General area or neighborhood (don't include your exact address)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Resource Image (Optional)</Label>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => handleChange('image_url', url)}
              onError={setImageError}
              disabled={isLoading}
            />
            {imageError && (
              <p className="text-sm text-red-600">{imageError}</p>
            )}
            <p className="text-sm text-gray-500">
              Upload a photo to help others see what you're sharing. Drag and drop or click to browse.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                submitLabel
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
