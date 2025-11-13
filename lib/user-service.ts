// User management service

export interface AppUser {
  id: string
  name: string
  email: string
  phone?: string
  preferences?: {
    email: boolean
    sms: boolean
    push: boolean
  }
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export async function getUsers(): Promise<AppUser[]> {
  const { api } = await import('./api')
  const resp = await api.get('/users')
  const users = (resp.data?.users || []) as Array<any>
  return users.map((u) => ({
    id: u._id,
    name: u.name || u.email,
    email: u.email,
    status: 'active',
    createdAt: new Date(u.createdAt),
    updatedAt: new Date(u.updatedAt)
  }))
}

export async function getUser(id: string): Promise<AppUser | null> {
  const users = await getUsers()
  return users.find((u) => u.id === id) || null
}

export async function createUser(user: Omit<AppUser, "id" | "createdAt" | "updatedAt">): Promise<AppUser> {
  const { api } = await import('./api')
  const resp = await api.post('/users', {
    name: user.name,
    email: user.email,
    phone: user.phone
  })
  const created = resp.data?.user
  return {
    id: created._id,
    name: created.name,
    email: created.email,
    phone: created.phone,
    status: 'active',
    createdAt: new Date(created.createdAt),
    updatedAt: new Date(created.updatedAt)
  }
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<AppUser, "id" | "createdAt">>,
): Promise<AppUser | null> {
  const { api } = await import('./api')
  if (updates.preferences) {
    const pref = {
      channels: {
        email: !!updates.preferences.email,
        sms: !!updates.preferences.sms,
        push: !!updates.preferences.push
      }
    }
    await api.put(`/users/${id}/preferences`, pref)
  }
  const refreshed = await getUser(id)
  return refreshed
}

export async function deleteUser(id: string): Promise<boolean> {
  const { api } = await import('./api')
  try {
    await api.delete(`/users/${id}`)
    return true
  } catch (error) {
    console.error('Failed to delete user:', error)
    return false
  }
}

