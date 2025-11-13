"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { AppUser } from "@/lib/user-service"
import { X } from "lucide-react"

interface UserFormProps {
  user?: AppUser
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    status: user?.status || ("active" as const),
    preferences: user?.preferences || { email: true, sms: true, push: false },
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Name is required")
      return
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save user")
    }
  }

  return (
    <Card className="glow-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{user ? "Edit User" : "Add User"}</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            placeholder="e.g., John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-input/50 border-input/50 focus-visible:ring-accent"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="e.g., john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-input/50 border-input/50 focus-visible:ring-accent"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone (Optional)</label>
          <Input
            type="tel"
            placeholder="e.g., +1234567890"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-input/50 border-input/50 focus-visible:ring-accent"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
            <SelectTrigger className="bg-input/50 border-input/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Communication Preferences</label>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Checkbox
                id="email"
                checked={formData.preferences.email}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, email: checked as boolean },
                  })
                }
              />
              <label htmlFor="email" className="text-sm cursor-pointer">
                Receive Email Notifications
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="sms"
                checked={formData.preferences.sms}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, sms: checked as boolean },
                  })
                }
              />
              <label htmlFor="sms" className="text-sm cursor-pointer">
                Receive SMS Notifications
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="push"
                checked={formData.preferences.push}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, push: checked as boolean },
                  })
                }
              />
              <label htmlFor="push" className="text-sm cursor-pointer">
                Receive Push Notifications
              </label>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="glow-button bg-accent hover:bg-accent/90 text-background font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : user ? "Update User" : "Add User"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
