import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AppShell } from '../components/AppShell'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { LoginPage } from '../features/auth/components/LoginPage'
import { RegisterPage } from '../features/auth/components/RegisterPage'
import { CommunityPage } from '../features/community/components/CommunityPage'
import { GoalsPage } from '../pages/GoalsPage'
import { StatsPage } from '../pages/StatsPage'
import { TimerPage } from '../pages/TimerPage'
import { ProfilePage } from '../features/profile/components/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/app/timer" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/app/timer" replace /> },
          { path: 'timer', element: <TimerPage /> },
          { path: 'goals', element: <GoalsPage /> },
          { path: 'stats', element: <StatsPage /> },
          { path: 'community', element: <CommunityPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
