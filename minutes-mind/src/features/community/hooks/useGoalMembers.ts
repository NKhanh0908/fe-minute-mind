import { useQuery } from '@tanstack/react-query'
import { communityService } from '../../../services/communityService'

export const goalMembersQueryKey = (goalId: number) =>
  ['community', 'goals', goalId, 'members'] as const

export function useGoalMembers(goalId: number) {
  return useQuery({
    queryKey: goalMembersQueryKey(goalId),
    queryFn: () => communityService.sharedGoal.getMembers(goalId),
    staleTime: 30_000,
    enabled: goalId > 0,
  })
}
