"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { EmptyState } from "@/components/empty-state"
import { SendNotificationForm } from "@/components/send-notification-form"
import { sendNotification } from "@/lib/notification-service"
import { useTemplates } from "@/hooks/use-templates"
import { useUsers } from "@/hooks/use-users"
import { Send } from "lucide-react"

function SendNotificationContent() {
  const { templates, isLoading: templatesLoading } = useTemplates()
  const { users, isLoading: usersLoading } = useUsers()
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()

  const handleSendNotification = async (data: any) => {
    setIsSending(true)
    try {
      await sendNotification(data)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } finally {
      setIsSending(false)
    }
  }

  const isLoading = templatesLoading || usersLoading

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
          <Navbar />
          <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
              <p className="text-muted-foreground">Loading data...</p>
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
            <h1 className="text-3xl font-bold">Send Notification</h1>
            <p className="text-muted-foreground pt-2">Send notifications to your users</p>
          </div>

          {templates.length === 0 || users.length === 0 ? (
            <EmptyState
              icon={<Send className="w-16 h-16" />}
              title={templates.length === 0 ? "No Templates" : "No Users"}
              description={
                templates.length === 0
                  ? "Create templates before sending notifications."
                  : "Add users before sending notifications."
              }
              action={{
                label: templates.length === 0 ? "Create Template" : "Add User",
                onClick: () => {},
              }}
            />
          ) : (
            <SendNotificationForm
              templates={templates}
              users={users}
              onSubmit={handleSendNotification}
              isLoading={isSending}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default function SendNotificationPage() {
  return (
    <ProtectedRoute>
      <SendNotificationContent />
    </ProtectedRoute>
  )
}
