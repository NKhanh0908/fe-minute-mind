import { useMutation, useQueryClient } from '@tanstack/react-query'

import { sessionService } from '../../../services/sessionService'
import { tasksByGoalQueryKey } from '../../tasks/hooks/useTasks'
import { goalsQueryKey } from '../../goals/hooks/useGoals'
import type { SessionCompleteRequest } from '../../../types/api'
import { useTimerStore } from '../store/useTimerStore'

interface CompleteArgs {
  sessionId: number
  body: SessionCompleteRequest
  goalId?: number | null
}

export function useCompleteSession() {
  const reset = useTimerStore((s) => s.reset)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, body }: CompleteArgs) => sessionService.complete(sessionId, body),
    onSuccess: (_data, variables) => {
      reset()
      queryClient.invalidateQueries({ queryKey: goalsQueryKey })
      if (variables.goalId !== undefined && variables.goalId !== null) {
        queryClient.invalidateQueries({ queryKey: tasksByGoalQueryKey(variables.goalId) })
      }
    },
  })
}
