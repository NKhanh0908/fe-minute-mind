import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InviteMemberRequest } from '../../../types/api'
import { communityService } from '../../../services/communityService'
import { goalMembersQueryKey } from './useGoalMembers'
import { goalsQueryKey } from '../../goals/hooks/useGoals'

export function useEnableSharing(goalId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => communityService.sharedGoal.enableSharing(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsQueryKey })
    },
  })
}

export function useInviteMember(goalId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: InviteMemberRequest) => communityService.sharedGoal.invite(goalId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalMembersQueryKey(goalId) })
    },
  })
}

export function useKickMember(goalId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (memberId: number) => communityService.sharedGoal.kickMember(goalId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalMembersQueryKey(goalId) })
    },
  })
}

export function useLeaveGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (goalId: number) => communityService.sharedGoal.leave(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsQueryKey })
    },
  })
}
