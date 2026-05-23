import { useState } from 'react'
import type { FormEvent } from 'react'

import type { TaskRequest, TaskResponse } from '../../../types/api'

const LABELS = {
  title: 'T\u00ean task',
  description: 'M\u00f4 t\u1ea3 (kh\u00f4ng b\u1eaft bu\u1ed9c)',
  estimatedMinutes: 'D\u1ef1 ki\u1ebfn (ph\u00fat)',
  cancel: 'H\u1ee7y',
  save: 'L\u01b0u',
} as const

interface TaskFormProps {
  goalId: number
  defaultValues?: Partial<TaskResponse>
  submitting?: boolean
  onSubmit: (body: TaskRequest) => void
  onCancel: () => void
}

export function TaskForm({ goalId, defaultValues, submitting = false, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [estimatedMinutes, setEstimatedMinutes] = useState<string>(
    defaultValues?.estimatedMinutes !== null && defaultValues?.estimatedMinutes !== undefined
      ? String(defaultValues.estimatedMinutes)
      : '',
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) return

    const body: TaskRequest = {
      goalId,
      title: title.trim(),
      description: description.trim() || null,
      estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : null,
    }

    onSubmit(body)
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <input
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
        placeholder={LABELS.title}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        maxLength={255}
      />
      <textarea
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
        placeholder={LABELS.description}
        value={description ?? ''}
        onChange={(event) => setDescription(event.target.value)}
        rows={2}
      />

      <label className="text-xs text-text-muted">
        <span className="mb-1 block">{LABELS.estimatedMinutes}</span>
        <input
          type="number"
          min={0}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none"
          value={estimatedMinutes}
          onChange={(event) => setEstimatedMinutes(event.target.value)}
        />
      </label>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          className="rounded-lg bg-surface-2 px-4 py-2 text-sm text-text-primary transition-colors hover:bg-border"
          onClick={onCancel}
          disabled={submitting}
        >
          {LABELS.cancel}
        </button>
        <button
          type="submit"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
          disabled={submitting || !title.trim()}
        >
          {LABELS.save}
        </button>
      </div>
    </form>
  )
}
