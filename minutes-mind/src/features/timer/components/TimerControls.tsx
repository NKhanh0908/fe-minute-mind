import { Pause, Play, RotateCcw, SkipForward, Square } from 'lucide-react'

import type { TimerState } from '../../../types/api'

interface TimerControlsProps {
  state: TimerState
  onStart?: () => void
  onPause: () => void
  onResume: () => void
  onComplete: () => void
  onDiscard?: () => void
  startDisabled?: boolean
}

const LABELS = {
  start: 'Bắt đầu',
  pause: 'Tạm dừng',
  resume: 'Tiếp tục',
  complete: 'Hoàn thành',
  discard: 'Huỷ phiên',
  reset: 'Đặt lại',
  skip: 'Bỏ qua',
} as const

// Small circular icon button
function IconBtn({
  id,
  icon,
  label,
  onClick,
  danger = false,
  disabled = false,
}: {
  id: string
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      id={id}
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? 'bg-[rgba(239,68,68,0.12)] text-[#ef4444] hover:bg-[rgba(239,68,68,0.22)]'
          : 'bg-[rgba(255,255,255,0.06)] text-[#9ca3af] hover:bg-[rgba(255,255,255,0.12)] hover:text-white'
      }`}
    >
      {icon}
    </button>
  )
}

export function TimerControls({
  state,
  onStart,
  onPause,
  onResume,
  onComplete,
  onDiscard,
  startDisabled = false,
}: TimerControlsProps) {
  const isIdle = state === 'IDLE'
  const isRunning = state === 'RUNNING' || state === 'BREAK'
  const isPaused = state === 'PAUSED'

  // Primary action button (big pill)
  const primaryBtn = isIdle ? (
    <button
      type="button"
      id="timer-start-btn"
      onClick={onStart}
      disabled={startDisabled || !onStart}
      className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
      }}
    >
      <Play size={18} fill="white" />
      {LABELS.start}
    </button>
  ) : isRunning ? (
    <button
      type="button"
      id="timer-pause-btn"
      onClick={onPause}
      className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-base font-semibold text-white transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      <Pause size={18} />
      {LABELS.pause}
    </button>
  ) : (
    // PAUSED state
    <button
      type="button"
      id="timer-resume-btn"
      onClick={onResume}
      className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-base font-semibold text-white transition-all duration-200"
      style={{
        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
      }}
    >
      <Play size={18} fill="white" />
      {LABELS.resume}
    </button>
  )

  return (
    <div className="flex items-center gap-4">
      {/* Reset icon — left side */}
      <IconBtn
        id="timer-reset-btn"
        icon={<RotateCcw size={18} />}
        label={LABELS.reset}
        onClick={onDiscard ?? onComplete}
        danger={!!onDiscard}
        disabled={isIdle}
      />

      {/* Primary action */}
      {primaryBtn}

      {/* Skip / Complete icon — right side */}
      <IconBtn
        id="timer-skip-btn"
        icon={<SkipForward size={18} />}
        label={isPaused || isRunning ? LABELS.complete : LABELS.skip}
        onClick={onComplete}
        disabled={isIdle}
      />

      {/* Complete button hidden from layout but kept as accessible — shown via skip btn above */}
      <button
        type="button"
        id="timer-complete-btn"
        onClick={onComplete}
        aria-hidden
        className="hidden"
      >
        <Square size={16} />
        {LABELS.complete}
      </button>
    </div>
  )
}
