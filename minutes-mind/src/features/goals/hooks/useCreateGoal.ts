import { useMutation, useQueryClient } from '@tanstack/react-query'

import { goalService } from '../../../services/goalService'
import { goalsQueryKey } from './useGoals'

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: goalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsQueryKey })
    },
  })
}
