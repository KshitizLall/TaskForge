"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "@/lib/api"

interface User {
  id: string
  email: string
  name: string
  username: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, username: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user and token on mount
    const storedUser = localStorage.getItem("taskforge-user")
    const storedToken = localStorage.getItem("taskforge-token")
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await authAPI.signin({ username, password })
      
      if (response.token) {
        // Store the token
        localStorage.setItem("taskforge-token", response.token)
        
        // For now, create a user object from the credentials
        // In a real app, you'd get user data from a separate endpoint
        const userData: User = {
          id: Date.now().toString(),
          username,
          email: `${username}@example.com`, // Placeholder
          name: username // Placeholder
        }
        
        setUser(userData)
        localStorage.setItem("taskforge-user", JSON.stringify(userData))
        setIsLoading(false)
        return true
      }
    } catch (error) {
      console.error('Login error:', error)
    }

    setIsLoading(false)
    return false
  }

  const signup = async (name: string, email: string, password: string, username: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Split name into first and last name
      const nameParts = name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      await authAPI.signup({
        username,
        password,
        first_name: firstName,
        last_name: lastName,
        email,
        role: 'user',
        gender: 'not_specified'
      })

      // After successful signup, automatically login
      const loginSuccess = await login(username, password)
      setIsLoading(false)
      return loginSuccess
    } catch (error) {
      console.error('Signup error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("taskforge-user")
    localStorage.removeItem("taskforge-token")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
