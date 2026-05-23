import { api } from './api'
import type { ApiResponse, SortOrderRequest, TaskRequest, TaskResponse, TaskStatus } from '../types/api'

export const taskService = {
  listByGoal: async (goalId: number): Promise<TaskResponse[]> => {
    const response = await api.get<ApiResponse<TaskResponse[]>>(`/tasks/goal/${goalId}`)
    return response.data.data
  },

  create: async (body: TaskRequest): Promise<TaskResponse> => {
    const response = await api.post<ApiResponse<TaskResponse>>('/tasks', body)
    return response.data.data
  },

  update: async (id: number, body: TaskRequest): Promise<TaskResponse> => {
    const response = await api.put<ApiResponse<TaskResponse>>(`/tasks/${id}`, body)
    return response.data.data
  },

  updateStatus: async (id: number, status: TaskStatus): Promise<TaskResponse> => {
    const response = await api.patch<ApiResponse<TaskResponse>>(`/tasks/${id}/status`, null, {
      params: { status },
    })
    return response.data.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },

  updateSortOrder: async (goalId: number, body: SortOrderRequest): Promise<void> => {
    await api.patch(`/tasks/goal/${goalId}/sort`, body)
  },
}
