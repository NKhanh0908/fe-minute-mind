import { useQuery } from '@tanstack/react-query'
import { communityService } from '../../../services/communityService'

export function useActivityFeed() {
  return useQuery({
    queryKey: ['community', 'feed'],
    queryFn: () => communityService.profile.getFeed(),
    refetchInterval: 1000 * 60 * 5, // Auto refresh every 5 mins
  })
}
