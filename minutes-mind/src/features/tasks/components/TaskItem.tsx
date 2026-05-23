import { Pencil, Trash2 } from 'lucide-react'

import type { TaskResponse, TaskStatus } from '../../../types/api'

const LABELS = {
  estimated: 'D\u1ef1 ki\u1ebfn',
  logged: 'Th\u1ef1c t\u1ebf',
} as const

const STATUS_CLASS: Record<TaskStatus, string> = {
  TODO: 'bg-zinc-800 text-zinc-300',
  IN_PROGRESS: 'bg-blue-950 text-blue-400',
  DONE: 'bg-green-950 text-green-400',
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
    <div className="group flex items-center justify-between rounded-lg border border-border bg-surface p-3">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer"
          checked={isDone}
          onChange={(event) => onStatusChange(task.id, event.target.checked ? 'DONE' : 'TODO')}
          aria-label={task.title}
        />
        <div>
          <p className={`text-sm text-text-primary ${isDone ? 'line-through opacity-60' : ''}`}>
            {task.title}
          </p>
          <p className="text-xs text-text-muted">
            {LABELS.estimated}: {task.estimatedMinutes ?? 0}p &middot; {LABELS.logged}: {task.totalLoggedMinutes}p
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_CLASS[task.status]}`}>
          {task.status}
        </span>
        <div className="hidden items-center gap-1 group-hover:flex">
          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="rounded p-1 text-text-muted transition hover:bg-surface-2 hover:text-brand"
              aria-label="Edit"
            >
              <Pencil size={14} />
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="rounded p-1 text-text-muted transition hover:bg-surface-2 hover:text-status-danger"
              aria-label="Delete"
            >
              <Trash2 size={14} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
