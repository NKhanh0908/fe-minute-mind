import { useQuery } from '@tanstack/react-query'
import { communityService } from '../../../services/communityService'

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ['community', 'search', query],
    queryFn: () => communityService.profile.searchUsers(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
