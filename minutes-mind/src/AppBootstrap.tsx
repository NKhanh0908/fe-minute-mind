import { RouterProvider } from 'react-router-dom'

import { useSessionRecovery } from './features/timer/hooks/useSessionRecovery'
import { router } from './router'

export function AppBootstrap() {
  useSessionRecovery()
  return <RouterProvider router={router} />
}
