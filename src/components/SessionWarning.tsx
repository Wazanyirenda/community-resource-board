'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react'
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext'

export function SessionWarning() {
  const { isSessionExpiring, timeUntilExpiry, extendSession, signOut } = useEnhancedAuth()
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (!isSessionExpiring) return

    setCountdown(timeUntilExpiry)
    
    const interval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [isSessionExpiring, timeUntilExpiry])

  if (!isSessionExpiring) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-lg">Session Expiring Soon</CardTitle>
          </div>
          <CardDescription>
            Your session will expire in {countdown} minute{countdown !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>You'll be automatically signed out to protect your account</span>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={extendSession} 
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Stay Signed In
            </Button>
            <Button 
              variant="outline" 
              onClick={signOut}
              className="flex-1"
            >
              Sign Out Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

