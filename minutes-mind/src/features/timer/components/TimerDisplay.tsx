import { formatMMSS } from '../../../utils/formatTime'
import type { TimerState } from '../../../types/api'

interface TimerDisplayProps {
  timeRemaining: number
  totalSeconds: number
  state: TimerState
  taskTitle: string | null
  goalColor: string | null
  mode?: 'WORK' | 'BREAK'
}

const STATE_LABEL: Record<TimerState, string> = {
  IDLE: 'SẴN SÀNG',
  RUNNING: 'ĐANG CHẠY',
  PAUSED: 'TẠM DỪNG',
  BREAK: 'NGHỈ NGƠI',
}

export function TimerDisplay({
  timeRemaining,
  totalSeconds,
  state,
  taskTitle,
  goalColor,
  mode,
}: TimerDisplayProps) {
  const isBreakMode = state === 'BREAK' || mode === 'BREAK'
  const accent = goalColor ?? (isBreakMode ? '#10b981' : '#6366F1')

  const safeTotal = Math.max(totalSeconds, 1)
  const progress = Math.min(1, Math.max(0, 1 - timeRemaining / safeTotal))

  // Larger circle: 380px container, radius 170
  const size = 380
  const radius = 165
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="-rotate-90"
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
        >
          {/* Background ring */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
            fill="none"
          />
          {/* Subtle glow ring behind progress */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={accent}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.4s linear, stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${accent}88)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span
            className="font-mono font-bold leading-none text-[#F4F4F5]"
            style={{ fontSize: '4.5rem', letterSpacing: '-0.02em' }}
          >
            {formatMMSS(timeRemaining)}
          </span>
          <span
            className="text-xs font-medium tracking-[0.2em] uppercase"
            style={{ color: accent, transition: 'color 0.5s ease' }}
          >
            {STATE_LABEL[state]}
          </span>
        </div>
      </div>

      {/* Task title below circle */}
      {taskTitle ? (
        <p
          className="max-w-xs truncate text-center text-sm"
          style={{ color: '#9ca3af' }}
        >
          {taskTitle}
        </p>
      ) : null}
    </div>
  )
}
