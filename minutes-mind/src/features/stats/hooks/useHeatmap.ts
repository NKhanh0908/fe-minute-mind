import { useQuery } from '@tanstack/react-query'

import { statsService } from '../../../services/statsService'

export function useHeatmap(days: number = 365) {
  return useQuery({
    queryKey: ['stats', 'heatmap', days],
    queryFn: () => statsService.getHeatmap(days),
  })
}
