import { RouterProvider } from 'react-router-dom'

import { useThemeInit } from './features/theme/hooks/useThemeInit'
import { useSessionRecovery } from './features/timer/hooks/useSessionRecovery'
import { router } from './router'

export function AppBootstrap() {
  useThemeInit()
  useSessionRecovery()
  return <RouterProvider router={router} />
}
