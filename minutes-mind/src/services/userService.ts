import { api } from './api'
import type { ApiResponse, UpdateProfileRequest, UserResponse } from '../types/api'

export const userService = {
  getProfile: async (): Promise<UserResponse> => {
    const response = await api.get<ApiResponse<UserResponse>>('/users/me')
    return response.data.data
  },

  updateProfile: async (body: UpdateProfileRequest): Promise<UserResponse> => {
    const response = await api.put<ApiResponse<UserResponse>>('/users/me', body)
    return response.data.data
  },

  updateAvatar: async (file: File): Promise<UserResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.put<ApiResponse<UserResponse>>('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  removeAvatar: async (): Promise<void> => {
    await api.delete('/users/me/avatar')
  },
}
