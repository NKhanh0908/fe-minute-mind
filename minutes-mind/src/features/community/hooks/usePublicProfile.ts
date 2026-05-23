import { useQuery } from '@tanstack/react-query'
import { communityService } from '../../../services/communityService'

export function usePublicProfile(userId: number | null) {
  return useQuery({
    queryKey: ['community', 'profile', userId],
    queryFn: () => communityService.profile.getPublicProfile(userId!),
    enabled: userId !== null,
    staleTime: 1000 * 60, // 1 minute
  })
}
