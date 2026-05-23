import { useMutation, useQueryClient } from '@tanstack/react-query'

import { goalService } from '../../../services/goalService'
import { goalsQueryKey } from './useGoals'

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (goalId: number) => goalService.delete(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsQueryKey })
    },
  })
}
