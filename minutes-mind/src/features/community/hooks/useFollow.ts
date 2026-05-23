import { useMutation, useQueryClient } from '@tanstack/react-query'
import { communityService } from '../../../services/communityService'
import { leaderboardQueryKey } from './useLeaderboard'

export function useFollow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (followingId: number) => communityService.follow(followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaderboardQueryKey })
    },
  })
}

export function useUnfollow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (followingId: number) => communityService.unfollow(followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaderboardQueryKey })
    },
  })
}
