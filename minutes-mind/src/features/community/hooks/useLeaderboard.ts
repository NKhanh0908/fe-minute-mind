import { useQuery } from '@tanstack/react-query'
import { communityService } from '../../../services/communityService'

export const leaderboardQueryKey = ['community', 'leaderboard', 'daily'] as const

export function useLeaderboard() {
  return useQuery({
    queryKey: leaderboardQueryKey,
    queryFn: communityService.leaderboard.daily,
    staleTime: 60_000,
  })
}
