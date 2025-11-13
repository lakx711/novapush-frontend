"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { NotificationPreferences } from "@/components/notification-preferences"
import { ApiConfiguration } from "@/components/api-configuration"
import { PrivacySettings } from "@/components/privacy-settings"
import { useSettings } from "@/hooks/use-settings"

export default function Settings() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { settings, updateNotifications, updateApi, updatePrivacy } = useSettings()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleNotificationUpdate = async (updates: any) => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    updateNotifications(updates)
    setSaving(false)
  }

  const handleApiUpdate = async (updates: any) => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    updateApi(updates)
    setSaving(false)
  }

  const handlePrivacyUpdate = async (updates: any) => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    updatePrivacy(updates)
    setSaving(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground pt-2">Manage your account preferences and integrations</p>
          </div>

          <div className="max-w-2xl space-y-6">
            <NotificationPreferences
              settings={settings.notifications}
              onUpdate={handleNotificationUpdate}
              saving={saving}
            />

            <ApiConfiguration settings={settings.api} onUpdate={handleApiUpdate} saving={saving} />

            <PrivacySettings settings={settings.privacy} onUpdate={handlePrivacyUpdate} saving={saving} />
          </div>
        </main>
      </div>
    </div>
  )
}
