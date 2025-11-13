"use client"

import { Card } from "@/components/ui/card"
import { formatTimeAgo, getChannelIcon } from "@/lib/dashboard-service"
import { Clock, Users, CheckCircle, XCircle } from "lucide-react"

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

  const getStatusColor = (successRate: number) => {
    if (successRate >= 90) return "text-green-600 bg-green-50 dark:bg-green-950/30"
    if (successRate >= 70) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30"
    return "text-red-600 bg-red-50 dark:bg-red-950/30"
  }

  const getStatusIcon = (successRate: number) => {
    if (successRate >= 90) return <CheckCircle className="w-3 h-3" />
    return <XCircle className="w-3 h-3" />
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="glow-card p-6 space-y-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity</p>
          <p className="text-xs">Send your first notification to see activity here</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="glow-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <span className="text-xs text-muted-foreground">{activities.length} recent items</span>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors">
            {/* Channel Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm">
              {getChannelIcon(activity.type)}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium truncate">
                  {getTypeLabel(activity.type)}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{activity.recipients}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(activity.timestamp)}
                </p>
                
                <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(activity.successRate)}`}>
                  {getStatusIcon(activity.successRate)}
                  <span>{activity.successRate}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
