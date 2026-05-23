import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { authService } from '../../../services/authService'
import { useAuthStore } from '../store/useAuthStore'

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await authService.logout(refreshToken).catch(() => undefined)
      }
    },
    onSettled: () => {
      clearAuth()
      localStorage.removeItem('refreshToken')
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })
}
