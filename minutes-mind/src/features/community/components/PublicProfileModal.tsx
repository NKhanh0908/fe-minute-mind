import { Flame, Trophy, Clock } from 'lucide-react'
import { Modal } from '../../../components/Modal'
import { usePublicProfile } from '../hooks/usePublicProfile'
import { useFollow, useUnfollow } from '../hooks/useFollow'
import { Avatar } from '../../../components/ui/Avatar'

interface PublicProfileModalProps {
  userId: number | null
  onClose: () => void
}

export function PublicProfileModal({ userId, onClose }: PublicProfileModalProps) {
  const { data: profile, isLoading } = usePublicProfile(userId)
  const follow = useFollow()
  const unfollow = useUnfollow()

  if (!userId) return null

  return (
    <Modal isOpen={userId !== null} onClose={onClose} title="Hồ sơ">
      {isLoading || !profile ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar name={profile.name} url={profile.avatarUrl} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-text-primary truncate">{profile.name}</h2>
              <p className="text-sm text-text-muted">#{profile.userId}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (profile.isFollowing) {
                  unfollow.mutate(profile.userId)
                } else {
                  follow.mutate(profile.userId)
                }
              }}
              disabled={follow.isPending || unfollow.isPending}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                profile.isFollowing
                  ? 'bg-surface-2 text-text-primary hover:bg-border'
                  : 'bg-brand text-white hover:bg-brand/90'
              }`}
            >
              {profile.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-xl bg-surface-2 p-3 text-center">
              <Flame size={20} className="mb-1 text-orange-500" />
              <p className="text-xs font-medium text-text-muted">Streak hiện tại</p>
              <p className="text-lg font-bold text-text-primary">{profile.currentStreak} ngày</p>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-surface-2 p-3 text-center">
              <Trophy size={20} className="mb-1 text-yellow-500" />
              <p className="text-xs font-medium text-text-muted">Max Streak</p>
              <p className="text-lg font-bold text-text-primary">{profile.longestStreak} ngày</p>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-surface-2 p-3 text-center">
              <Clock size={20} className="mb-1 text-blue-500" />
              <p className="text-xs font-medium text-text-muted">Tổng giờ</p>
              <p className="text-lg font-bold text-text-primary">
                {Math.floor(profile.totalWorkMinutes / 60)}h
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">Huy hiệu đạt được</h3>
            {profile.badges.length === 0 ? (
              <p className="text-sm text-text-muted">Chưa có huy hiệu nào.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {profile.badges.map((badge) => (
                  <div
                    key={badge.code}
                    className="flex flex-col items-center justify-center rounded-lg bg-surface-2 p-2 text-center"
                    title={badge.name}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
