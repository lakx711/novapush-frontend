"use client"

import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="glow-card rounded-xl p-12 text-center space-y-6 border-dashed">
      <div className="flex justify-center text-accent/60">{icon}</div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button onClick={action.onClick} className="glow-button bg-accent hover:bg-accent/90 text-background">
          {action.label}
        </Button>
      )}
    </div>
  )
}
