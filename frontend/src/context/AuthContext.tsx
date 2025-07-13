'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types/user'
// import Cookies from 'js-cookie' // Import js-cookie
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

// Define a user type or interface

// Create the context
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null // Thêm refreshToken
  setAccessToken: (accessToken: string | null) => void
  setRefreshToken: (refreshToken: string | null) => void // Thêm setter cho refreshToken
  setIsAuthenticated: (isAuthenticated: boolean) => void
  setUser: (user: User | null) => void
  // login: any
  logout: () => void
  refreshAccessToken: () => Promise<string | null> // Thêm refreshAccessToken vào đây
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to access the context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Create a provider component
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null) // Thêm refreshToken state
  const router = useRouter()
  const pathname = usePathname() // Get the current route from the router

  useEffect(() => {
    // set isAuthenticated to true if have cookie in browser name 'jwt'
    const storedUser = localStorage.getItem('user')
    const persisted = localStorage.getItem('persist') === 'persist'
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken') // Thêm dòng này

    if (persisted && storedUser && storedAccessToken && storedRefreshToken) {
      setIsAuthenticated(true)
      setUser(JSON.parse(storedUser))
      setAccessToken(storedAccessToken)
      setRefreshToken(storedRefreshToken) // Thêm dòng này
    }
  }, [])

  useEffect(() => {
    // set isAuthenticated to true if have cookie in browser name 'jwt'
    if (localStorage.getItem('persist') && pathname === '/login') {
      router.push('/')
    } else if (localStorage.getItem('persist')) {
      if (pathname === '/login' || pathname === '/register') {
        router.push('/')
      }
    } else if (
      !localStorage.getItem('persist') &&
      pathname !== '/login' &&
      pathname !== '/register' &&
      pathname !== '/register/business' &&
      pathname !== '/register/personal' &&
      pathname !== '/forgot-password' &&
      !pathname.startsWith('/verify')
    ) {
      router.push('/login')
      return
    }
  }, [router, pathname])

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('persist')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken') // Thêm dòng này
    localStorage.removeItem('role')

    // Reset states
    setUser(null)
    setIsAuthenticated(false)
    setAccessToken(null)
    setRefreshToken(null) // Thêm dòng này

    // Redirect to login
    router.push('/login')
  }

  const refreshAccessToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken')
      if (!storedRefreshToken) {
        logout()
        return null
      }

      const response = await fetch('/api/v1/users/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedRefreshToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAccessToken(data.token)
        localStorage.setItem('accessToken', data.token)
        return data.token
      } else {
        logout()
        return null
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      logout()
      return null
    }
  }

  // Provide user, login, and logout values to the context
  const contextValues: AuthContextType = {
    user,
    setUser,
    logout,
    accessToken,
    setAccessToken,
    refreshToken, // Thêm refreshToken
    setRefreshToken, // Thêm setRefreshToken
    isAuthenticated,
    setIsAuthenticated,
    refreshAccessToken // Nếu muốn export function này
  }

  return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>
}
