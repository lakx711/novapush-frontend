"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2 } from "lucide-react"
import type { Template } from "@/lib/template-service"

interface TemplateCardProps {
  template: Template
  onEdit: (template: Template) => void
  onDelete: (id: string) => Promise<void>
}

export function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  const handleDelete = async () => {
    if (window.confirm(`Delete template "${template.name}"?`)) {
      await onDelete(template.id)
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "email":
        return "Email"
      case "sms":
        return "SMS"
      case "push":
        return "Push"
      default:
        return type
    }
  }

  return (
    <Card className="glow-card p-6 space-y-4 hover:border-accent/60 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{template.name}</h3>
          {template.subject && <p className="text-sm text-muted-foreground mt-1">{template.subject}</p>}
          <p className="text-xs text-muted-foreground mt-2">{getTypeLabel(template.type)}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent whitespace-nowrap ml-2">
          v{template.version}
        </span>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">{template.content}</p>

      <div className="flex gap-2 pt-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(template)} className="gap-2">
          <Edit2 className="w-4 h-4" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDelete}
          className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10 bg-transparent"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </Card>
  )
}
