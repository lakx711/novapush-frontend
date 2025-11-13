"use client"

import { Card } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import { Bell } from "lucide-react"
import type { UserSettings } from "@/lib/settings-service"

interface NotificationPreferencesProps {
  settings: UserSettings["notifications"]
  onUpdate: (updates: Partial<UserSettings["notifications"]>) => void
  saving: boolean
}

export function NotificationPreferences({ settings, onUpdate, saving }: NotificationPreferencesProps) {
  return (
    <Card className="glow-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Bell className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold">Notification Preferences</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-muted-foreground">Receive email updates on delivery status</p>
          </div>
          <Toggle
            pressed={settings.emailNotifications}
            onPressedChange={(checked) => onUpdate({ emailNotifications: checked })}
            disabled={saving}
            className="bg-accent"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
          <div>
            <p className="font-medium">SMS Notifications</p>
            <p className="text-sm text-muted-foreground">Receive SMS alerts for critical events</p>
          </div>
          <Toggle
            pressed={settings.smsNotifications}
            onPressedChange={(checked) => onUpdate({ smsNotifications: checked })}
            disabled={saving}
            className="bg-accent"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
          <div>
            <p className="font-medium">Push Notifications</p>
            <p className="text-sm text-muted-foreground">Real-time push alerts in the dashboard</p>
          </div>
          <Toggle
            pressed={settings.pushNotifications}
            onPressedChange={(checked) => onUpdate({ pushNotifications: checked })}
            disabled={saving}
            className="bg-accent"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
          <div>
            <p className="font-medium">Daily Summary</p>
            <p className="text-sm text-muted-foreground">Get a daily summary of all notifications</p>
          </div>
          <Toggle
            pressed={settings.dailySummary}
            onPressedChange={(checked) => onUpdate({ dailySummary: checked })}
            disabled={saving}
            className="bg-accent"
          />
        </div>
      </div>
    </Card>
  )
}
