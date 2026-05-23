import { Award, Clock, Flame } from 'lucide-react'

import { formatHHMM } from '../../../utils/formatTime'
import { useStats } from '../hooks/useStats'

export function StatsSummary() {
  const { data, isLoading } = useStats()

  if (isLoading) {
    return <div className="animate-pulse h-40 bg-surface rounded-xl"></div>
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-brand" />
            <span className="text-xs text-text-muted">Hôm nay</span>
          </div>
          <div className="text-2xl font-semibold text-text-primary font-mono">
            {formatHHMM(data.todayMinutes)}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-brand" />
            <span className="text-xs text-text-muted">Tổng cộng</span>
          </div>
          <div className="text-2xl font-semibold text-text-primary font-mono">
            {formatHHMM(data.totalMinutes)}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-medium text-text-primary flex items-center gap-2">
          <Flame className="w-4 h-4 text-status-warning" />
          Chuỗi (Streak)
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-text-muted mb-1">Hiện tại</div>
            <div className="text-xl font-semibold text-text-primary font-mono">
              {data.currentStreak} <span className="text-sm text-text-muted">ngày</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-text-muted mb-1">Kỷ lục</div>
            <div className="text-xl font-semibold text-text-primary font-mono">
              {data.longestStreak} <span className="text-sm text-text-muted">ngày</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-text-muted mb-1">Số ngày active</div>
            <div className="text-xl font-semibold text-text-primary font-mono">
              {data.totalActiveDays}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
