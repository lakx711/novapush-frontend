"use client"

import type React from "react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: number
  icon?: React.ReactNode
}

export function StatsCard({ title, value, subtitle, trend, icon }: StatsCardProps) {
  return (
    <div className="glow-card rounded-xl p-6 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground pt-2">{value}</p>
        </div>
        {icon && <div className="text-accent opacity-60">{icon}</div>}
      </div>
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 pt-2">
          {trend && (
            <span className={`text-sm font-medium ${trend > 0 ? "text-green-500" : "text-destructive"}`}>
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          )}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      )}
    </div>
  )
}
