import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { sessionService } from '../../../services/sessionService'
import { goalService } from '../../../services/goalService'
import { taskService } from '../../../services/taskService'
import { goalsQueryKey } from '../../goals/hooks/useGoals'
import { tasksByGoalQueryKey } from '../../tasks/hooks/useTasks'
import { useAuthStore } from '../../auth/store/useAuthStore'
import { useTimerStore } from '../store/useTimerStore'

export function useSessionRecovery() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!accessToken) return

    let cancelled = false

    sessionService
      .current()
      .then(async (active) => {
        if (cancelled || !active) return

        let taskTitle: string | null = null
        let goalColor: string | null = null

        try {
          const goals = await queryClient.ensureQueryData({
            queryKey: goalsQueryKey,
            queryFn: goalService.list,
          })
          for (const goal of goals) {
            const tasks = await queryClient.ensureQueryData({
              queryKey: tasksByGoalQueryKey(goal.id),
              queryFn: () => taskService.listByGoal(goal.id),
            })
            const task = tasks.find((candidate) => candidate.id === active.taskId)
            if (task) {
              taskTitle = task.title
              goalColor = goal.color
              break
            }
          }
        } catch {
          // best-effort fallback when goal/task lookup fails
        }

        if (cancelled) return
        useTimerStore.getState().hydrateFromActive(active, { taskTitle, goalColor })
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [accessToken, queryClient])
}
