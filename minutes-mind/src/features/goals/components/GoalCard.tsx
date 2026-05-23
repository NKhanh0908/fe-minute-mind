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
  ACTIVE:    'bg-blue-950 text-blue-400',
  PAUSED:    'bg-amber-950 text-amber-400',
  COMPLETED: 'bg-green-950 text-green-400',
  ARCHIVED:  'bg-zinc-800 text-zinc-400',
}

export function GoalCard({ goal, selected = false, onSelect, onEdit, onDelete }: GoalCardProps) {
  const target = goal.targetTotalMinutes ?? 0
  const progress = target > 0 ? Math.min(100, (goal.totalLoggedMinutes / target) * 100) : 0
  const accent = goal.color ?? '#6366F1'

  return (
    <div
      onClick={() => onSelect(goal.id)}
      className={`group relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-all duration-200 ${
        selected
          ? 'border-brand bg-brand/5 shadow-lg shadow-brand/10'
          : 'border-border bg-surface hover:border-border/80 hover:bg-surface-2'
      }`}
    >
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-2">
        {/* Left: color dot + title */}
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <h4 className="truncate text-sm font-semibold text-text-primary leading-tight">
            {goal.title}
          </h4>
        </div>

        {/* Right: status badge + action buttons — ALWAYS rendered, opacity trick */}
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_CLASS[goal.status]}`}>
            {goal.status}
          </span>
          {/* Action buttons — opacity transition, NO layout shift */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onEdit(goal) }}
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface hover:text-brand transition-colors"
                title="Sửa"
              >
                <Pencil size={13} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onDelete(goal.id) }}
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface hover:text-status-danger transition-colors"
                title="Xóa"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {goal.description && (
        <p className="mb-3 line-clamp-1 text-xs text-text-muted">{goal.description}</p>
      )}

      {/* Progress */}
      {target > 0 ? (
        <div className="mt-auto space-y-1.5">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%`, backgroundColor: accent }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-muted">
              {goal.totalLoggedMinutes} / {target} min
            </span>
            <span className="text-[11px] font-medium" style={{ color: accent }}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      ) : (
        <p className="mt-auto text-xs text-text-muted">{goal.totalLoggedMinutes} min logged</p>
      )}
    </div>
  )
}
