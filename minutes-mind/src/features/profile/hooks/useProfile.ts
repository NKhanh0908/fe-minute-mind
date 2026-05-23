import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '../../auth/store/useAuthStore'
import { userService } from '../../../services/userService'
import type { UpdateProfileRequest } from '../../../types/api'

export function useProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userService.getProfile(),
    staleTime: 60_000,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { setAuth, accessToken } = useAuthStore.getState()

  return useMutation({
    mutationFn: (body: UpdateProfileRequest) => userService.updateProfile(body),
    onSuccess: (updated) => {
      queryClient.setQueryData(['user', 'profile'], updated)
      if (accessToken) {
        setAuth(updated, accessToken)
      }
    },
  })
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient()
  const { setAuth, accessToken } = useAuthStore.getState()

  return useMutation({
    mutationFn: (file: File) => userService.updateAvatar(file),
    onSuccess: (updated) => {
      queryClient.setQueryData(['user', 'profile'], updated)
      if (accessToken) {
        setAuth(updated, accessToken)
      }
    },
  })
}

export function useRemoveAvatar() {
  const queryClient = useQueryClient()
  const { setAuth, user, accessToken } = useAuthStore.getState()

  return useMutation({
    mutationFn: () => userService.removeAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
      if (user && accessToken) {
        setAuth({ ...user, avatarUrl: null }, accessToken)
      }
    },
  })
}
