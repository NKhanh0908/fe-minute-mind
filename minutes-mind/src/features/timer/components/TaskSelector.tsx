import { memo, useMemo, useState } from 'react'

import { useTasks } from '../../tasks/hooks/useTasks'
import type { GoalResponse, TaskResponse } from '../../../types/api'

const LABELS = {
  title: 'Ch\u1ecdn task',
  goalLabel: 'Goal',
  taskLabel: 'Task',
  noGoals: 'Ch\u01b0a c\u00f3 goal n\u00e0o, h\u00e3y t\u1ea1o goal tr\u01b0\u1edbc.',
  noTasks: 'Goal n\u00e0y ch\u01b0a c\u00f3 task n\u00e0o.',
} as const

interface TaskSelectorProps {
  goals: GoalResponse[]
  selectedTask: TaskResponse | null
  onSelect: (task: TaskResponse | null, goal: GoalResponse | null) => void
  disabled?: boolean
}

export const TaskSelector = memo(function TaskSelector({ goals, selectedTask, onSelect, disabled = false }: TaskSelectorProps) {
  const [manualGoalId, setManualGoalId] = useState<number | null>(null)

  const goalId = useMemo<number | null>(() => {
    if (manualGoalId !== null && goals.some((goal) => goal.id === manualGoalId)) {
      return manualGoalId
    }
    if (selectedTask) {
      const goal = goals.find((candidate) => candidate.id === selectedTask.goalId)
      if (goal) return goal.id
    }
    return goals[0]?.id ?? null
  }, [manualGoalId, selectedTask, goals])

  const tasksQuery = useTasks(goalId)
  const tasks = tasksQuery.data ?? []
  const goal = goals.find((candidate) => candidate.id === goalId) ?? null

  if (goals.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4 text-sm text-text-muted">
        {LABELS.noGoals}
      </div>
    )
  }

  const handleGoalChange = (id: number) => {
    setManualGoalId(id)
    onSelect(null, goals.find((candidate) => candidate.id === id) ?? null)
  }

  const handleTaskChange = (id: number) => {
    const task = tasks.find((candidate) => candidate.id === id) ?? null
    onSelect(task, goal)
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold text-text-primary">{LABELS.title}</h3>

      <label className="block text-xs text-text-muted">
        <span className="mb-1 block">{LABELS.goalLabel}</span>
        <select
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          value={goalId ?? ''}
          disabled={disabled}
          onChange={(event) => handleGoalChange(Number(event.target.value))}
        >
          {goals.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-xs text-text-muted">
        <span className="mb-1 block">{LABELS.taskLabel}</span>
        <select
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          value={selectedTask?.id ?? ''}
          disabled={disabled || tasks.length === 0}
          onChange={(event) => handleTaskChange(Number(event.target.value))}
        >
          <option value="">--</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </label>

      {tasks.length === 0 && !tasksQuery.isLoading ? (
        <p className="text-xs text-text-muted">{LABELS.noTasks}</p>
      ) : null}
    </div>
  )
})
