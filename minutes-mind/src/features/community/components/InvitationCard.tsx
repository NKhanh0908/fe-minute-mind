import { Check, X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import type { GoalInvitationResponse } from '../../../types/api'
import { useRespondInvitation } from '../hooks/useRespondInvitation'
import { Avatar } from '../../../components/ui/Avatar'

interface InvitationCardProps {
  invitation: GoalInvitationResponse
}

export function InvitationCard({ invitation }: InvitationCardProps) {
  const queryClient = useQueryClient()
  const respond = useRespondInvitation()

  const handleRespond = (accept: boolean) => {
    respond.mutate(
      { id: invitation.id, body: { accept } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['community', 'invitations'] })
        },
      },
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
      <Avatar name={invitation.inviterName ?? 'U'} url={invitation.inviterAvatarUrl} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">
          <span className="text-brand">{invitation.inviterName ?? 'Ai đó'}</span>
          {' đã mời bạn vào goal '}
          <span className="font-semibold">"{invitation.goalTitle ?? '...'}"</span>
        </p>
        <p className="text-xs text-text-muted">
          {new Date(invitation.createdAt).toLocaleDateString('vi-VN')}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          id={`invitation-accept-${invitation.id}`}
          type="button"
          disabled={respond.isPending}
          onClick={() => respond.mutate({ id: invitation.id, body: { accept: true } })}
          className="flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          <Check size={13} />
          Chấp nhận
        </button>
        <button
          id={`invitation-decline-${invitation.id}`}
          type="button"
          disabled={respond.isPending}
          onClick={() => respond.mutate({ id: invitation.id, body: { accept: false } })}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition hover:border-status-danger hover:text-status-danger disabled:opacity-50"
        >
          <X size={13} />
          Từ chối
        </button>
      </div>
    </div>
  )
}
