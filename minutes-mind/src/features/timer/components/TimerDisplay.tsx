import { formatMMSS } from '../../../utils/formatTime'
import type { TimerState } from '../../../types/api'
import type { ClockStyle } from './ClockStylePicker'

interface TimerDisplayProps {
  timeRemaining: number
  totalSeconds: number
  state: TimerState
  taskTitle: string | null
  goalColor: string | null
  mode?: 'WORK' | 'BREAK'
  /** Duration user selected (minutes) — used to display correct time when IDLE */
  idleDuration?: number
  clockStyle?: ClockStyle
}

const STATE_LABEL: Record<TimerState, string> = {
  IDLE:    'SẴN SÀNG',
  RUNNING: 'ĐANG CHẠY',
  PAUSED:  'TẠM DỪNG',
  BREAK:   'NGHỈ NGƠI',
}

// ── Shared helpers ──────────────────────────────────────────
function useDisplaySeconds(
  state: TimerState,
  timeRemaining: number,
  idleDuration: number,
) {
  // When IDLE, show the user-selected duration instead of stale store value
  return state === 'IDLE' ? idleDuration * 60 : timeRemaining
}

// ── Style: RING (classic SVG) ────────────────────────────────
function RingClock({
  displaySeconds,
  totalSeconds,
  state,
  accent,
}: {
  displaySeconds: number
  totalSeconds: number
  state: TimerState
  accent: string
}) {
  const safeTotal = Math.max(state === 'IDLE' ? displaySeconds : totalSeconds, 1)
  const progress = state === 'IDLE' ? 0 : Math.min(1, Math.max(0, 1 - displaySeconds / safeTotal))

  const size = 380
  const radius = 165
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  return (
    <div
      className="relative"
      style={{
        width: 'clamp(240px, 42vw, 380px)',
        height: 'clamp(240px, 42vw, 380px)',
        borderRadius: '50%',
        backdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${accent}44`,
        boxShadow: `0 0 0 1px ${accent}22, 0 0 48px ${accent}22`,
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
      }}
    >
      <svg
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Track: tinted with accent */}
        <circle cx={cx} cy={cy} r={radius} stroke={`${accent}30`} strokeWidth="10" fill="none" />
        {/* Progress arc */}
        <circle
          cx={cx} cy={cy} r={radius}
          stroke={accent} strokeWidth="10" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s linear, stroke 0.5s ease', filter: `drop-shadow(0 0 12px ${accent}cc)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="font-mono font-bold leading-none" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          {formatMMSS(displaySeconds)}
        </span>
        <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: accent, transition: 'color 0.5s ease', textShadow: `0 0 12px ${accent}99` }}>
          {STATE_LABEL[state]}
        </span>
      </div>
    </div>
  )
}

// ── Style: MINIMAL (text only) ───────────────────────────────
function MinimalClock({
  displaySeconds,
  state,
  accent,
}: {
  displaySeconds: number
  state: TimerState
  accent: string
}) {
  return (
    <div
      className="flex flex-col items-center gap-3"
      style={{
        backdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${accent}44`,
        borderRadius: 24,
        padding: 'clamp(24px, 4vw, 48px) clamp(32px, 6vw, 80px)',
        boxShadow: `0 0 32px ${accent}22`,
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
      }}
    >
      <span
        className="font-mono font-bold leading-none"
        style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)', color: '#FFFFFF', letterSpacing: '-0.04em' }}
      >
        {formatMMSS(displaySeconds)}
      </span>
      {/* Accent thin line */}
      <div style={{ width: 40, height: 2, borderRadius: 2, background: accent, transition: 'background 0.5s', boxShadow: `0 0 8px ${accent}99` }} />
      <span className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: accent, transition: 'color 0.5s', textShadow: `0 0 10px ${accent}88` }}>
        {STATE_LABEL[state]}
      </span>
    </div>
  )
}

// ── Style: FLIP (card digit) ─────────────────────────────────
function FlipDigit({ char }: { char: string }) {
  return (
    <div
      style={{
        width: 'clamp(44px, 7vw, 80px)',
        height: 'clamp(60px, 9vw, 108px)',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.10)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Horizontal split line */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(0,0,0,0.35)' }} />
      <span
        className="font-mono font-bold"
        style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1 }}
      >
        {char}
      </span>
    </div>
  )
}

function FlipClock({
  displaySeconds,
  state,
  accent,
}: {
  displaySeconds: number
  state: TimerState
  accent: string
}) {
  const formatted = formatMMSS(displaySeconds) // "MM:SS"
  const [m1, m2, , s1, s2] = formatted.split('')

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="flex items-center gap-2"
        style={{
          filter: `drop-shadow(0 0 16px ${accent}55)`,
          transition: 'filter 0.5s ease',
        }}
      >
        <FlipDigit char={m1} />
        <FlipDigit char={m2} />
        <span className="font-mono font-bold" style={{ color: `${accent}cc`, fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', marginBottom: 4, transition: 'color 0.5s' }}>:</span>
        <FlipDigit char={s1} />
        <FlipDigit char={s2} />
      </div>
      <span className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: accent, transition: 'color 0.5s', textShadow: `0 0 10px ${accent}88` }}>
        {STATE_LABEL[state]}
      </span>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────
export function TimerDisplay({
  timeRemaining,
  totalSeconds,
  state,
  taskTitle,
  goalColor,
  mode,
  idleDuration = 25,
  clockStyle = 'ring',
}: TimerDisplayProps) {
  const isBreakMode = state === 'BREAK' || mode === 'BREAK'
  const accent = goalColor ?? (isBreakMode ? '#10b981' : '#6366F1')
  const displaySeconds = useDisplaySeconds(state, timeRemaining, idleDuration)

  return (
    <div className="flex flex-col items-center gap-4">
      {clockStyle === 'ring' && (
        <RingClock
          displaySeconds={displaySeconds}
          totalSeconds={totalSeconds}
          state={state}
          accent={accent}
        />
      )}
      {clockStyle === 'minimal' && (
        <MinimalClock
          displaySeconds={displaySeconds}
          state={state}
          accent={accent}
        />
      )}
      {clockStyle === 'flip' && (
        <FlipClock
          displaySeconds={displaySeconds}
          state={state}
          accent={accent}
        />
      )}

      {/* Task title below clock */}
      {taskTitle ? (
        <p className="max-w-xs truncate text-center text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {taskTitle}
        </p>
      ) : null}
    </div>
  )
}
