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
    <div className="space-y-6 p-4 md:p-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GoalList selectedGoalId={selectedGoalId} onSelectGoal={setSelectedGoalId} />
          <TaskList goalId={selectedGoalId} />
        </div>
        <div className="space-y-6">
          {selectedGoal ? (
            <SharedGoalPanel goal={selectedGoal} />
          ) : (
             <div className="rounded-xl border border-border bg-surface p-4 text-center text-sm text-text-muted mt-10">
               Chọn một goal để xem thông tin chia sẻ
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
