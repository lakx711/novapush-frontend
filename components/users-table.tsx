"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2, Mail, MessageSquare, Bell } from "lucide-react"
import type { AppUser } from "@/lib/user-service"

interface UsersTableProps {
  users: AppUser[]
  onEdit: (user: AppUser) => void
  onDelete: (id: string) => Promise<void>
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const handleDelete = async (user: AppUser) => {
    if (window.confirm(`Delete user "${user.name}"?`)) {
      await onDelete(user.id)
    }
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id} className="glow-card p-4 hover:border-accent/60 transition-all">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                    user.status === "active" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}

              {/* Preferences */}
              {user.preferences && (
                <div className="flex gap-2 mt-2">
                  {user.preferences.email && (
                    <div className="flex items-center gap-1 text-xs text-accent">
                      <Mail className="w-3 h-3" />
                      <span>Email</span>
                    </div>
                  )}
                  {user.preferences.sms && (
                    <div className="flex items-center gap-1 text-xs text-accent">
                      <MessageSquare className="w-3 h-3" />
                      <span>SMS</span>
                    </div>
                  )}
                  {user.preferences.push && (
                    <div className="flex items-center gap-1 text-xs text-accent">
                      <Bell className="w-3 h-3" />
                      <span>Push</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(user)} className="gap-2">
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(user)}
                className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
