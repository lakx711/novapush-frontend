"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProtectedRoute } from "@/components/protected-route"
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Key, 
  Mail, 
  Smartphone, 
  Globe,
  Save,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react"

export default function Settings() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [saving, setSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  // Profile settings
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
    timezone: "UTC"
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
    security: true
  })

  // Security settings
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: 30,
    apiAccess: true
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "api", label: "API Keys", icon: Key }
  ]

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
          <Navbar />
          <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Settings</h1>
                  <p className="text-muted-foreground">Manage your account and preferences</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <Card className="p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            activeTab === tab.id
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      )
                    })}
                  </nav>
                </Card>
              </div>

              {/* Content Area */}
              <div className="lg:col-span-3">
                <Card className="p-6">
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input
                              value={profile.name}
                              onChange={(e) => setProfile({...profile, name: e.target.value})}
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input
                              value={profile.email}
                              onChange={(e) => setProfile({...profile, email: e.target.value})}
                              placeholder="Enter your email"
                              type="email"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-4">Account Status</h3>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Email Verified
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Pro Plan
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-blue-500" />
                              <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                              </div>
                            </div>
                            <Switch
                              checked={notifications.email}
                              onCheckedChange={(checked: boolean) => setNotifications({...notifications, email: checked})}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Smartphone className="w-5 h-5 text-green-500" />
                              <div>
                                <p className="font-medium">SMS Notifications</p>
                                <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                              </div>
                            </div>
                            <Switch
                              checked={notifications.sms}
                              onCheckedChange={(checked: boolean) => setNotifications({...notifications, sms: checked})}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Globe className="w-5 h-5 text-purple-500" />
                              <div>
                                <p className="font-medium">Push Notifications</p>
                                <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                              </div>
                            </div>
                            <Switch
                              checked={notifications.push}
                              onCheckedChange={(checked: boolean) => setNotifications({...notifications, push: checked})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Shield className="w-5 h-5 text-green-500" />
                              <div>
                                <p className="font-medium">Two-Factor Authentication</p>
                                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                              </div>
                            </div>
                            <Switch
                              checked={security.twoFactor}
                              onCheckedChange={(checked: boolean) => setSecurity({...security, twoFactor: checked})}
                            />
                          </div>

                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <AlertCircle className="w-5 h-5 text-orange-500" />
                              <p className="font-medium">Session Timeout</p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">Automatically log out after inactivity</p>
                            <Input
                              type="number"
                              value={security.sessionTimeout}
                              onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
                              className="w-32"
                            />
                            <span className="text-sm text-muted-foreground ml-2">minutes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "api" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Key className="w-5 h-5 text-blue-500" />
                                <p className="font-medium">API Key</p>
                              </div>
                              <Badge variant="secondary">Active</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type={showApiKey ? "text" : "password"}
                                value="np_1234567890abcdef"
                                readOnly
                                className="font-mono"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowApiKey(!showApiKey)}
                              >
                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              Use this key to authenticate API requests
                            </p>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-2">API Usage</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-2xl font-bold text-blue-600">1,234</p>
                                <p className="text-sm text-muted-foreground">Requests Today</p>
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-green-600">98.5%</p>
                                <p className="text-sm text-muted-foreground">Success Rate</p>
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-purple-600">45ms</p>
                                <p className="text-sm text-muted-foreground">Avg Response</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
