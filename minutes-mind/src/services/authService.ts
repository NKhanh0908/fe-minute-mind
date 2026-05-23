import { api } from './api'
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from '../types/api'

export const authService = {
  register: async (body: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', body)
    return response.data.data
  },

  login: async (body: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', body)
    return response.data.data
  },

  refreshToken: async (body: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh', body)
    return response.data.data
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.delete('/auth/logout', { data: { refreshToken } })
  },
}
