import { useMutation, useQueryClient } from '@tanstack/react-query'

import { goalService } from '../../../services/goalService'
import type { GoalRequest } from '../../../types/api'
import { goalsQueryKey } from './useGoals'

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: GoalRequest }) => goalService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsQueryKey })
    },
  })
}
