'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { SocialResourceForm, type ResourceFormData } from '@/components/SocialResourceForm'
import { createResource } from '@/lib/resources'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function NewResourcePage() {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Join to Share Resources</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Sign in to start sharing with your community and discover amazing resources from your neighbors.
          </p>
          <div className="space-y-3">
            <Link href="/signup" className="block">
              <Button className="w-full">
                Create Account
              </Button>
            </Link>
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (data: ResourceFormData) => {
    setIsLoading(true)
    try {
      await createResource(data, user.id)
      router.push('/dashboard?tab=resources&success=created')
    } catch (error) {
      throw error // Let SocialResourceForm handle the error display
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Share with Your Community
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Post a resource to help your neighbors. Whether it's something you're giving away, lending, or offering as a service.
          </p>
        </div>

        {/* Social Media Style Form */}
        <SocialResourceForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
