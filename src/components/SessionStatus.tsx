'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Shield, Zap } from 'lucide-react'
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext'

export function SessionStatus() {
  const { user, sessionExpiry, timeUntilExpiry, isSessionExpiring, extendSession } = useEnhancedAuth()

  if (!user || !sessionExpiry) return null

  const getStatusColor = () => {
    if (isSessionExpiring) return 'text-amber-600 bg-amber-50'
    if (timeUntilExpiry > 60) return 'text-green-600 bg-green-50'
    return 'text-blue-600 bg-blue-50'
  }

  const getStatusText = () => {
    if (timeUntilExpiry < 60) return 'Expires soon'
    if (timeUntilExpiry < 1440) return `${Math.floor(timeUntilExpiry / 60)}h left` // Less than 24h, show hours
    return `${Math.floor(timeUntilExpiry / 1440)}d left` // Show days
  }

  return (
    <div className="hidden lg:flex items-center space-x-2 text-xs">
      <Badge variant="secondary" className={`${getStatusColor()} flex items-center space-x-1`}>
        <Shield className="w-3 h-3" />
        <span>{getStatusText()}</span>
      </Badge>
      
      {isSessionExpiring && (
        <Button
          size="sm"
          variant="ghost"
          onClick={extendSession}
          className="h-6 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
        >
          <Zap className="w-3 h-3 mr-1" />
          Extend
        </Button>
      )}
    </div>
  )
}

