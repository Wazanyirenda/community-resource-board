'use client'

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  sessionExpiry: Date | null
  isSessionExpiring: boolean
  timeUntilExpiry: number
  signUp: (email: string, password: string, name?: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  extendSession: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
  idleTimeoutMinutes?: number // Auto-logout after inactivity
  sessionWarningMinutes?: number // Warning before expiry
}

export function EnhancedAuthProvider({ 
  children, 
  idleTimeoutMinutes = 30, // 30 minutes of inactivity
  sessionWarningMinutes = 5 // Warn 5 minutes before expiry
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null)
  const [isSessionExpiring, setIsSessionExpiring] = useState(false)
  const [timeUntilExpiry, setTimeUntilExpiry] = useState(0)
  
  const idleTimerRef = useRef<NodeJS.Timeout>()
  const expiryTimerRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef<Date>(new Date())

  // Track user activity
  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = new Date()
    
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }
    
    if (user) {
      idleTimerRef.current = setTimeout(() => {
        // Auto sign out after idle timeout
        signOut()
      }, idleTimeoutMinutes * 60 * 1000)
    }
  }, [user, idleTimeoutMinutes])

  // Update session expiry countdown
  useEffect(() => {
    if (!sessionExpiry) return

    const interval = setInterval(() => {
      const now = new Date()
      const timeLeft = sessionExpiry.getTime() - now.getTime()
      const minutesLeft = Math.floor(timeLeft / (1000 * 60))
      
      setTimeUntilExpiry(minutesLeft)
      
      // Show warning when close to expiry
      if (minutesLeft <= sessionWarningMinutes && minutesLeft > 0) {
        setIsSessionExpiring(true)
      } else {
        setIsSessionExpiring(false)
      }
      
      // Auto-refresh if very close to expiry
      if (minutesLeft <= 1 && minutesLeft > 0) {
        refreshSession()
      }
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [sessionExpiry, sessionWarningMinutes])

  // Set up activity listeners
  useEffect(() => {
    if (!user) return

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, { passive: true })
    })

    // Initial timer setup
    resetIdleTimer()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer)
      })
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [user, resetIdleTimer])

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setUser(session.user)
        setSessionExpiry(new Date(session.expires_at! * 1000))
      } else {
        setUser(null)
        setSessionExpiry(null)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.expires_at)
        
        if (session) {
          setUser(session.user)
          setSessionExpiry(new Date(session.expires_at! * 1000))
          resetIdleTimer()
        } else {
          setUser(null)
          setSessionExpiry(null)
          setIsSessionExpiring(false)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current)
    }
  }, [resetIdleTimer])

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    })
    if (error) throw error
    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    // Clear timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current)
  }

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error) throw error
      
      if (session) {
        setSessionExpiry(new Date(session.expires_at! * 1000))
        setIsSessionExpiring(false)
      }
    } catch (error) {
      console.error('Failed to refresh session:', error)
      signOut()
    }
  }

  const extendSession = () => {
    resetIdleTimer()
    refreshSession()
  }

  const value = {
    user,
    loading,
    sessionExpiry,
    isSessionExpiring,
    timeUntilExpiry,
    signUp,
    signIn,
    signOut,
    refreshSession,
    extendSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useEnhancedAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider')
  }
  return context
}

