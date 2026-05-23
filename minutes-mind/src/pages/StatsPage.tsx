import { BadgeGrid } from '../features/stats/components/BadgeGrid'
import { HeatmapCalendar } from '../features/stats/components/HeatmapCalendar'
import { StatsSummary } from '../features/stats/components/StatsSummary'
import { StreakWidget } from '../features/stats/components/StreakWidget'
import { ALL_BADGES } from '../features/stats/constants/badges'
import { useHeatmap } from '../features/stats/hooks/useHeatmap'
import { useStats } from '../features/stats/hooks/useStats'

export function StatsPage() {
  const { data: statsData } = useStats()
  const { data: heatmapData = [] } = useHeatmap()

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary">Thống kê & Huy hiệu</h1>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <StatsSummary />
        </div>
        <div className="space-y-6">
          {statsData && (
            <StreakWidget
              currentStreak={statsData.currentStreak}
              longestStreak={statsData.longestStreak}
              todayMinutes={statsData.todayMinutes}
              thresholdMinutes={25} // Hardcoded or from user settings if available
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <HeatmapCalendar data={heatmapData} />
      </div>

      <div className="mt-8">
        <BadgeGrid badges={ALL_BADGES} earnedCodes={[]} />
      </div>
    </div>
  )
}
