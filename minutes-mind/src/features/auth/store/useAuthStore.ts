import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { UserResponse } from '../../../types/api'

interface AuthState {
  user: UserResponse | null
  accessToken: string | null
  setAuth: (user: UserResponse, accessToken: string) => void
  clearAuth: () => void
}

interface AuthSelectors {
  isAuthenticated: () => boolean
}

type AuthStore = AuthState & AuthSelectors

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      clearAuth: () => set({ user: null, accessToken: null }),
      isAuthenticated: () => get().accessToken !== null && get().user !== null,
    }),
    {
      name: 'auth-storage',
    }
  )
)

export const selectIsAuthenticated = (state: AuthStore) =>
  state.accessToken !== null && state.user !== null
