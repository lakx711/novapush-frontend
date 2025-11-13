"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { UserForm } from "@/components/user-form"
import { UsersTable } from "@/components/users-table"
import { useUsers } from "@/hooks/use-users"
import { createUser, updateUser, deleteUser, type AppUser } from "@/lib/user-service"
import { Users, Plus } from "lucide-react"

function UsersContent() {
  const { users, isLoading, refetch } = useUsers()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AppUser | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateUser = async (formData: any) => {
    setIsSubmitting(true)
    try {
      await createUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        preferences: formData.preferences,
      })
      setIsFormOpen(false)
      setEditingUser(null)
      await refetch()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateUser = async (formData: any) => {
    if (!editingUser) return

    setIsSubmitting(true)
    try {
      await updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        preferences: formData.preferences,
      })
      setIsFormOpen(false)
      setEditingUser(null)
      await refetch()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id)
    await refetch()
  }

  const handleEditUser = (user: AppUser) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingUser(null)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
          <Navbar />
          <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 space-y-8">
          {isFormOpen ? (
            <UserForm
              user={editingUser || undefined}
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              onCancel={handleCloseForm}
              isLoading={isSubmitting}
            />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Users</h1>
                  <p className="text-muted-foreground pt-2">Manage notification recipients</p>
                </div>
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="glow-button gap-2 bg-accent hover:bg-accent/90 text-background"
                >
                  <Plus className="w-4 h-4" />
                  Add User
                </Button>
              </div>

              {users.length === 0 ? (
                <EmptyState
                  icon={<Users className="w-16 h-16" />}
                  title="No Users Yet"
                  description="Add users to start sending notifications to them."
                  action={{
                    label: "Add First User",
                    onClick: () => setIsFormOpen(true),
                  }}
                />
              ) : (
                <UsersTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <UsersContent />
    </ProtectedRoute>
  )
}
