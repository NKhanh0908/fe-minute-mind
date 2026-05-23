import { api } from './api'
import type { ApiResponse, HeatmapResponse, StatsSummaryResponse } from '../types/api'

export const statsService = {
  getSummary: async (): Promise<StatsSummaryResponse> => {
    const response = await api.get<ApiResponse<StatsSummaryResponse>>('/stats/summary')
    return response.data.data
  },

  getHeatmap: async (days: number = 365): Promise<HeatmapResponse[]> => {
    const response = await api.get<ApiResponse<HeatmapResponse[]>>(`/stats/heatmap?days=${days}`)
    return response.data.data
  },
}
