// Notification sending and logging service

export type NotificationStatus = "pending" | "sent" | "delivered" | "failed"

export interface NotificationLog {
  id: string
  templateId: string
  templateName: string
  recipientId: string
  recipientEmail: string
  recipientName: string
  channel: "email" | "sms" | "push"
  status: NotificationStatus
  sentAt: Date
  deliveredAt?: Date
  errorMessage?: string
}

export async function getLogs(): Promise<NotificationLog[]> {
  const { api } = await import('./api')
  const resp = await api.get('/logs')
  const items = (resp.data?.logs || []) as Array<any>
  return items.map((l) => ({
    id: l._id,
    templateId: l.templateId || '',
    templateName: '',
    recipientId: l.recipient,
    recipientEmail: l.recipient,
    recipientName: l.recipient,
    channel: l.channel,
    status: (l.status === 'queued' ? 'pending' : l.status) as NotificationStatus,
    sentAt: new Date(l.createdAt),
    deliveredAt: l.status === 'delivered' ? new Date(l.updatedAt) : undefined,
    errorMessage: l.error
  }))
}

export async function sendNotification(data: {
  templateId: string
  recipientIds: string[]
  recipientEmails: string[]
  recipientNames: string[]
  channel: "email" | "sms" | "push"
}): Promise<{ correlationId: string }> {
  const { api } = await import('./api')
  const recipients = data.recipientEmails?.length ? data.recipientEmails : data.recipientIds
  const headers: Record<string, string> = { 'Idempotency-Key': `idem_${Date.now()}` }
  const resp = await api.post('/notifications/send', {
    channel: data.channel,
    templateId: data.templateId,
    recipients,
    variables: {}
  }, { headers })
  return { correlationId: resp.data?.correlationId }
}

export function getLogStats() {
  // This function is kept for compatibility; prefer computing stats from getLogs() result where needed
  return { total: 0, sent: 0, delivered: 0, failed: 0 }
}

