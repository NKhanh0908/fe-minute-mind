import { api } from './api'
import type {
  ActiveSessionResponse,
  ApiResponse,
  SessionCompleteRequest,
  SessionStartRequest,
} from '../types/api'

export const sessionService = {
  current: async (): Promise<ActiveSessionResponse | null> => {
    const response = await api.get<ApiResponse<ActiveSessionResponse | null>>('/sessions/current')
    return response.data.data ?? null
  },

  start: async (body: SessionStartRequest): Promise<ActiveSessionResponse> => {
    const response = await api.post<ApiResponse<ActiveSessionResponse>>('/sessions/start', body)
    return response.data.data
  },

  heartbeat: async (sessionId: number, currentActualMinutes: number): Promise<void> => {
    await api.post(`/sessions/${sessionId}/heartbeat`, null, {
      params: { currentActualMinutes },
    })
  },

  complete: async (sessionId: number, body: SessionCompleteRequest): Promise<void> => {
    await api.post(`/sessions/${sessionId}/complete`, body)
  },

  discard: async (sessionId: number): Promise<void> => {
    await api.post(`/sessions/${sessionId}/discard`)
  },
}
