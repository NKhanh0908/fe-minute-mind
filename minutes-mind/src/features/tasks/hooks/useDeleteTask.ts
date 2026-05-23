import { useMutation, useQueryClient } from '@tanstack/react-query'

import { taskService } from '../../../services/taskService'
import { tasksByGoalQueryKey } from './useTasks'

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: number; goalId: number }) => taskService.delete(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: tasksByGoalQueryKey(variables.goalId) })
    },
  })
}
