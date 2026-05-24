import { memo } from 'react'

const PRESETS_WORK = [25, 45, 60, 90] as const
const PRESETS_BREAK = [5, 10, 15, 30] as const

const LABELS = {
  title: 'Th\u1eddi l\u01b0\u1ee3ng',
  custom: 'T\u00f9y ch\u1ec9nh (ph\u00fat)',
} as const

interface DurationPickerProps {
  value: number
  mode: 'WORK' | 'BREAK'
  onModeChange: (mode: 'WORK' | 'BREAK') => void
  onChange: (value: number) => void
  disabled?: boolean
}

export const DurationPicker = memo(function DurationPicker({ value, mode, onModeChange, onChange, disabled = false }: DurationPickerProps) {
  const currentPresets = mode === 'WORK' ? PRESETS_WORK : PRESETS_BREAK

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-4 flex overflow-hidden rounded-lg border border-border p-1 bg-surface-2">
        <button
          type="button"
          onClick={() => onModeChange('WORK')}
          disabled={disabled}
          className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
            mode === 'WORK' ? 'bg-brand text-white shadow' : 'text-text-muted hover:text-text-primary'
          } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          WORK
        </button>
        <button
          type="button"
          onClick={() => onModeChange('BREAK')}
          disabled={disabled}
          className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
            mode === 'BREAK' ? 'bg-green-600 text-white shadow' : 'text-text-muted hover:text-text-primary'
          } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          BREAK
        </button>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">{LABELS.title}</h3>
        <span className="text-xs text-text-muted">{value} min</span>
      </div>
      <div className="mb-3 grid grid-cols-4 gap-2">
        {currentPresets.map((preset) => (
          <button
            key={preset}
            type="button"
            disabled={disabled}
            onClick={() => onChange(preset)}
            className={`rounded-lg px-3 py-2 text-sm transition ${
              value === preset
                ? 'bg-brand text-white'
                : 'bg-surface-2 text-text-muted hover:text-text-primary'
            } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            {preset}
          </button>
        ))}
      </div>
      <label className="block text-xs text-text-muted">
        <span className="mb-1 block">{LABELS.custom}</span>
        <input
          type="number"
          min={1}
          max={240}
          value={value}
          disabled={disabled}
          onChange={(event) => {
            const next = Number(event.target.value)
            if (Number.isFinite(next) && next > 0) onChange(next)
          }}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>
    </div>
  )
})
