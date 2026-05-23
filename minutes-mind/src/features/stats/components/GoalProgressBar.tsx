import type { GoalResponse } from '../../../types/api'

interface Props {
  goal: GoalResponse
}

export function GoalProgressBar({ goal }: Props) {
  if (!goal.targetTotalMinutes) return null

  const progress = Math.min(
    100,
    Math.round((goal.totalLoggedMinutes / goal.targetTotalMinutes) * 100),
  )

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between text-sm">
        <span className="text-text-primary font-medium">{goal.title}</span>
        <span className="text-text-muted">{progress}%</span>
      </div>
      <div className="bg-surface-2 rounded-full h-2 overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, backgroundColor: goal.color || '#6366F1' }}
        />
      </div>
      <div className="text-xs text-text-muted">
        {goal.totalLoggedMinutes} phút / {goal.targetTotalMinutes} phút
      </div>
    </div>
  )
}
