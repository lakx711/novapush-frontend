"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import type { UserSettings } from "@/lib/settings-service"

interface ApiConfigurationProps {
  settings: UserSettings["api"]
  onUpdate: (updates: Partial<UserSettings["api"]>) => void
  saving: boolean
}

export function ApiConfiguration({ settings, onUpdate, saving }: ApiConfigurationProps) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onUpdate(localSettings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card className="glow-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold">API Configuration</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">SMTP Server</label>
          <Input
            placeholder="smtp.gmail.com"
            value={localSettings.smtpServer}
            onChange={(e) => setLocalSettings({ ...localSettings, smtpServer: e.target.value })}
            disabled={saving}
            className="bg-input/50 border-input/50 focus-visible:ring-accent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">SMTP Port</label>
          <Input
            type="number"
            placeholder="587"
            value={localSettings.smtpPort}
            onChange={(e) => setLocalSettings({ ...localSettings, smtpPort: Number.parseInt(e.target.value) })}
            disabled={saving}
            className="bg-input/50 border-input/50 focus-visible:ring-accent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Twilio Account SID</label>
          <Input
            placeholder="AC••••••••••••••••••••••••••••••••"
            value={localSettings.twilioSid}
            onChange={(e) => setLocalSettings({ ...localSettings, twilioSid: e.target.value })}
            disabled={saving}
            type="password"
            className="bg-input/50 border-input/50 focus-visible:ring-accent"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Twilio Auth Token</label>
          <Input
            placeholder="••••••••••••••••••••••••••••••••"
            value={localSettings.twilioToken}
            onChange={(e) => setLocalSettings({ ...localSettings, twilioToken: e.target.value })}
            disabled={saving}
            type="password"
            className="bg-input/50 border-input/50 focus-visible:ring-accent"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="glow-button w-full bg-accent hover:bg-accent/90 text-background"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save Configuration"}
        </Button>
      </div>
    </Card>
  )
}
