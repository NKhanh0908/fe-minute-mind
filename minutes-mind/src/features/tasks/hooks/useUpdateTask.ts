import { useMutation, useQueryClient } from '@tanstack/react-query'

import { taskService } from '../../../services/taskService'
import type { TaskRequest } from '../../../types/api'
import { tasksByGoalQueryKey } from './useTasks'

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskRequest }) => taskService.update(id, data),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: tasksByGoalQueryKey(task.goalId) })
    },
  })
}
