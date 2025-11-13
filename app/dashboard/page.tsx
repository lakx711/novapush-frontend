"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { MetricsGrid } from "@/components/metrics-grid"
import { EmptyState } from "@/components/empty-state"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { ActivityFeed } from "@/components/activity-feed"
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics"
import { AlertCircle, RefreshCw } from "lucide-react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts"
import { Send } from "lucide-react"

const COLORS = ["#667eea", "#10b981", "#f59e0b"]

function DashboardContent() {
  const { metrics, isLoading, error, refetch } = useDashboardMetrics()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
          <Navbar />
          <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const hasNotifications = (metrics?.totalSent ?? 0) > 0

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        <Navbar />

        <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 space-y-8">
          {!hasNotifications ? (
            <EmptyState
              icon={<Send className="w-16 h-16" />}
              title="No Notifications Yet"
              description="Start sending notifications to see real-time metrics, charts, and activity here."
              action={{
                label: "Send Your First Notification",
                onClick: () => {
                  // Navigate to send page
                },
              }}
            />
          ) : (
            <>
              <DashboardHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

              {metrics && (
                <>
                  <MetricsGrid
                    totalSent={metrics.totalSent}
                    successRate={metrics.successRate}
                    activeUsers={metrics.activeUsers}
                    avgDeliveryTime={metrics.avgDeliveryTime}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="glow-card lg:col-span-2 p-6 space-y-4">
                      <h3 className="text-lg font-semibold">Delivery Trend</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={metrics.weeklyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(102, 204, 255, 0.1)" />
                          <XAxis stroke="rgba(255, 255, 255, 0.5)" />
                          <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1a2e",
                              border: "1px solid rgba(102, 204, 255, 0.3)",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="deliveries"
                            stroke="rgba(102, 204, 255, 0.8)"
                            dot={false}
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="failures"
                            stroke="rgba(239, 68, 68, 0.6)"
                            dot={false}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>

                    <Card className="glow-card p-6 space-y-4">
                      <h3 className="text-lg font-semibold">Channel Usage</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={metrics.channelDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            dataKey="value"
                            label={({ name, value }: { name: string; value: number }) => `${name}: ${value}%`}
                            labelLine={false}
                          >
                            {metrics.channelDistribution.map((_, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]}
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1a2e",
                              border: "1px solid rgba(102, 204, 255, 0.3)",
                              borderRadius: "8px",
                            }}
                            formatter={(value: any) => [`${value}%`, "Usage"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 text-sm">
                        {metrics.channelDistribution.map((item, index) => (
                          <div key={item.name} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="text-muted-foreground">{item.name}</span>
                            </div>
                            <span className="font-semibold">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <ActivityFeed activities={metrics.recentActivity} />
                </>
              )}
              
              {error && (
                <div className="col-span-full">
                  <Card className="glow-card p-6 text-center">
                    <div className="text-red-500 mb-4">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-semibold">Failed to load dashboard data</p>
                      <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
                    </div>
                    <Button onClick={refetch} variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </Card>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
