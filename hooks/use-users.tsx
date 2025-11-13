"use client"

import { useState, useEffect } from "react"
import { getUsers, type AppUser } from "@/lib/user-service"

interface UseUsersReturn {
  users: AppUser[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<AppUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch users"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return { users, isLoading, error, refetch: fetchUsers }
}
