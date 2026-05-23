import { Mail } from 'lucide-react'
import { useMyInvitations } from '../hooks/useMyInvitations'
import { InvitationCard } from './InvitationCard'

export function InboxTab() {
  const { data: invitations = [], isLoading } = useMyInvitations()
  const pending = invitations.filter((inv) => inv.status === 'PENDING')

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-surface" />
        ))}
      </div>
    )
  }

  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-text-muted">
        <Mail size={40} className="opacity-30" />
        <p className="text-sm">Không có lời mời nào đang chờ</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {pending.map((inv) => (
        <InvitationCard key={inv.id} invitation={inv} />
      ))}
    </div>
  )
}
