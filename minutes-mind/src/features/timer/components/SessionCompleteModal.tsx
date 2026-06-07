import { useState } from 'react'

import { Modal } from '../../../components/Modal'

const MAX_RESULT_LENGTH = 500

const LABELS = {
  title: 'Phiên hoàn thành',
  worked: 'Bạn đã tập trung',
  minutesUnit: 'phút',
  taskLabel: 'Task',
  objectiveLabel: '🎯 Objective',
  resultLabel: '✅ Result',
  resultPlaceholder: 'Bạn đã làm được gì? Còn lại gì chưa xong?',
  markDone: 'Đánh dấu task hoàn thành',
  saveAndContinue: 'Lưu & tiếp tục',
  cancel: 'Đóng',
} as const

interface SessionCompleteModalProps {
  isOpen: boolean
  taskTitle: string | null
  actualMinutes: number
  sessionObjective: string | null
  saving?: boolean
  onClose: () => void
  onConfirm: (input: { actualMinutes: number; completedTask: boolean; notes: string | null }) => void
}

export function SessionCompleteModal({
  isOpen,
  taskTitle,
  actualMinutes,
  sessionObjective,
  saving = false,
  onClose,
  onConfirm,
}: SessionCompleteModalProps) {
  const [completedTask, setCompletedTask] = useState(false)
  const [result, setResult] = useState('')

  const resultLength = result.length

  /** Serialize notes as JSON so it's machine-readable and parser-safe */
  const buildNotes = (): string | null => {
    const obj = sessionObjective?.trim() || null
    const res = result.trim() || null
    if (!obj && !res) return null
    return JSON.stringify({ objective: obj, result: res })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={LABELS.title}>
      <div className="space-y-4 text-sm text-text-primary">
        {/* Time worked summary */}
        <div className="rounded-lg bg-surface-2 p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-text-muted">{LABELS.worked}</p>
          <p className="text-3xl font-bold text-brand">
            {Math.max(0, actualMinutes)}
            <span className="ml-1 text-base font-normal text-text-muted">{LABELS.minutesUnit}</span>
          </p>
        </div>

        {/* Task name */}
        {taskTitle ? (
          <div>
            <p className="text-xs text-text-muted">{LABELS.taskLabel}</p>
            <p className="text-sm text-text-primary">{taskTitle}</p>
          </div>
        ) : null}

        {/* Objective (read-only reference) */}
        {sessionObjective ? (
          <div className="rounded-lg border border-border bg-surface-2 px-3 py-2">
            <p className="mb-1 text-xs text-text-muted">{LABELS.objectiveLabel}</p>
            <p className="text-sm italic text-text-primary">"{sessionObjective}"</p>
          </div>
        ) : null}

        {/* Result input */}
        <label className="block text-xs text-text-muted">
          <div className="mb-1 flex items-center justify-between">
            <span>{LABELS.resultLabel}</span>
            {resultLength > 0 && (
              <span
                style={{
                  color: resultLength >= MAX_RESULT_LENGTH - 20 ? '#EF4444' : undefined,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {resultLength} / {MAX_RESULT_LENGTH}
              </span>
            )}
          </div>
          <textarea
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder={LABELS.resultPlaceholder}
            rows={3}
            maxLength={MAX_RESULT_LENGTH}
          />
        </label>

        {/* Mark task done */}
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer"
            checked={completedTask}
            onChange={(e) => setCompletedTask(e.target.checked)}
          />
          {LABELS.markDone}
        </label>

        {/* Actions */}
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
                notes: buildNotes(),
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
