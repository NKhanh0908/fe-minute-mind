import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useUserSearch } from '../hooks/useUserSearch'
import { useFollow, useUnfollow } from '../hooks/useFollow'
import { Avatar } from '../../../components/ui/Avatar'

interface SearchPanelProps {
  onUserClick: (userId: number) => void
}

export function SearchPanel({ onUserClick }: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  const { data: results = [], isLoading } = useUserSearch(debouncedQuery)
  const follow = useFollow()
  const unfollow = useUnfollow()

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h2 className="mb-4 text-sm font-bold text-text-primary">Tìm kiếm bạn bè</h2>
      
      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tên hoặc email..."
          className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm text-text-primary outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
        <Search size={16} className="absolute left-3 top-2.5 text-text-muted" />
      </div>

      <div className="space-y-3">
        {isLoading && query.trim() !== '' && (
          <p className="text-center text-xs text-text-muted">Đang tìm kiếm...</p>
        )}
        
        {!isLoading && debouncedQuery && results.length === 0 && (
          <p className="text-center text-xs text-text-muted">Không tìm thấy ai.</p>
        )}

        {results.map((user) => (
          <div key={user.userId} className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onUserClick(user.userId)}
              className="flex items-center gap-2 text-left hover:opacity-80 flex-1 min-w-0"
            >
              <Avatar name={user.name} url={user.avatarUrl} size="sm" />
              <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
            </button>
            <button
              type="button"
              onClick={() => {
                if (user.isFollowing) {
                  unfollow.mutate(user.userId)
                } else {
                  follow.mutate(user.userId)
                }
              }}
              disabled={follow.isPending || unfollow.isPending}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition shrink-0 ${
                user.isFollowing
                  ? 'bg-surface-2 text-text-primary hover:bg-border'
                  : 'bg-brand text-white hover:bg-brand/90'
              }`}
            >
              {user.isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
