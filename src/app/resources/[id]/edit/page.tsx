'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ResourceForm, type ResourceFormData } from '@/components/ResourceForm'
import { getResource, updateResource, type Resource } from '@/lib/resources'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'

interface EditResourcePageProps {
  params: {
    id: string
  }
}

export default function EditResourcePage({ params }: EditResourcePageProps) {
  const [resource, setResource] = useState<Resource | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingResource, setIsLoadingResource] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await getResource(params.id)
        
        // Check if user owns this resource
        if (!user || data.user_id !== user.id) {
          setError('You can only edit your own resources')
          return
        }
        
        setResource(data)
      } catch (error: any) {
        setError(error.message || 'Resource not found')
      } finally {
        setIsLoadingResource(false)
      }
    }

    if (user) {
      fetchResource()
    }
  }, [params.id, user])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to edit resources.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoadingResource) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading resource...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Resource Not Found</h1>
          <p className="text-gray-600 mb-6">The resource you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (data: ResourceFormData) => {
    setIsLoading(true)
    try {
      await updateResource(params.id, data, user.id)
      router.push('/dashboard?tab=resources&success=updated')
    } catch (error) {
      throw error // Let ResourceForm handle the error display
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard?tab=resources')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Form */}
      <ResourceForm
        resource={resource}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        title="Edit Resource"
        description="Update the details of your shared resource."
        submitLabel="Update Resource"
      />
    </div>
  )
}
