// Template management service

export type TemplateType = "email" | "sms" | "push"

export interface Template {
  id: string
  name: string
  type: TemplateType
  subject?: string
  content: string
  version: number
  isDefault?: boolean
  category?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export async function getTemplates(): Promise<Template[]> {
  const { api } = await import('./api')
  const resp = await api.get('/templates')
  const items = (resp.data?.items || []) as Array<any>
  return items.map((t) => ({
    id: t._id,
    name: t.name,
    type: t.type,
    subject: t.subject,
    content: t.content,
    version: 1,
    isDefault: t.isDefault || false,
    category: t.category || 'custom',
    description: t.description,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt)
  }))
}

export async function getTemplate(id: string): Promise<Template | null> {
  const { api } = await import('./api')
  const resp = await api.get('/templates')
  const items = (resp.data?.items || []) as Array<any>
  const t = items.find((x) => x._id === id)
  if (!t) return null
  return {
    id: t._id,
    name: t.name,
    type: t.type,
    subject: t.subject,
    content: t.content,
    version: 1,
    isDefault: t.isDefault || false,
    category: t.category || 'custom',
    description: t.description,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt)
  }
}

export async function createTemplate(
  template: Omit<Template, "id" | "version" | "createdAt" | "updatedAt">,
): Promise<Template> {
  const { api } = await import('./api')
  const resp = await api.post('/templates', template)
  const t = resp.data?.item
  return {
    id: t._id,
    name: t.name,
    type: t.type,
    subject: t.subject,
    content: t.content,
    version: 1,
    isDefault: t.isDefault || false,
    category: t.category || 'custom',
    description: t.description,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt)
  }
}

export async function updateTemplate(
  id: string,
  updates: Partial<Omit<Template, "id" | "createdAt">>,
): Promise<Template | null> {
  const { api } = await import('./api')
  const resp = await api.put(`/templates/${id}`, updates)
  const t = resp.data?.item
  if (!t) return null
  return {
    id: t._id,
    name: t.name,
    type: t.type,
    subject: t.subject,
    content: t.content,
    version: 1,
    isDefault: t.isDefault || false,
    category: t.category || 'custom',
    description: t.description,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt)
  }
}

export async function deleteTemplate(id: string): Promise<boolean> {
  const { api } = await import('./api')
  await api.delete(`/templates/${id}`)
  return true
}

