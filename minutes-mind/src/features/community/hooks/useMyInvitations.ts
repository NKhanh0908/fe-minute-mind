import { useQuery } from '@tanstack/react-query'
import { communityService } from '../../../services/communityService'

export const myInvitationsQueryKey = ['community', 'invitations', 'mine'] as const

export function useMyInvitations() {
  return useQuery({
    queryKey: myInvitationsQueryKey,
    queryFn: communityService.invitations.listMine,
    staleTime: 30_000,
  })
}
