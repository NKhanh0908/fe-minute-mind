import { Clock, Users } from 'lucide-react'
import { useActivityFeed } from '../hooks/useActivityFeed'
import { Avatar } from '../../../components/ui/Avatar'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface FeedTabProps {
  onUserClick: (userId: number) => void
}

export function FeedTab({ onUserClick }: FeedTabProps) {
  const { data: feed = [], isLoading } = useActivityFeed()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    )
  }

  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface p-12 text-center">
        <Users size={48} className="mb-4 text-text-muted opacity-50" />
        <h3 className="mb-2 text-lg font-semibold text-text-primary">Chưa có hoạt động nào</h3>
        <p className="max-w-xs text-sm text-text-muted">
          Hãy theo dõi bạn bè để xem quá trình nỗ lực của họ tại đây.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {feed.map((activity) => (
        <div
          key={activity.id}
          className="flex gap-4 rounded-xl border border-border bg-surface p-4 transition hover:border-brand/30 hover:shadow-sm"
        >
          <button type="button" onClick={() => onUserClick(activity.userId)} className="shrink-0">
            <Avatar name={activity.userName} url={activity.userAvatarUrl} />
          </button>
          
          <div className="flex flex-1 flex-col justify-center">
            <p className="text-sm text-text-primary">
              <button
                type="button"
                onClick={() => onUserClick(activity.userId)}
                className="font-semibold hover:text-brand hover:underline"
              >
                {activity.userName}
              </button>{' '}
              {activity.content}
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs text-text-muted">
              <Clock size={12} />
              {formatDistanceToNow(new Date(activity.timestamp), {
                addSuffix: true,
                locale: vi,
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
