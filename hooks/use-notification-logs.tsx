"use client"

import { useState, useEffect } from "react"
import { getLogs, type NotificationLog } from "@/lib/notification-service"
import { API_BASE } from "@/lib/config"

let socketPromise: Promise<any> | null = null
async function getSocket() {
  if (!socketPromise) {
    socketPromise = import('socket.io-client').then(({ io }) => io(API_BASE, { transports: ['websocket'] }))
  }
  return socketPromise
}

interface UseNotificationLogsReturn {
  logs: NotificationLog[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useNotificationLogs(): UseNotificationLogsReturn {
  const [logs, setLogs] = useState<NotificationLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getLogs()
      setLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch logs"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    let unsub: (() => void) | undefined
    let interval: any

    ;(async () => {
      try {
        const socket = await getSocket()
        socket.on('connect_error', () => {
          // fallback to polling if websocket fails
          if (!interval) interval = setInterval(fetchLogs, 5000)
        })
        socket.on('log:update', () => {
          fetchLogs()
        })
        unsub = () => {
          socket.off('log:update')
          socket.disconnect()
        }
      } catch {
        interval = setInterval(fetchLogs, 5000)
      }
    })()

    return () => {
      if (unsub) unsub()
      if (interval) clearInterval(interval)
    }
  }, [])

  return { logs, isLoading, error, refetch: fetchLogs }
}
