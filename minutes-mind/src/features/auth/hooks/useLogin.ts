import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { authService } from '../../../services/authService'
import { useAuthStore } from '../store/useAuthStore'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      navigate('/app/timer', { replace: true })
    },
  })
}
