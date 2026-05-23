import { Mail, Trophy, Activity } from 'lucide-react'
import { useState } from 'react'
import { InboxTab } from './InboxTab'
import { LeaderboardTab } from './LeaderboardTab'
import { FeedTab } from './FeedTab'
import { SearchPanel } from './SearchPanel'
import { PublicProfileModal } from './PublicProfileModal'
import { useMyInvitations } from '../hooks/useMyInvitations'

type Tab = 'leaderboard' | 'feed' | 'inbox'

export function CommunityPage() {
  const [tab, setTab] = useState<Tab>('leaderboard')
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const { data: invitations = [] } = useMyInvitations()
  const pendingCount = invitations.filter((i) => i.status === 'PENDING').length

  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId)
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Cộng đồng</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cột trái (Main Content) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tab bar */}
          <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
            <button
              id="community-tab-leaderboard"
              type="button"
              onClick={() => setTab('leaderboard')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                tab === 'leaderboard'
                  ? 'bg-surface-2 text-text-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Trophy size={15} />
              <span className="hidden sm:inline">Bảng xếp hạng</span>
              <span className="sm:hidden">Top</span>
            </button>
            <button
              id="community-tab-feed"
              type="button"
              onClick={() => setTab('feed')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                tab === 'feed'
                  ? 'bg-surface-2 text-text-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Activity size={15} />
              Hoạt động
            </button>
            <button
              id="community-tab-inbox"
              type="button"
              onClick={() => setTab('inbox')}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                tab === 'inbox'
                  ? 'bg-surface-2 text-text-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Mail size={15} />
              Lời mời
              {pendingCount > 0 && (
                <span className="absolute right-2 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* Tab content */}
          {tab === 'leaderboard' && <LeaderboardTab onUserClick={handleUserClick} />}
          {tab === 'feed' && <FeedTab onUserClick={handleUserClick} />}
          {tab === 'inbox' && <InboxTab />}
        </div>

        {/* Cột phải (Sidebar) */}
        <div className="space-y-6 lg:col-span-1">
          <SearchPanel onUserClick={handleUserClick} />
        </div>
      </div>

      <PublicProfileModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  )
}
