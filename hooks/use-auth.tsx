"use client"

import { useState, useEffect, useContext, createContext, type ReactNode } from "react"
import { isAuthenticated, removeAuthToken, getCurrentUser, fetchCurrentUser, type User } from "@/lib/auth-utils"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()

    const handleStorageChange = () => {
      checkAuth()
    }
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const checkAuth = async () => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setIsLoading(false)
      } else {
        const fetched = await fetchCurrentUser()
        setUser(fetched)
        setIsLoading(false)
      }
    } else {
      setUser(null)
      setIsLoading(false)
    }
  }

  const logout = () => {
    removeAuthToken()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, logout, checkAuth }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
