"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Template, TemplateType } from "@/lib/template-service"
import { X } from "lucide-react"

interface TemplateFormProps {
  template?: Template
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function TemplateForm({ template, onSubmit, onCancel, isLoading }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    type: template?.type || ("email" as TemplateType),
    subject: template?.subject || "",
    content: template?.content || "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Template name is required")
      return
    }
    if (!formData.content.trim()) {
      setError("Template content is required")
      return
    }
    if (formData.type === "email" && !formData.subject.trim()) {
      setError("Subject is required for email templates")
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template")
    }
  }

  return (
    <Card className="glow-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{template ? "Edit Template" : "Create Template"}</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Template Name</label>
          <Input
            placeholder="e.g., Welcome Email"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-input/50 border-input/50 focus-visible:ring-accent"
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Channel Type</label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as TemplateType })}
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

        {/* Subject (Email only) */}
        {formData.type === "email" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Subject</label>
            <Input
              placeholder="e.g., Welcome to {{company}}"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-input/50 border-input/50 focus-visible:ring-accent"
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Content</label>
          <Textarea
            placeholder="Enter your template content. Use {{variable}} for dynamic content."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            className="bg-input/50 border-input/50 focus-visible:ring-accent resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Tip: Use variables like name, email, orderId for dynamic content
          </p>
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
            {isLoading ? "Saving..." : template ? "Update Template" : "Create Template"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
