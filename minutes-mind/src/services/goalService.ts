import { api } from './api'
import type { ApiResponse, GoalRequest, GoalResponse, SortOrderRequest } from '../types/api'

export const goalService = {
  list: async (): Promise<GoalResponse[]> => {
    const response = await api.get<ApiResponse<GoalResponse[]>>('/goals')
    return response.data.data
  },

  create: async (body: GoalRequest): Promise<GoalResponse> => {
    const response = await api.post<ApiResponse<GoalResponse>>('/goals', body)
    return response.data.data
  },

  update: async (id: number, body: GoalRequest): Promise<GoalResponse> => {
    const response = await api.put<ApiResponse<GoalResponse>>(`/goals/${id}`, body)
    return response.data.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/goals/${id}`)
  },

  updateSortOrder: async (body: SortOrderRequest): Promise<void> => {
    await api.patch('/goals/sort', body)
  },
}
