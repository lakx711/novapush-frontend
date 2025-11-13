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
  try {
    const { api } = await import('./api')
    const resp = await api.get('/logs?latest=true')
    const items = (resp.data?.logs || []) as Array<any>
    
    console.log('📊 Fetched logs:', items.length, 'items')
    
    return items.map((l) => ({
      id: l._id || `log-${Date.now()}-${Math.random()}`,
      templateId: l.templateId || 'unknown',
      templateName: l.templateName || 'Notification',
      recipientId: l.recipient || 'unknown',
      recipientEmail: l.recipient || 'unknown@example.com',
      recipientName: l.recipientName || l.recipient || 'Unknown User',
      channel: l.channel || 'email',
      status: (l.status === 'queued' ? 'pending' : l.status) as NotificationStatus,
      sentAt: new Date(l.createdAt || Date.now()),
      deliveredAt: l.status === 'delivered' ? new Date(l.updatedAt || l.createdAt) : undefined,
      errorMessage: l.error || l.errorMessage
    }))
  } catch (error) {
    console.error('❌ Failed to fetch logs:', error)
    // Return sample data for development
    return getSampleLogs()
  }
}

// Sample logs for development/demo
function getSampleLogs(): NotificationLog[] {
  return [
    {
      id: 'sample-1',
      templateId: 'welcome',
      templateName: 'Welcome Email',
      recipientId: 'user1',
      recipientEmail: 'user1@example.com',
      recipientName: 'John Doe',
      channel: 'email',
      status: 'delivered',
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000)
    },
    {
      id: 'sample-2',
      templateId: 'newsletter',
      templateName: 'Weekly Newsletter',
      recipientId: 'user2',
      recipientEmail: 'user2@example.com',
      recipientName: 'Jane Smith',
      channel: 'email',
      status: 'sent',
      sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
    },
    {
      id: 'sample-3',
      templateId: 'otp',
      templateName: 'OTP Code',
      recipientId: 'user3',
      recipientEmail: 'user3@example.com',
      recipientName: 'Bob Wilson',
      channel: 'sms',
      status: 'delivered',
      sentAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      deliveredAt: new Date(Date.now() - 30 * 60 * 1000 + 15000)
    },
    {
      id: 'sample-4',
      templateId: 'promo',
      templateName: 'Promotion Alert',
      recipientId: 'user4',
      recipientEmail: 'user4@example.com',
      recipientName: 'Alice Brown',
      channel: 'push',
      status: 'failed',
      sentAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      errorMessage: 'Device token expired'
    }
  ]
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

