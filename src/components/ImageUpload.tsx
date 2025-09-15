'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { uploadImage, deleteImage, getOptimizedImageUrl } from '@/lib/storage'
import { useAuth } from '@/contexts/AuthContext'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
  className?: string
  disabled?: boolean
}

export function ImageUpload({ 
  value, 
  onChange, 
  onError, 
  className = '', 
  disabled = false 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imagePath, setImagePath] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleFiles = useCallback(async (files: FileList) => {
    if (!user || files.length === 0) return

    const file = files[0]
    setUploading(true)
    setUploadProgress(0)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90))
    }, 100)

    try {
      const result = await uploadImage(file, user.id)
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.error) {
        onError?.(result.error)
      } else {
        onChange(result.url)
        setImagePath(result.path)
      }
    } catch (error: any) {
      clearInterval(progressInterval)
      onError?.(error.message || 'Upload failed')
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }, [user, onChange, onError])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled || !e.dataTransfer.files) return
    handleFiles(e.dataTransfer.files)
  }, [disabled, handleFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    handleFiles(e.target.files)
    // Reset input value to allow selecting same file again
    e.target.value = ''
  }, [handleFiles])

  const handleRemove = async () => {
    if (imagePath) {
      try {
        await deleteImage(imagePath)
      } catch (error) {
        console.error('Failed to delete image:', error)
      }
    }
    onChange('')
    setImagePath('')
  }

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!value ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
            ${dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-sm text-gray-600">Uploading image...</p>
                <div className="w-full max-w-xs">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {uploadProgress}% complete
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
                {dragActive && (
                  <div className="absolute inset-0 bg-blue-50 bg-opacity-50 rounded-lg flex items-center justify-center">
                    <p className="text-blue-600 font-medium">Drop image here</p>
                  </div>
                )}
              </>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || uploading}
          />
        </div>
      ) : (
        <div className="relative">
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-gray-100">
            <img
              src={getOptimizedImageUrl(value, 400, 250)}
              alt="Uploaded image"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to original image if optimization fails
                e.currentTarget.src = value
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={openFileDialog}
                  disabled={disabled}
                >
                  <ImageIcon className="w-4 h-4 mr-1" />
                  Replace
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                  disabled={disabled}
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
          
          {/* Hidden input for replace functionality */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
        </div>
      )}
    </div>
  )
}

