"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { TemplateForm } from "@/components/template-form"
import { TemplateCard } from "@/components/template-card"
import { useTemplates } from "@/hooks/use-templates"
import { createTemplate, updateTemplate, deleteTemplate, type Template } from "@/lib/template-service"
import { FileText, Plus } from "lucide-react"

function TemplatesContent() {
  const { templates, isLoading, refetch } = useTemplates()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateTemplate = async (formData: any) => {
    setIsSubmitting(true)
    try {
      await createTemplate({
        name: formData.name,
        type: formData.type,
        subject: formData.subject,
        content: formData.content,
      })
      setIsFormOpen(false)
      setEditingTemplate(null)
      await refetch()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTemplate = async (formData: any) => {
    if (!editingTemplate) return

    setIsSubmitting(true)
    try {
      await updateTemplate(editingTemplate.id, {
        name: formData.name,
        type: formData.type,
        subject: formData.subject,
        content: formData.content,
      })
      setIsFormOpen(false)
      setEditingTemplate(null)
      await refetch()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    await deleteTemplate(id)
    await refetch()
  }

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTemplate(null)
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
              <p className="text-muted-foreground">Loading templates...</p>
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
            <TemplateForm
              template={editingTemplate || undefined}
              onSubmit={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
              onCancel={handleCloseForm}
              isLoading={isSubmitting}
            />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Templates</h1>
                  <p className="text-muted-foreground pt-2">Manage your notification templates</p>
                </div>
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="glow-button gap-2 bg-accent hover:bg-accent/90 text-background"
                >
                  <Plus className="w-4 h-4" />
                  New Template
                </Button>
              </div>

              {templates.length === 0 ? (
                <EmptyState
                  icon={<FileText className="w-16 h-16" />}
                  title="No Templates Yet"
                  description="Create your first notification template to get started."
                  action={{
                    label: "Create Template",
                    onClick: () => setIsFormOpen(true),
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onEdit={handleEditTemplate}
                      onDelete={handleDeleteTemplate}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default function Templates() {
  return (
    <ProtectedRoute>
      <TemplatesContent />
    </ProtectedRoute>
  )
}
