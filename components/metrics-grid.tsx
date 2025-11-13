"use client"

import { StatsCard } from "@/components/stats-card"
import { Send, CheckCircle2, AlertCircle, Zap } from "lucide-react"

interface MetricsGridProps {
  totalSent: number
  successRate: number
  activeUsers: number
  avgDeliveryTime: number
}

export function MetricsGrid({ totalSent, successRate, activeUsers, avgDeliveryTime }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Total Sent" value={totalSent.toLocaleString()} trend={12} icon={<Send className="w-6 h-6" />} />
      <StatsCard title="Success Rate" value={`${successRate}%`} trend={2} icon={<CheckCircle2 className="w-6 h-6" />} />
      <StatsCard
        title="Active Users"
        value={activeUsers.toLocaleString()}
        trend={8}
        icon={<Zap className="w-6 h-6" />}
      />
      <StatsCard
        title="Avg. Delivery"
        value={`${avgDeliveryTime}s`}
        trend={-5}
        icon={<AlertCircle className="w-6 h-6" />}
      />
    </div>
  )
}
