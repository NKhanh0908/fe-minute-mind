import { useQuery } from '@tanstack/react-query'

import { taskService } from '../../../services/taskService'

export const tasksByGoalQueryKey = (goalId: number | null) => ['tasks', 'byGoal', goalId] as const

export function useTasks(goalId: number | null) {
  return useQuery({
    queryKey: tasksByGoalQueryKey(goalId),
    queryFn: () => taskService.listByGoal(goalId as number),
    enabled: goalId !== null,
    staleTime: 30_000,
  })
}
