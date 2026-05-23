import { useQuery } from '@tanstack/react-query'

import { statsService } from '../../../services/statsService'

export function useStats() {
  return useQuery({
    queryKey: ['stats', 'summary'],
    queryFn: () => statsService.getSummary(),
    staleTime: 60_000, // Cache 1 min
  })
}
