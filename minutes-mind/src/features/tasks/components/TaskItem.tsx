import { Pencil, Trash2 } from 'lucide-react'

import type { TaskResponse, TaskStatus } from '../../../types/api'

const STATUS_CLASS: Record<TaskStatus, string> = {
  TODO:        'bg-zinc-800 text-zinc-300',
  IN_PROGRESS: 'bg-blue-950 text-blue-400',
  DONE:        'bg-green-950 text-green-400',
}

interface TaskItemProps {
  task: TaskResponse
  onStatusChange: (id: number, status: TaskStatus) => void
  onEdit?: (task: TaskResponse) => void
  onDelete?: (id: number) => void
}

export function TaskItem({ task, onStatusChange, onEdit, onDelete }: TaskItemProps) {
  const isDone = task.status === 'DONE'

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all duration-150 hover:border-border hover:bg-surface-2">
      {/* Checkbox */}
      <input
        type="checkbox"
        className="h-4 w-4 shrink-0 cursor-pointer accent-brand"
        checked={isDone}
        onChange={(e) => onStatusChange(task.id, e.target.checked ? 'DONE' : 'TODO')}
        aria-label={task.title}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Text content */}
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium leading-tight text-text-primary transition-all ${isDone ? 'line-through opacity-50' : ''}`}>
          {task.title}
        </p>
        <p className="mt-0.5 text-[11px] text-text-muted">
          Dự kiến: {task.estimatedMinutes ?? 0}p · Thực tế: {task.totalLoggedMinutes}p
        </p>
      </div>

      {/* Right side: status + actions */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Status badge — fixed width to prevent layout shift */}
        <span className={`min-w-[64px] rounded-full px-2 py-0.5 text-center text-[10px] font-medium uppercase tracking-wider ${STATUS_CLASS[task.status]}`}>
          {task.status}
        </span>

        {/* Actions — ALWAYS rendered, opacity only, NO layout shift */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="rounded-lg p-1.5 text-text-muted hover:bg-surface hover:text-brand transition-colors"
              aria-label="Edit"
            >
              <Pencil size={13} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="rounded-lg p-1.5 text-text-muted hover:bg-surface hover:text-status-danger transition-colors"
              aria-label="Delete"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
