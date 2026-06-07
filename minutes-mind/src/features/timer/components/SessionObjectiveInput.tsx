import { useTimerStore } from '../store/useTimerStore'

const MAX_LENGTH = 200
const WARN_THRESHOLD = 180

/**
 * Optional objective input shown when the timer is IDLE.
 * Value persists across F5 via Zustand persist (mm_timer localStorage key).
 */
export function SessionObjectiveInput() {
  const sessionObjective = useTimerStore((s) => s.sessionObjective)
  const setSessionObjective = useTimerStore((s) => s.setSessionObjective)

  const length = sessionObjective?.length ?? 0
  const isNearLimit = length >= WARN_THRESHOLD

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 420,
        margin: '0 auto',
      }}
    >
      {/* Label row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          🎯 Today&apos;s objective
          <span
            style={{
              fontSize: 10,
              fontWeight: 400,
              textTransform: 'none',
              opacity: 0.6,
            }}
          >
            (Optional)
          </span>
        </span>

        {/* Character counter — only visible when typing */}
        {length > 0 && (
          <span
            style={{
              fontSize: 10,
              color: isNearLimit ? '#EF4444' : 'var(--color-text-muted)',
              transition: 'color 0.15s',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {length} / {MAX_LENGTH}
          </span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        value={sessionObjective ?? ''}
        onChange={(e) => {
          const val = e.target.value
          setSessionObjective(val === '' ? null : val)
        }}
        maxLength={MAX_LENGTH}
        rows={2}
        placeholder="e.g. Finish Chapter 3 of the React docs…"
        style={{
          width: '100%',
          resize: 'none',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${sessionObjective ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 12,
          padding: '10px 14px',
          fontSize: 13,
          color: 'var(--color-text-primary)',
          outline: 'none',
          lineHeight: 1.5,
          transition: 'border-color 0.15s, box-shadow 0.15s',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-brand)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.12)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = sessionObjective
            ? 'rgba(255,255,255,0.15)'
            : 'rgba(255,255,255,0.07)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}
