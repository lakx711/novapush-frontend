// Authentication utility functions for token management and validation

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null
}

export interface User {
  id: string
  email: string
  name: string
}

const STORAGE_KEY = "novapush_users"

const getMockUsers = (): Map<string, { email: string; password: string; name: string }> => {
  if (typeof window === "undefined") return new Map()

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return new Map()

  const data = JSON.parse(stored)
  return new Map(Object.entries(data))
}

const saveMockUsers = (users: Map<string, { email: string; password: string; name: string }>) => {
  if (typeof window === "undefined") return

  const data = Object.fromEntries(users)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Initialize with demo account for testing
const initializeDemoAccount = () => {
  if (typeof window === "undefined") return

  const users = getMockUsers()
  if (users.size === 0) {
    users.set("demo@example.com", { email: "demo@example.com", password: "Demo123!", name: "Demo User" })
    saveMockUsers(users)
  }
}

// Call this on load
if (typeof window !== "undefined") {
  initializeDemoAccount()
}

export const signup = async (
  email: string,
  password: string,
  name: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { api } = await import('./api')
    const resp = await api.post('/auth/signup', { email, password, name })
    return resp.data?.success ? { success: true } : { success: false, error: resp.data?.message || 'Signup failed' }
  } catch (error: any) {
    const msg = error?.response?.data?.message || 'Signup failed'
    return { success: false, error: msg }
  }
}

export const login = async (
  email: string,
  password: string,
): Promise<{ success: boolean; token?: string; error?: string }> => {
  try {
    const { api } = await import('./api')
    const resp = await api.post('/auth/login', { email, password })
    const token = resp.data?.token as string | undefined
    if (!token) return { success: false, error: resp.data?.message || 'Login failed' }
    return { success: true, token }
  } catch (error: any) {
    const msg = error?.response?.data?.message || 'Login failed'
    return { success: false, error: msg }
  }
}

export const getCurrentUser = (): User | null => {
  const token = getAuthToken()
  if (!token) return null
  // Best-effort synchronous return: use cached info if present else null; caller can re-check via server
  return null
}

export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const { api } = await import('./api')
    const resp = await api.get('/auth/me')
    if (!resp.data?.success) return null
    return resp.data.user as User
  } catch {
    return null
  }
}
