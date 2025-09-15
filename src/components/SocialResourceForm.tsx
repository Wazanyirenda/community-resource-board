'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Loader2, MapPin, Tag, X, Plus, Image as ImageIcon, Smile } from 'lucide-react'
import { RESOURCE_CATEGORIES, type ResourceCategory } from '@/lib/constants'
import { ImageUpload } from '@/components/ImageUpload'
import { useAuth } from '@/contexts/AuthContext'

interface SocialResourceFormProps {
  onSubmit: (data: ResourceFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export interface ResourceFormData {
  title: string
  description: string
  category: ResourceCategory
  location: string
  image_url?: string
}

export function SocialResourceForm({
  onSubmit,
  onCancel,
  isLoading = false
}: SocialResourceFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    description: '',
    category: 'other',
    location: '',
    image_url: ''
  })
  const [error, setError] = useState('')
  const [imageError, setImageError] = useState('')
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

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
      setError('Please tell us what you\'re sharing')
      return
    }
    if (!formData.description.trim()) {
      setError('Please add some details about your resource')
      return
    }
    if (!formData.location.trim()) {
      setError('Please add your location')
      return
    }

    try {
      await onSubmit(formData)
    } catch (error: any) {
      setError(error.message || 'Something went wrong')
    }
  }

  const selectedCategory = RESOURCE_CATEGORIES.find(cat => cat.value === formData.category)
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'You'
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{userName}</h3>
              <p className="text-xs text-gray-500">Sharing with the community</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-0">
          {error && (
            <div className="px-4 pb-3">
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="px-4 space-y-4">
            {/* Title Input */}
            <div className="space-y-2">
              <Input
                placeholder="What are you sharing today?"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                disabled={isLoading}
                className="border-0 text-lg font-medium placeholder-gray-400 focus-visible:ring-0 px-0 bg-transparent"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Textarea
                placeholder="Tell your neighbors about this resource... What condition is it in? Any special instructions? How can it help someone?"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={isLoading}
                rows={3}
                className="border-0 resize-none placeholder-gray-400 focus-visible:ring-0 px-0 bg-transparent"
              />
            </div>

            {/* Image Upload */}
            {showImageUpload && (
              <div className="space-y-2">
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => handleChange('image_url', url)}
                  onError={setImageError}
                  disabled={isLoading}
                  className="rounded-lg overflow-hidden"
                />
                {imageError && (
                  <p className="text-sm text-red-600 px-2">{imageError}</p>
                )}
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Action Buttons Row */}
          <div className="px-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 h-8 ${showImageUpload ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Photo</span>
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 h-8 ${showAdvanced ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Tag className="w-4 h-4" />
                  <span className="text-sm font-medium">Category</span>
                </Button>
              </div>

              <p className="text-xs text-gray-400">
                {formData.description.length}/500
              </p>
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <>
              <Separator />
              <div className="px-4 py-4 bg-gray-50 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      Category
                    </label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleChange('category', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESOURCE_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCategory && (
                      <p className="text-xs text-gray-500">
                        {selectedCategory.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Location
                    </label>
                    <Input
                      placeholder="e.g., Downtown, University Area"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500">
                      General area only - keep your address private
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Footer Actions */}
          <div className="px-4 py-4 flex justify-between items-center bg-gray-50">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Public post</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  'Share Resource'
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
