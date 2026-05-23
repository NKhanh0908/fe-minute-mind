import { format, getDay, startOfDay, subDays } from 'date-fns'

import type { HeatmapResponse } from '../../../types/api'
import { cn } from '../../../utils/cn'

interface Props {
  data: HeatmapResponse[]
}

export function HeatmapCalendar({ data }: Props) {
  const today = startOfDay(new Date())
  const days = Array.from({ length: 365 }).map((_, i) => subDays(today, 364 - i))

  const dataMap = new Map(data.map((d) => [d.date, d.totalMinutes]))

  // Calculate offset for the first day (0 = Sunday)
  const firstDayOfWeek = getDay(days[0])
  const emptyDays = Array.from({ length: firstDayOfWeek }).map((_, i) => i)

  const getColorClass = (minutes: number) => {
    if (minutes === 0) return 'bg-surface-2'
    if (minutes < 30) return 'bg-brand/30'
    if (minutes < 60) return 'bg-brand/60'
    if (minutes < 120) return 'bg-brand/80'
    return 'bg-brand'
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6 overflow-x-auto">
      <h3 className="text-sm font-medium text-text-primary mb-4">Mức độ tập trung 1 năm qua</h3>
      <div className="flex gap-2 min-w-max">
        <div className="flex flex-col gap-1 text-[10px] text-text-muted mt-[2px]">
          <div className="h-3"></div>
          <div className="h-3 leading-3">Mon</div>
          <div className="h-3"></div>
          <div className="h-3 leading-3">Wed</div>
          <div className="h-3"></div>
          <div className="h-3 leading-3">Fri</div>
          <div className="h-3"></div>
        </div>

        <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
          {emptyDays.map((i) => (
            <div key={`empty-${i}`} className="w-3 h-3 rounded-sm bg-transparent" />
          ))}

          {days.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd')
            const minutes = dataMap.get(dateStr) || 0

            return (
              <div
                key={dateStr}
                title={`${dateStr}: ${minutes} phút`}
                className={cn(
                  'w-3 h-3 rounded-sm transition-colors hover:ring-1 hover:ring-white',
                  getColorClass(minutes),
                )}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
