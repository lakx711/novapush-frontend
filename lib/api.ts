import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { API_BASE } from './config'
import { getAuthToken, removeAuthToken } from './auth-utils'

export const api = axios.create({ baseURL: `${API_BASE}/api` })

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = getAuthToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (resp: AxiosResponse) => resp,
  (error: any) => {
    if (error?.response?.status === 401) {
      removeAuthToken()
      // Let the caller handle redirect
    }
    return Promise.reject(error)
  }
)
