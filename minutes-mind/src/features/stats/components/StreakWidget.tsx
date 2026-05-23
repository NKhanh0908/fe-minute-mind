import { Flame } from 'lucide-react'

import { cn } from '../../../utils/cn'

interface Props {
  currentStreak: number
  longestStreak: number
  todayMinutes: number
  thresholdMinutes: number
}

export function StreakWidget({
  currentStreak,
  longestStreak,
  todayMinutes,
  thresholdMinutes,
}: Props) {
  const isThresholdMet = todayMinutes >= thresholdMinutes
  const progressPercent = Math.min(
    100,
    Math.round((todayMinutes / Math.max(1, thresholdMinutes)) * 100),
  )

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <div className="text-4xl font-bold font-mono text-text-primary">
              {currentStreak}{' '}
              <span className="text-base font-normal text-text-muted font-sans">
                ngày liên tiếp
              </span>
            </div>
            <div className="text-sm text-text-muted mt-1">
              Kỷ lục cá nhân: {longestStreak} ngày
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-sm space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-primary">
              Hôm nay: {todayMinutes} / {thresholdMinutes} phút
            </span>
            <span className="text-text-muted">{progressPercent}%</span>
          </div>
          <div className="bg-surface-2 rounded-full h-2 overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500 ease-out',
                isThresholdMet ? 'bg-status-success' : 'bg-status-warning',
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-xs font-medium pt-1">
            {isThresholdMet ? (
              <span className="text-status-success flex items-center gap-1">
                ✅ Streak hôm nay đã giữ được!
              </span>
            ) : (
              <span className="text-status-warning flex items-center gap-1">
                ⚠️ Còn {thresholdMinutes - todayMinutes} phút nữa để giữ streak
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
