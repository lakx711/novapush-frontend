import { getLogs } from "./notification-service"

export interface DashboardMetrics {
  totalSent: number
  successRate: number
  activeUsers: number
  avgDeliveryTime: number
  weeklyData: Array<{ name: string; deliveries: number; failures: number }>
  channelDistribution: Array<{ name: string; value: number }>
  recentActivity: Array<{
    id: string
    type: "email" | "sms" | "push"
    recipients: number
    successRate: number
    timestamp: Date
  }>
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const logs = await getLogs()

  const totalSent = logs.length
  const successful = logs.filter((l) => l.status === "delivered" || l.status === "sent").length
  const failed = logs.filter((l) => l.status === "failed").length
  const successRate = totalSent > 0 ? Math.round((successful / totalSent) * 100) : 0

  // Get unique recipients
  const uniqueUsers = new Set(logs.map((l) => l.recipientId)).size
  const activeUsers = uniqueUsers

  // Calculate average delivery time
  const deliveredLogs = logs.filter((l) => l.deliveredAt)
  const avgDeliveryTime =
    deliveredLogs.length > 0
      ? Math.round(
          deliveredLogs.reduce((acc, log) => {
            const time = log.deliveredAt ? log.deliveredAt.getTime() - log.sentAt.getTime() : 0
            return acc + time
          }, 0) / deliveredLogs.length,
        )
      : 0

  // Build weekly data from logs
  const weeklyMap: Map<string, { deliveries: number; failures: number }> = new Map()
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  days.forEach((day) => weeklyMap.set(day, { deliveries: 0, failures: 0 }))

  logs.forEach((log) => {
    const date = new Date(log.sentAt)
    const dayIndex = date.getDay()
    const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1]
    const current = weeklyMap.get(dayName) || { deliveries: 0, failures: 0 }
    if (log.status === "delivered" || log.status === "sent") {
      current.deliveries++
    } else if (log.status === "failed") {
      current.failures++
    }
    weeklyMap.set(dayName, current)
  })

  const weeklyData = days.map((day) => {
    const data = weeklyMap.get(day) || { deliveries: 0, failures: 0 }
    return {
      name: day,
      deliveries: data.deliveries,
      failures: data.failures
    }
  })

  // Calculate channel distribution
  const channelMap: Map<string, number> = new Map([
    ["Email", 0],
    ["SMS", 0],
    ["Push", 0],
  ])

  logs.forEach((log) => {
    const channel = log.channel.charAt(0).toUpperCase() + log.channel.slice(1)
    channelMap.set(channel, (channelMap.get(channel) || 0) + 1)
  })

  const total = logs.length
  const channelDistribution = Array.from(channelMap.entries())
    .map(([name, count]) => ({
      name,
      value: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .filter((item) => item.value > 0)

  // Build recent activity
  const recentActivity = logs
    .slice(-5)
    .reverse()
    .map((log) => {
      const channel = log.channel as "email" | "sms" | "push"
      return {
        id: log.id,
        type: channel,
        recipients: 1,
        successRate: (log.status === "delivered" || log.status === "sent") ? 100 : 0,
        timestamp: log.sentAt,
      }
    })

  return {
    totalSent,
    successRate,
    activeUsers,
    avgDeliveryTime,
    weeklyData,
    channelDistribution,
    recentActivity,
  }
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function getChannelIcon(type: string) {
  switch (type) {
    case "email":
      return "✉️"
    case "sms":
      return "💬"
    case "push":
      return "🔔"
    default:
      return "📤"
  }
}
