import { Crown, Trophy, UserPlus } from 'lucide-react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { useFollow, useUnfollow } from '../hooks/useFollow'
import { useAuthStore } from '../../auth/store/useAuthStore'

import { Avatar } from '../../../components/ui/Avatar'

function LeaderboardAvatar({ name, url, rank }: { name: string; url: string | null; rank: number }) {
  const rankColors: Record<number, string> = { 1: 'text-yellow-400', 2: 'text-zinc-400', 3: 'text-amber-600' }
  const color = rankColors[rank] ?? 'text-text-muted'

  return (
    <Avatar name={name} url={url} size="md">
      {rank <= 3 && (
        <Crown size={14} className={`absolute -top-2 -right-2 ${color}`} fill="currentColor" />
      )}
    </Avatar>
  )
}

export function LeaderboardTab({ onUserClick }: { onUserClick?: (userId: number) => void }) {
  const { data: entries = [], isLoading } = useLeaderboard()
  const follow = useFollow()
  const unfollow = useUnfollow()
  const currentUser = useAuthStore((s) => s.user)

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-surface" />
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-text-muted">
        <Trophy size={40} className="opacity-30" />
        <p className="text-sm">Chưa có dữ liệu. Hãy follow bạn bè để xem bảng xếp hạng!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, idx) => {
        const isMe = currentUser?.id === entry.userId
        const rankDisplay = idx + 1

        return (
          <div
            key={entry.userId}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
              isMe
                ? 'border-brand/40 bg-brand/5'
                : 'border-border bg-surface'
            }`}
          >
            <span className="w-6 text-center text-sm font-bold text-text-muted">
              {rankDisplay}
            </span>
            <button type="button" onClick={() => onUserClick?.(entry.userId)} className="shrink-0 text-left">
              <LeaderboardAvatar name={entry.name} url={entry.avatarUrl} rank={rankDisplay} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">
                <button
                  type="button"
                  onClick={() => onUserClick?.(entry.userId)}
                  className="hover:text-brand hover:underline"
                >
                  {entry.name}
                </button>
                <span className="text-xs text-text-muted font-normal ml-1">#{entry.userId}</span>
                {isMe && (
                  <span className="ml-2 text-xs text-brand">(bạn)</span>
                )}
              </p>
              <p className="text-xs text-text-muted">
                {entry.value} phút hôm nay
              </p>
            </div>
            {!isMe && (
              <button
                id={`leaderboard-follow-${entry.userId}`}
                type="button"
                disabled={follow.isPending || unfollow.isPending}
                onClick={() =>
                  entry.rank > 0
                    ? unfollow.mutate(entry.userId)
                    : follow.mutate(entry.userId)
                }
                className="shrink-0 rounded-lg border border-border p-1.5 text-text-muted transition hover:border-brand hover:text-brand disabled:opacity-50"
                title="Follow / Unfollow"
              >
                <UserPlus size={14} />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
