import { BarChart2, Clock, ListTodo, LogOut, UserCircle2, Users } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

import { useLogout } from '../features/auth/hooks/useLogout'
import { useAuthStore } from '../features/auth/store/useAuthStore'
import { useMyInvitations } from '../features/community/hooks/useMyInvitations'

const NAV_LABELS = {
  timer: 'Timer',
  goals: 'Goals',
  stats: 'Thống kê',
  community: 'Cộng đồng',
  profile: 'Hồ sơ',
  logout: 'Đăng xuất',
} as const

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-surface-2 text-text-primary' : 'text-text-muted hover:text-text-primary'
  }`

export function AppShell() {
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()
  const { data: invitations = [] } = useMyInvitations()
  const pendingInvites = invitations.filter((i) => i.status === 'PENDING').length

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <aside className="hidden w-60 flex-col border-r border-border bg-surface md:flex">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <span className="text-lg font-semibold text-brand">Vilo</span>
          {user ? <span className="text-xs text-text-muted">{user.name}</span> : null}
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <NavLink to="/app/timer" className={navItemClass}>
            <Clock size={16} />
            {NAV_LABELS.timer}
          </NavLink>
          <NavLink to="/app/goals" className={navItemClass}>
            <ListTodo size={16} />
            {NAV_LABELS.goals}
          </NavLink>
          <NavLink to="/app/stats" className={navItemClass}>
            <BarChart2 size={16} />
            {NAV_LABELS.stats}
          </NavLink>
          <NavLink to="/app/community" className={navItemClass}>
            <span className="relative">
              <Users size={16} />
              {pendingInvites > 0 && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-brand text-[8px] font-bold text-white">
                  {pendingInvites}
                </span>
              )}
            </span>
            {NAV_LABELS.community}
          </NavLink>
          <NavLink to="/app/profile" className={navItemClass}>
            <UserCircle2 size={16} />
            {NAV_LABELS.profile}
          </NavLink>
        </nav>
        <button
          type="button"
          onClick={() => logout.mutate()}
          className="m-3 inline-flex items-center justify-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-text-muted hover:bg-border hover:text-status-danger"
          disabled={logout.isPending}
        >
          <LogOut size={16} />
          {NAV_LABELS.logout}
        </button>
      </aside>

      <main className="flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-surface px-4 py-2 md:hidden">
        <NavLink to="/app/timer" className={navItemClass}>
          <Clock size={18} />
        </NavLink>
        <NavLink to="/app/goals" className={navItemClass}>
          <ListTodo size={18} />
        </NavLink>
        <NavLink to="/app/stats" className={navItemClass}>
          <BarChart2 size={18} />
        </NavLink>
        <NavLink to="/app/community" className={navItemClass}>
          <span className="relative">
            <Users size={18} />
            {pendingInvites > 0 && (
              <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-brand text-[8px] font-bold text-white" />
            )}
          </span>
        </NavLink>
        <NavLink to="/app/profile" className={navItemClass}>
          <UserCircle2 size={18} />
        </NavLink>
        <button
          type="button"
          onClick={() => logout.mutate()}
          className="rounded-lg p-2 text-text-muted hover:text-status-danger"
          disabled={logout.isPending}
          aria-label={NAV_LABELS.logout}
        >
          <LogOut size={18} />
        </button>
      </nav>
    </div>
  )
}
