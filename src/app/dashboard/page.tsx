'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Package, Heart, MessageCircle, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { getUserResources, deleteResource, toggleResourceAvailability, type Resource } from '@/lib/resources'
import { RESOURCE_CATEGORIES } from '@/lib/constants'
import { getOptimizedImageUrl, deleteImage } from '@/lib/storage'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
    
    const success = searchParams.get('success')
    if (success) {
      // Show success message briefly
      setTimeout(() => {
        const url = new URL(window.location.href)
        url.searchParams.delete('success')
        router.replace(url.pathname + url.search)
      }, 3000)
    }
  }, [searchParams, router])

  useEffect(() => {
    const fetchResources = async () => {
      if (user) {
        try {
          const data = await getUserResources(user.id)
          setResources(data)
        } catch (error) {
          console.error('Failed to fetch resources:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchResources()
  }, [user])

  const handleDeleteResource = async (resourceId: string) => {
    if (!user || !confirm('Are you sure you want to delete this resource?')) return
    
    try {
      // Find the resource to get its image path for deletion
      const resourceToDelete = resources.find(r => r.id === resourceId)
      
      // Delete the resource from database
      await deleteResource(resourceId, user.id)
      
      // Delete the image from storage if it exists
      if (resourceToDelete?.image_url && resourceToDelete.image_url.includes('supabase')) {
        // Extract path from Supabase URL
        const urlParts = resourceToDelete.image_url.split('/')
        const bucketIndex = urlParts.findIndex(part => part === 'resource-images')
        if (bucketIndex !== -1 && bucketIndex + 1 < urlParts.length) {
          const imagePath = urlParts.slice(bucketIndex + 1).join('/')
          try {
            await deleteImage(imagePath)
          } catch (error) {
            console.error('Failed to delete image:', error)
          }
        }
      }
      
      setResources(prev => prev.filter(r => r.id !== resourceId))
    } catch (error) {
      console.error('Failed to delete resource:', error)
    }
  }

  const handleToggleAvailability = async (resourceId: string) => {
    if (!user) return
    
    try {
      const updatedResource = await toggleResourceAvailability(resourceId, user.id)
      setResources(prev => prev.map(r => 
        r.id === resourceId ? { ...r, is_available: updatedResource.is_available } : r
      ))
    } catch (error) {
      console.error('Failed to toggle availability:', error)
    }
  }

  const getCategoryLabel = (categoryValue: string) => {
    const category = RESOURCE_CATEGORIES.find(c => c.value === categoryValue)
    return category?.label || categoryValue
  }

  const success = searchParams.get('success')

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  const availableResources = resources.filter(r => r.is_available)
  const unavailableResources = resources.filter(r => !r.is_available)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {success === 'created' && 'Resource created successfully!'}
          {success === 'updated' && 'Resource updated successfully!'}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.user_metadata?.name || 'User'}!
      </h1>
        <p className="text-gray-600">
          Manage your shared resources and discover new ones in your community.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`py-2 px-1 border-b-2 transition-colors ${
              activeTab === 'resources'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Resources ({resources.length})
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Resources</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resources.length}</div>
                <p className="text-xs text-muted-foreground">
                  {availableResources.length} available, {unavailableResources.length} unavailable
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Resources you've saved
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  New inquiries
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Share a Resource</CardTitle>
                <CardDescription>
                  Post an item you'd like to share with your community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/resources/new">
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Post
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Browse Resources</CardTitle>
                <CardDescription>
                  Discover items shared by your neighbors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/resources" className="block">
                  <Button variant="outline" className="w-full">
                    <Package className="w-4 h-4 mr-2" />
                    Explore Community
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Add New Resource Button */}
          <div className="flex justify-end">
            <Link href="/resources/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Resource
              </Button>
            </Link>
          </div>

          {/* Resources List */}
          {resources.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources yet</h3>
                <p className="text-gray-600 mb-4">
                  Start building your community by sharing your first resource!
                </p>
                <Link href="/resources/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Share Your First Resource
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    {resource.image_url && (
                      <div className="w-full h-48 sm:w-32 sm:h-32 flex-shrink-0">
                        <img
                          src={getOptimizedImageUrl(resource.image_url, 300, 200)}
                          alt={resource.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to original image if optimization fails
                            e.currentTarget.src = resource.image_url || ''
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
                        <div className="flex-1 mb-3 sm:mb-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                            {resource.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {getCategoryLabel(resource.category)}
                            </Badge>
                            <Badge 
                              variant={resource.is_available ? "default" : "secondary"}
                              className={`text-xs ${resource.is_available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              {resource.is_available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleAvailability(resource.id)}
                            title={resource.is_available ? 'Mark as unavailable' : 'Mark as available'}
                            className="h-8 w-8 p-0"
                          >
                            {resource.is_available ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </Button>
                          <Link href={`/resources/${resource.id}/edit`}>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteResource(resource.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {resource.description}
                      </p>
                      
                      <p className="text-gray-500 text-xs">
                        📍 {resource.location} • Created {new Date(resource.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
