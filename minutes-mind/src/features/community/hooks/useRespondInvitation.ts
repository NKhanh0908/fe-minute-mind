import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { RespondInvitationRequest } from '../../../types/api'
import { communityService } from '../../../services/communityService'
import { myInvitationsQueryKey } from './useMyInvitations'

export function useRespondInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: RespondInvitationRequest }) =>
      communityService.invitations.respond(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myInvitationsQueryKey })
    },
  })
}
