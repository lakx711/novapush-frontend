"use client"

import { useState, useEffect } from "react"
import { getDashboardMetrics, type DashboardMetrics } from "@/lib/dashboard-service"
import { API_BASE } from "@/lib/config"

let socketPromise: Promise<any> | null = null
async function getSocket() {
  if (!socketPromise) {
    socketPromise = import('socket.io-client').then(({ io }) => io(API_BASE, { transports: ['websocket'] }))
  }
  return socketPromise
}

interface UseDashboardMetricsReturn {
  metrics: DashboardMetrics | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useDashboardMetrics(): UseDashboardMetricsReturn {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMetrics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getDashboardMetrics()
      setMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch metrics"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    let unsub: (() => void) | undefined
    let interval: any

    ;(async () => {
      try {
        const socket = await getSocket()
        socket.on('connect_error', () => {
          // fallback to polling if websocket fails
          if (!interval) interval = setInterval(fetchMetrics, 10000)
        })
        socket.on('log:update', () => {
          fetchMetrics()
        })
        unsub = () => {
          socket.off('log:update')
          socket.disconnect()
        }
      } catch {
        interval = setInterval(fetchMetrics, 10000)
      }
    })()

    return () => {
      if (unsub) unsub()
      if (interval) clearInterval(interval)
    }
  }, [])

  return { metrics, isLoading, error, refetch: fetchMetrics }
}
