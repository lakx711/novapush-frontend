// Get API base URL from environment variables
const getApiBase = (): string => {
  // Check for NEXT_PUBLIC_API_BASE first (production)
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  } else {
    // Server-side
    return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'
  }
}

export const API_BASE = getApiBase()

// Check if we're in production
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// Socket.IO URL (same as API base)
export const SOCKET_URL = API_BASE
