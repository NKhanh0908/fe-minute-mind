import { useQuery } from '@tanstack/react-query'

import { goalService } from '../../../services/goalService'

export const goalsQueryKey = ['goals', 'list'] as const

export function useGoals() {
  return useQuery({
    queryKey: goalsQueryKey,
    queryFn: goalService.list,
    staleTime: 30_000,
  })
}
