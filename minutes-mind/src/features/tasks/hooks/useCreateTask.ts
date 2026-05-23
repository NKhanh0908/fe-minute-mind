import { useMutation, useQueryClient } from '@tanstack/react-query'

import { taskService } from '../../../services/taskService'
import { tasksByGoalQueryKey } from './useTasks'

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: taskService.create,
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: tasksByGoalQueryKey(task.goalId) })
    },
  })
}
