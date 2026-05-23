import { useState } from 'react'
import type { FormEvent } from 'react'

import type { GoalRequest, GoalResponse } from '../../../types/api'

const GOAL_COLORS = [
  '#6366F1',
  '#3B82F6',
  '#22C55E',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#8B5CF6',
  '#14B8A6',
] as const

const LABELS = {
  title: 'T\u00ean goal',
  description: 'M\u00f4 t\u1ea3 (kh\u00f4ng b\u1eaft bu\u1ed9c)',
  targetMinutes: 'M\u1ee5c ti\u00eau (ph\u00fat)',
  deadline: 'Deadline',
  cancel: 'H\u1ee7y',
  save: 'L\u01b0u',
} as const

interface GoalFormProps {
  defaultValues?: Partial<GoalResponse>
  submitting?: boolean
  onSubmit: (body: GoalRequest) => void
  onCancel: () => void
}

export function GoalForm({ defaultValues, submitting = false, onSubmit, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [color, setColor] = useState<string>(defaultValues?.color ?? GOAL_COLORS[0])
  const [targetTotalMinutes, setTargetTotalMinutes] = useState<string>(
    defaultValues?.targetTotalMinutes !== null && defaultValues?.targetTotalMinutes !== undefined
      ? String(defaultValues.targetTotalMinutes)
      : '',
  )
  const [deadline, setDeadline] = useState<string>(defaultValues?.deadline?.slice(0, 10) ?? '')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) return

    const body: GoalRequest = {
      title: title.trim(),
      description: description.trim() || null,
      color,
      targetTotalMinutes: targetTotalMinutes ? Number(targetTotalMinutes) : null,
      deadline: deadline ? deadline : null,
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

      <div className="flex flex-wrap gap-2">
        {GOAL_COLORS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setColor(value)}
            className={`h-7 w-7 rounded-full transition ${color === value ? 'ring-2 ring-text-primary ring-offset-2 ring-offset-surface' : ''}`}
            style={{ backgroundColor: value }}
            aria-label={`Color ${value}`}
          />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-text-muted">
          <span className="mb-1 block">{LABELS.targetMinutes}</span>
          <input
            type="number"
            min={0}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none"
            value={targetTotalMinutes}
            onChange={(event) => setTargetTotalMinutes(event.target.value)}
          />
        </label>
        <label className="text-xs text-text-muted">
          <span className="mb-1 block">{LABELS.deadline}</span>
          <input
            type="date"
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />
        </label>
      </div>

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
