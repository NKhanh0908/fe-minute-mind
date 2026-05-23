import { Pencil, Trash2 } from 'lucide-react'
import type { GoalResponse } from '../../../types/api'

interface GoalCardProps {
  goal: GoalResponse
  selected?: boolean
  onSelect: (id: number) => void
  onEdit?: (goal: GoalResponse) => void
  onDelete?: (id: number) => void
}

const STATUS_CLASS: Record<GoalResponse['status'], string> = {
  ACTIVE: 'bg-blue-950 text-blue-400',
  PAUSED: 'bg-amber-950 text-amber-400',
  COMPLETED: 'bg-green-950 text-green-400',
  ARCHIVED: 'bg-zinc-800 text-zinc-400',
}

export function GoalCard({ goal, selected = false, onSelect, onEdit, onDelete }: GoalCardProps) {
  const target = goal.targetTotalMinutes ?? 0
  const progress = target > 0 ? Math.min(100, (goal.totalLoggedMinutes / target) * 100) : 0
  const accent = goal.color ?? '#6366F1'

  return (
    <div
      className={`group relative flex w-full flex-col rounded-xl border p-4 text-left transition ${
        selected
          ? 'border-brand bg-surface-2'
          : 'border-border bg-surface hover:border-brand/40 hover:bg-surface-2'
      }`}
    >
      <div 
        className="absolute inset-0 cursor-pointer rounded-xl"
        onClick={() => onSelect(goal.id)}
        aria-hidden="true"
      />
      <div className="mb-2 flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <span
            className="h-4 w-1 rounded-full"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
          <h4 className="text-sm font-semibold text-text-primary">{goal.title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_CLASS[goal.status]}`}>
            {goal.status}
          </span>
          <div className="hidden items-center gap-1 group-hover:flex">
            {onEdit ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(goal)
                }}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface hover:text-brand"
                title="Sửa"
              >
                <Pencil size={14} />
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(goal.id)
                }}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface hover:text-status-danger"
                title="Xóa"
              >
                <Trash2 size={14} />
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {goal.description ? (
        <p className="line-clamp-1 text-xs text-text-muted">{goal.description}</p>
      ) : null}
      {target > 0 ? (
        <>
          <div className="mt-3 h-1.5 rounded-full bg-surface-2">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: accent }}
            />
          </div>
          <p className="mt-2 text-xs text-text-muted">
            {goal.totalLoggedMinutes} / {target} min
          </p>
        </>
      ) : (
        <p className="mt-3 text-xs text-text-muted">{goal.totalLoggedMinutes} min logged</p>
      )}
    </div>
  )
}
