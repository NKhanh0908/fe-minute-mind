import { useMutation, useQueryClient } from '@tanstack/react-query'

import { taskService } from '../../../services/taskService'
import type { TaskResponse, TaskStatus } from '../../../types/api'
import { tasksByGoalQueryKey } from './useTasks'

interface MutationVariables {
  id: number
  goalId: number
  status: TaskStatus
}

interface MutationContext {
  key: ReturnType<typeof tasksByGoalQueryKey>
  previous?: TaskResponse[]
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()

  return useMutation<TaskResponse, Error, MutationVariables, MutationContext>({
    mutationFn: ({ id, status }) => taskService.updateStatus(id, status),
    onMutate: async ({ id, goalId, status }) => {
      const key = tasksByGoalQueryKey(goalId)
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<TaskResponse[]>(key)

      queryClient.setQueryData<TaskResponse[]>(key, (old = []) =>
        old.map((task) => (task.id === id ? { ...task, status } : task)),
      )

      return { key, previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous)
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: tasksByGoalQueryKey(variables.goalId) })
    },
  })
}
