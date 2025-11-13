"use client"

import { useState, useEffect } from "react"
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, type Template } from "@/lib/template-service"

interface UseTemplatesReturn {
  templates: Template[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useTemplates(): UseTemplatesReturn {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTemplates = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getTemplates()
      setTemplates(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch templates"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  return { templates, isLoading, error, refetch: fetchTemplates }
}

export async function useCreateTemplate() {
  return async (data: any) => {
    return await createTemplate(data)
  }
}

export async function useUpdateTemplate() {
  return async (id: string, data: any) => {
    return await updateTemplate(id, data)
  }
}

export async function useDeleteTemplate() {
  return async (id: string) => {
    return await deleteTemplate(id)
  }
}
