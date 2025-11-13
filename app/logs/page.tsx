"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { EmptyState } from "@/components/empty-state"
import { LogsTable } from "@/components/logs-table"
import { Card } from "@/components/ui/card"
import { useNotificationLogs } from "@/hooks/use-notification-logs"
import { DotSquare as LogSquare, CheckCircle2, AlertCircle, Send } from "lucide-react"
import { useMemo } from "react"

function LogsContent() {
  const { logs, isLoading } = useNotificationLogs()
  
  // Calculate stats from actual logs data
  const stats = useMemo(() => {
    const total = logs.length
    const sent = logs.filter(l => l.status === 'sent').length
    const delivered = logs.filter(l => l.status === 'delivered').length
    const failed = logs.filter(l => l.status === 'failed').length
    return { total, sent, delivered, failed }
  }, [logs])

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
          <Navbar />
          <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
              <p className="text-muted-foreground">Loading logs...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Logs</h1>
            <p className="text-muted-foreground pt-2">View notification delivery logs</p>
          </div>

          {logs.length === 0 ? (
            <EmptyState
              icon={<LogSquare className="w-16 h-16" />}
              title="No Logs Found"
              description="Start sending notifications to see delivery logs here."
              action={{
                label: "Send Notification",
                onClick: () => {},
              }}
            />
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glow-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Sent</p>
                      <p className="text-2xl font-bold mt-2">{stats.total}</p>
                    </div>
                    <Send className="w-8 h-8 text-accent opacity-50" />
                  </div>
                </Card>
                <Card className="glow-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Delivered</p>
                      <p className="text-2xl font-bold mt-2 text-green-500">{stats.delivered}</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                </Card>
                <Card className="glow-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Sent</p>
                      <p className="text-2xl font-bold mt-2">{stats.sent}</p>
                    </div>
                    <Send className="w-8 h-8 text-blue-500 opacity-50" />
                  </div>
                </Card>
                <Card className="glow-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Failed</p>
                      <p className="text-2xl font-bold mt-2 text-destructive">{stats.failed}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-destructive opacity-50" />
                  </div>
                </Card>
              </div>

              {/* Logs */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Notification History</h2>
                <LogsTable logs={logs} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default function LogsPage() {
  return (
    <ProtectedRoute>
      <LogsContent />
    </ProtectedRoute>
  )
}
