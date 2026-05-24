import { Mail, Trophy, Activity } from 'lucide-react'
import { useState } from 'react'
import { InboxTab } from './InboxTab'
import { LeaderboardTab } from './LeaderboardTab'
import { FeedTab } from './FeedTab'
import { SearchPanel } from './SearchPanel'
import { PublicProfileModal } from './PublicProfileModal'
import { useMyInvitations } from '../hooks/useMyInvitations'

type Tab = 'leaderboard' | 'feed' | 'inbox'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'leaderboard', label: 'Bảng xếp hạng', icon: <Trophy size={15} /> },
  { id: 'feed',        label: 'Hoạt động',      icon: <Activity size={15} /> },
  { id: 'inbox',       label: 'Lời mời',         icon: <Mail size={15} /> },
]

export function CommunityPage() {
  const [tab, setTab] = useState<Tab>('leaderboard')
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const { data: invitations = [] } = useMyInvitations()
  const pendingCount = invitations.filter((i) => i.status === 'PENDING').length

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl p-6 md:p-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Cộng đồng</h1>
          <p className="mt-1 text-sm text-text-muted">Kết nối và cạnh tranh cùng bạn bè</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-4 lg:col-span-2">
            {/* Tab bar — pill style */}
            <div className="flex gap-1 rounded-2xl border border-border bg-surface p-1">
              {TABS.map(({ id, label, icon }) => {
                const isActive = tab === id
                const showBadge = id === 'inbox' && pendingCount > 0
                return (
                  <button
                    key={id}
                    id={`community-tab-${id}`}
                    type="button"
                    onClick={() => setTab(id)}
                    className="relative flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium transition-all duration-150"
                    style={isActive
                      ? { background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }
                      : { color: 'rgba(255,255,255,0.45)', border: '1px solid transparent' }
                    }
                  >
                    {icon}
                    <span className="hidden sm:inline">{label}</span>
                    {showBadge && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            <div>
              {tab === 'leaderboard' && <LeaderboardTab onUserClick={(id) => setSelectedUserId(id)} />}
              {tab === 'feed' && <FeedTab onUserClick={(id) => setSelectedUserId(id)} />}
              {tab === 'inbox' && <InboxTab />}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SearchPanel onUserClick={(id) => setSelectedUserId(id)} />
          </div>
        </div>
      </div>

      <PublicProfileModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  )
}
