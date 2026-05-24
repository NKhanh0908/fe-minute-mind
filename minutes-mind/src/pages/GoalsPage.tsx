import { useState, useMemo } from 'react'

import { GoalList } from '../features/goals/components/GoalList'
import { TaskList } from '../features/tasks/components/TaskList'
import { SharedGoalPanel } from '../features/community/components/SharedGoalPanel'
import { useGoals } from '../features/goals/hooks/useGoals'

export function GoalsPage() {
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null)
  const { data: goals = [] } = useGoals()

  const selectedGoal = useMemo(() => {
    return goals.find(g => g.id === selectedGoalId)
  }, [goals, selectedGoalId])

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-6xl space-y-0 p-6 md:p-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Goals</h1>
          <p className="mt-1 text-sm text-text-muted">Quản lý mục tiêu và công việc của bạn</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <GoalList selectedGoalId={selectedGoalId} onSelectGoal={setSelectedGoalId} />
            <TaskList goalId={selectedGoalId} />
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {selectedGoal ? (
              <SharedGoalPanel goal={selectedGoal} />
            ) : (
              <div className="rounded-2xl border border-border bg-surface p-6 text-center">
                <div className="text-text-muted/40 text-4xl mb-3">🎯</div>
                <p className="text-sm text-text-muted">Chọn một goal để xem thông tin chia sẻ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
