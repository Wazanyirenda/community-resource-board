'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  
  // TODO: Replace with actual auth state when authentication is implemented
  const isAuthenticated = false

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-lg md:text-xl text-blue-600 truncate">
            <span className="hidden sm:inline">Community Resource Board</span>
            <span className="sm:hidden">CRB</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Only show Dashboard if authenticated */}
            {isAuthenticated && (
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
            )}
            
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  Profile
                </Button>
                <Button variant="ghost" size="sm">
                  Sign Out
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Only show Dashboard if authenticated */}
              {isAuthenticated && (
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-gray-900 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              
              {!isAuthenticated ? (
                <div className="flex flex-col space-y-3 pt-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Profile
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full">
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
