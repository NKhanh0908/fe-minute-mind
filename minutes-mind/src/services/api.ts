import axios, { type InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '../features/auth/store/useAuthStore'
import type { ApiResponse, AuthResponse } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token && config.headers) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let pendingRefresh: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) {
    throw new Error('Missing refresh token')
  }

  const response = await axios.post<ApiResponse<AuthResponse>>(`${API_BASE_URL}/auth/refresh`, {
    refreshToken,
  })

  const payload = response.data.data
  useAuthStore.getState().setAuth(payload.user, payload.accessToken)
  localStorage.setItem('refreshToken', payload.refreshToken)
  return payload.accessToken
}

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error)

    const originalRequest = error.config as RetryConfig | undefined
    const isTokenExpired = error.response?.status === 401 && error.response?.data?.error === 'TokenExpired'

    if (!originalRequest || !isTokenExpired || originalRequest._retry) {
      return Promise.reject(error)
    }

    const isAuthEndpoint = originalRequest.url?.includes('/auth/')
    if (isAuthEndpoint) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      pendingRefresh = pendingRefresh ?? refreshAccessToken()
      const newAccessToken = await pendingRefresh
      pendingRefresh = null

      if (originalRequest.headers) {
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`)
      }
      return api(originalRequest)
    } catch (refreshError) {
      pendingRefresh = null
      useAuthStore.getState().clearAuth()
      localStorage.removeItem('refreshToken')
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      return Promise.reject(refreshError)
    }
  },
)
