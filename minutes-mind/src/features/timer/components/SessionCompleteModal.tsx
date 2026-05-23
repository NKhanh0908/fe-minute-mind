import { useState } from 'react'

import { Modal } from '../../../components/Modal'

const LABELS = {
  title: 'Phi\u00ean ho\u00e0n th\u00e0nh',
  worked: 'B\u1ea1n \u0111\u00e3 t\u1eadp trung',
  minutesUnit: 'ph\u00fat',
  taskLabel: 'Task',
  notesLabel: 'Ghi ch\u00fa (kh\u00f4ng b\u1eaft bu\u1ed9c)',
  markDone: '\u0110\u00e1nh d\u1ea5u task ho\u00e0n th\u00e0nh',
  saveAndContinue: 'L\u01b0u & ti\u1ebfp t\u1ee5c',
  cancel: '\u0110\u00f3ng',
} as const

interface SessionCompleteModalProps {
  isOpen: boolean
  taskTitle: string | null
  actualMinutes: number
  saving?: boolean
  onClose: () => void
  onConfirm: (input: { actualMinutes: number; completedTask: boolean; notes: string | null }) => void
}

export function SessionCompleteModal({
  isOpen,
  taskTitle,
  actualMinutes,
  saving = false,
  onClose,
  onConfirm,
}: SessionCompleteModalProps) {
  const [completedTask, setCompletedTask] = useState(false)
  const [notes, setNotes] = useState('')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={LABELS.title}>
      <div className="space-y-4 text-sm text-text-primary">
        <div className="rounded-lg bg-surface-2 p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-text-muted">{LABELS.worked}</p>
          <p className="text-3xl font-bold text-brand">
            {Math.max(0, actualMinutes)}
            <span className="ml-1 text-base font-normal text-text-muted">{LABELS.minutesUnit}</span>
          </p>
        </div>

        {taskTitle ? (
          <div>
            <p className="text-xs text-text-muted">{LABELS.taskLabel}</p>
            <p className="text-sm text-text-primary">{taskTitle}</p>
          </div>
        ) : null}

        <label className="block text-xs text-text-muted">
          <span className="mb-1 block">{LABELS.notesLabel}</span>
          <textarea
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={2}
            maxLength={500}
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer"
            checked={completedTask}
            onChange={(event) => setCompletedTask(event.target.checked)}
          />
          {LABELS.markDone}
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg bg-surface-2 px-4 py-2 text-sm text-text-primary transition-colors hover:bg-border"
            onClick={onClose}
            disabled={saving}
          >
            {LABELS.cancel}
          </button>
          <button
            type="button"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
            onClick={() =>
              onConfirm({
                actualMinutes: Math.max(0, actualMinutes),
                completedTask,
                notes: notes.trim() ? notes.trim() : null,
              })
            }
            disabled={saving}
          >
            {LABELS.saveAndContinue}
          </button>
        </div>
      </div>
    </Modal>
  )
}
