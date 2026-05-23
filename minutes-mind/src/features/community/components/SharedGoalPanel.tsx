import { Crown, Loader2, UserX } from 'lucide-react'
import { useState } from 'react'
import type { GoalMemberResponse } from '../../../types/api'
import { useGoalMembers } from '../hooks/useGoalMembers'
import { useKickMember, useEnableSharing, useInviteMember } from '../hooks/useSharedGoal'
import type { GoalResponse } from '../../../types/api'
import { useAuthStore } from '../../auth/store/useAuthStore'

import { Avatar } from '../../../components/ui/Avatar'

function ProgressBar({ percent }: { percent: number }) {
  if (percent < 0) return null
  return (
    <div className="mt-1 h-1 w-full rounded-full bg-surface-2">
      <div
        className="h-full rounded-full bg-brand transition-all"
        style={{ width: `${Math.min(100, percent)}%` }}
      />
    </div>
  )
}

interface SharedGoalPanelProps {
  goal: GoalResponse
}

export function SharedGoalPanel({ goal }: SharedGoalPanelProps) {
  const currentUser = useAuthStore((s) => s.user)
  const [inviteeIdInput, setInviteeIdInput] = useState('')

  const enableSharing = useEnableSharing(goal.id)
  const invite = useInviteMember(goal.id)
  const kick = useKickMember(goal.id)

  const { data: members = [], isLoading } = useGoalMembers(goal.isShared ? goal.id : 0)

  const isOwner = goal.isShared
    ? members.find((m) => m.userId === currentUser?.id)?.role === 'OWNER'
    : currentUser?.id !== undefined  // nếu chưa shared, chỉ owner mới thấy panel này

  // Nếu chưa shared — hiện nút bật
  if (!goal.isShared) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-border p-4 text-center">
        <p className="mb-2 text-xs text-text-muted">Goal này chưa được chia sẻ</p>
        <button
          id={`goal-enable-sharing-${goal.id}`}
          type="button"
          disabled={enableSharing.isPending}
          onClick={() => enableSharing.mutate()}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {enableSharing.isPending ? <Loader2 size={13} className="animate-spin" /> : null}
          Bật Shared Goal
        </button>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Member board */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <h4 className="mb-3 text-sm font-semibold text-text-primary flex items-center gap-2">
          <Crown size={14} className="text-yellow-400" />
          Thành viên ({isLoading ? '...' : members.length})
        </h4>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-2" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((m) => (
              <MemberRow
                key={m.userId}
                member={m}
                isMe={m.userId === currentUser?.id}
                isOwner={isOwner}
                onKick={() => kick.mutate(m.userId)}
                kickPending={kick.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Invite form — chỉ owner thấy */}
      {isOwner && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Mời thành viên
          </h4>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const id = Number(inviteeIdInput.trim())
              if (!id) return
              invite.mutate({ inviteeId: id }, { onSuccess: () => setInviteeIdInput('') })
            }}
            className="flex gap-2"
          >
            <input
              id={`invite-input-${goal.id}`}
              type="number"
              min={1}
              placeholder="User ID bạn bè..."
              value={inviteeIdInput}
              onChange={(e) => setInviteeIdInput(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
            />
            <button
              type="submit"
              disabled={invite.isPending || !inviteeIdInput}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {invite.isPending ? <Loader2 size={14} className="animate-spin" /> : 'Mời'}
            </button>
          </form>
          {invite.isError && (
            <p className="mt-1 text-xs text-status-danger">
              {(invite.error as Error)?.message ?? 'Lỗi khi mời thành viên'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function MemberRow({
  member,
  isMe,
  isOwner,
  onKick,
  kickPending,
}: {
  member: GoalMemberResponse
  isMe: boolean
  isOwner: boolean
  onKick: () => void
  kickPending: boolean
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-2">
      <Avatar name={member.name} url={member.avatarUrl} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-xs font-medium text-text-primary">{member.name}</span>
          {member.role === 'OWNER' && (
            <Crown size={10} className="shrink-0 text-yellow-400" fill="currentColor" />
          )}
          {isMe && <span className="text-xs text-brand">(bạn)</span>}
        </div>
        <p className="text-[10px] text-text-muted">
          Hôm nay: {member.todayMinutes} phút · Tổng: {member.totalMinutes} phút
          {member.progressPercent >= 0 ? ` · ${member.progressPercent}%` : ''}
        </p>
        <ProgressBar percent={member.progressPercent} />
      </div>
      {isOwner && !isMe && member.role !== 'OWNER' && (
        <button
          id={`kick-member-${member.userId}`}
          type="button"
          disabled={kickPending}
          onClick={onKick}
          title="Kick thành viên"
          className="shrink-0 rounded-md p-1 text-text-muted transition hover:text-status-danger disabled:opacity-50"
        >
          <UserX size={13} />
        </button>
      )}
    </div>
  )
}
