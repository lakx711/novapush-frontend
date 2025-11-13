"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface SendNotificationFormProps {
  templates: any[]
  users: any[]
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function SendNotificationForm({ templates, users, onSubmit, isLoading }: SendNotificationFormProps) {
  const [formData, setFormData] = useState({
    templateId: "",
    channel: "email" as const,
    selectedUsers: new Set<string>(),
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(formData.selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setFormData({ ...formData, selectedUsers: newSelected })
  }

  const handleSelectAll = () => {
    if (formData.selectedUsers.size === users.length) {
      setFormData({ ...formData, selectedUsers: new Set() })
    } else {
      setFormData({ ...formData, selectedUsers: new Set(users.map((u) => u.id)) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.templateId) {
      setError("Please select a template")
      return
    }

    if (formData.selectedUsers.size === 0) {
      setError("Please select at least one user")
      return
    }

    try {
      const selectedUserList = users.filter((u) => formData.selectedUsers.has(u.id))
      await onSubmit({
        templateId: formData.templateId,
        channel: formData.channel,
        recipientIds: selectedUserList.map((u) => u.id),
        recipientEmails: selectedUserList.map((u) => u.email),
        recipientNames: selectedUserList.map((u) => u.name),
      })
      setSuccess(`Notification sent to ${formData.selectedUsers.size} user(s)`)
      setFormData({ ...formData, templateId: "", selectedUsers: new Set() })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send notification")
    }
  }

  return (
    <Card className="glow-card p-6 space-y-6">
      <h2 className="text-2xl font-bold">Send Notification</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Template</label>
          <Select
            value={formData.templateId}
            onValueChange={(value) => setFormData({ ...formData, templateId: value })}
          >
            <SelectTrigger className="bg-input/50 border-input/50">
              <SelectValue placeholder="Choose a template..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Channel Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Channel</label>
          <Select
            value={formData.channel}
            onValueChange={(value) => setFormData({ ...formData, channel: value as any })}
          >
            <SelectTrigger className="bg-input/50 border-input/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="push">Push Notification</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* User Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Select Recipients</label>
            <Button type="button" variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs">
              {formData.selectedUsers.size === users.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
          <div className="max-h-64 overflow-y-auto border border-border/50 rounded-lg p-4 space-y-2">
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users available</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Checkbox
                    id={user.id}
                    checked={formData.selectedUsers.has(user.id)}
                    onCheckedChange={() => handleSelectUser(user.id)}
                  />
                  <label htmlFor={user.id} className="text-sm cursor-pointer flex-1">
                    {user.name} ({user.email})
                  </label>
                </div>
              ))
            )}
          </div>
          <p className="text-xs text-muted-foreground">{formData.selectedUsers.size} user(s) selected</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-sm text-green-500">
            {success}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="glow-button w-full bg-accent hover:bg-accent/90 text-background font-semibold"
          disabled={isLoading || templates.length === 0 || users.length === 0}
        >
          {isLoading ? "Sending..." : "Send Notification"}
        </Button>
      </form>
    </Card>
  )
}
