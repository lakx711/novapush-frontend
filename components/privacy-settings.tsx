"use client"

import { Card } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import { Shield } from "lucide-react"
import type { UserSettings } from "@/lib/settings-service"

interface PrivacySettingsProps {
  settings: UserSettings["privacy"]
  onUpdate: (updates: Partial<UserSettings["privacy"]>) => void
  saving: boolean
}

export function PrivacySettings({ settings, onUpdate, saving }: PrivacySettingsProps) {
  return (
    <Card className="glow-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold">Privacy & Security</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
          <div>
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
          </div>
          <Toggle
            pressed={settings.twoFactorAuth}
            onPressedChange={(checked) => onUpdate({ twoFactorAuth: checked })}
            disabled={saving}
            className="bg-accent"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
          <div>
            <p className="font-medium">Activity Logging</p>
            <p className="text-sm text-muted-foreground">Keep a record of all account activity</p>
          </div>
          <Toggle
            pressed={settings.activityLogging}
            onPressedChange={(checked) => onUpdate({ activityLogging: checked })}
            disabled={saving}
            className="bg-accent"
          />
        </div>
      </div>
    </Card>
  )
}
