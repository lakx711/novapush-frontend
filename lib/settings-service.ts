// Settings service for managing user preferences

export interface UserSettings {
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    dailySummary: boolean
  }
  api: {
    smtpServer: string
    smtpPort: number
    twilioSid: string
    twilioToken: string
  }
  privacy: {
    twoFactorAuth: boolean
    activityLogging: boolean
  }
}

const SETTINGS_STORAGE_KEY = "novapush_settings"

const defaultSettings: UserSettings = {
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    dailySummary: false,
  },
  api: {
    smtpServer: "",
    smtpPort: 587,
    twilioSid: "",
    twilioToken: "",
  },
  privacy: {
    twoFactorAuth: false,
    activityLogging: true,
  },
}

export const getSettings = (): UserSettings => {
  if (typeof window === "undefined") return defaultSettings

  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
  if (!stored) return defaultSettings

  return JSON.parse(stored)
}

export const saveSettings = (settings: UserSettings): boolean => {
  if (typeof window === "undefined") return false

  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  return true
}

export const updateNotificationSettings = (updates: Partial<UserSettings["notifications"]>): UserSettings => {
  const settings = getSettings()
  settings.notifications = { ...settings.notifications, ...updates }
  saveSettings(settings)
  return settings
}

export const updateApiSettings = (updates: Partial<UserSettings["api"]>): UserSettings => {
  const settings = getSettings()
  settings.api = { ...settings.api, ...updates }
  saveSettings(settings)
  return settings
}

export const updatePrivacySettings = (updates: Partial<UserSettings["privacy"]>): UserSettings => {
  const settings = getSettings()
  settings.privacy = { ...settings.privacy, ...updates }
  saveSettings(settings)
  return settings
}
