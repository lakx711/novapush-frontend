"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { NotificationLog } from "@/lib/notification-service"

interface LogsTableProps {
  logs: NotificationLog[]
}

export function LogsTable({ logs }: LogsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-500"
      case "sent":
        return "bg-blue-500/10 text-blue-500"
      case "failed":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <Card key={log.id} className="glow-card p-4 hover:border-accent/60 transition-all">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getChannelIcon(log.channel)}</span>
                <div>
                  <h3 className="font-semibold">{log.templateName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {log.recipientName} ({log.recipientEmail})
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-right">
              <Badge className={getStatusColor(log.status)}>
                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
              </Badge>
              <p className="text-xs text-muted-foreground">{formatTime(log.sentAt)}</p>
              {log.errorMessage && <p className="text-xs text-destructive">{log.errorMessage}</p>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
