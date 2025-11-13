"use client"

import { Card } from "@/components/ui/card"
import { formatTimeAgo } from "@/lib/dashboard-service"

interface Activity {
  id: string
  type: "email" | "sms" | "push"
  recipients: number
  successRate: number
  timestamp: Date
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "email":
        return "Email campaign sent"
      case "sms":
        return "SMS campaign sent"
      case "push":
        return "Push notification sent"
      default:
        return "Notification sent"
    }
  }

  return (
    <Card className="glow-card p-6 space-y-4">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4 pb-3 border-b border-border/50 last:border-0">
            <div className="w-2 h-2 rounded-full bg-accent pulse-glow" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {getTypeLabel(activity.type)} to {activity.recipients} users
              </p>
              <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent">{activity.successRate}% Success</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
