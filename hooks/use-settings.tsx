"use client"

import { useState, useCallback } from "react"
import { getSettings, saveSettings, type UserSettings } from "@/lib/settings-service"

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => getSettings())

  const updateSettings = useCallback(
    (newSettings: Partial<UserSettings>) => {
      const updated = { ...settings, ...newSettings }
      saveSettings(updated)
      setSettings(updated)
    },
    [settings],
  )

  const updateNotifications = useCallback(
    (updates: Partial<UserSettings["notifications"]>) => {
      const newSettings = {
        ...settings,
        notifications: { ...settings.notifications, ...updates },
      }
      saveSettings(newSettings)
      setSettings(newSettings)
    },
    [settings],
  )

  const updateApi = useCallback(
    (updates: Partial<UserSettings["api"]>) => {
      const newSettings = {
        ...settings,
        api: { ...settings.api, ...updates },
      }
      saveSettings(newSettings)
      setSettings(newSettings)
    },
    [settings],
  )

  const updatePrivacy = useCallback(
    (updates: Partial<UserSettings["privacy"]>) => {
      const newSettings = {
        ...settings,
        privacy: { ...settings.privacy, ...updates },
      }
      saveSettings(newSettings)
      setSettings(newSettings)
    },
    [settings],
  )

  return { settings, updateSettings, updateNotifications, updateApi, updatePrivacy }
}
