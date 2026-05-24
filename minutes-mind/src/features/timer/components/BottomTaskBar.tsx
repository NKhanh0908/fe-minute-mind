import { ChevronDown, ClipboardList, X } from 'lucide-react'
import { memo, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import type { GoalResponse, TaskResponse } from '../../../types/api'
import { DurationPicker } from './DurationPicker'
import { TaskSelector } from './TaskSelector'

interface BottomTaskBarProps {
  goals: GoalResponse[]
  selectedGoal: GoalResponse | null
  selectedTask: TaskResponse | null
  duration: number
  mode: 'WORK' | 'BREAK'
  disabled: boolean
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onSelect: (task: TaskResponse | null, goal: GoalResponse | null) => void
  onDurationChange: (value: number) => void
  onModeChange: (mode: 'WORK' | 'BREAK') => void
}

export const BottomTaskBar = memo(function BottomTaskBar({
  goals,
  selectedGoal,
  selectedTask,
  duration,
  mode,
  disabled,
  isOpen,
  onToggle,
  onClose,
  onSelect,
  onDurationChange,
  onModeChange,
}: BottomTaskBarProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // ESC to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape' || e.key === 'Enter') onClose()
    },
    [isOpen, onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const taskLabel = selectedTask
    ? `${selectedGoal?.title ?? '...'} › ${selectedTask.title}`
    : 'Chọn công việc để bắt đầu'

  const modeLabel = mode === 'WORK' ? 'Làm việc' : 'Nghỉ ngơi'
  const modeColor = mode === 'WORK' ? '#6366f1' : '#10b981'

  return (
    <>
      {/* ── Floating card trigger ── */}
      <div className="flex justify-center pb-10 pt-2 px-4">
        <button
          type="button"
          id="task-bar-toggle"
          onClick={onToggle}
          className="group flex items-center gap-3 rounded-2xl px-5 py-3 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: 'rgba(26,26,46,0.85)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
            minWidth: '320px',
            maxWidth: '520px',
            width: '100%',
          }}
        >
          {/* Mode badge */}
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: `${modeColor}22`, color: modeColor, border: `1px solid ${modeColor}44` }}
          >
            {modeLabel}
          </span>

          {/* Divider */}
          <span className="h-4 w-px shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />

          {/* Task label */}
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <ClipboardList size={14} className="shrink-0" style={{ color: '#9ca3af' }} />
            <span
              className="truncate text-sm"
              style={{ color: selectedTask ? '#F4F4F5' : '#9ca3af' }}
            >
              {taskLabel}
            </span>
          </div>

          {/* Duration & chevron */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>
              {selectedTask ? `${duration} min` : '--'}
            </span>
            <ChevronDown
              size={14}
              className="transition-transform duration-200"
              style={{
                color: '#9ca3af',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </div>
        </button>
      </div>

      {/* ── Modal portal ── */}
      {createPortal(
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{
            backgroundColor: isOpen ? 'rgba(0,0,0,0.50)' : 'rgba(0,0,0,0)',
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: 'background-color 0.2s ease',
          }}
          onClick={handleBackdropClick}
        >
          {/* Dialog panel */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Chọn công việc"
            className="relative w-full max-w-lg rounded-3xl"
            style={{
              background: 'linear-gradient(160deg, #1a1a2e 0%, #16162a 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              // borderBottom: 'none',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
              transform: isOpen ? 'translateY(-10%)' : 'translateY(100%)',
              transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
              maxHeight: '90vh',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <h3 className="text-sm font-semibold" style={{ color: '#F4F4F5' }}>
                Cấu hình phiên làm việc
              </h3>
              <button
                type="button"
                id="task-modal-close"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                aria-label="Đóng"
              >
                <X size={14} style={{ color: '#9ca3af' }} />
              </button>
            </div>

            {/* Mode toggle inside modal */}
            <div className="px-5 pb-3">
              <div
                className="flex overflow-hidden rounded-full p-1"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <button
                  type="button"
                  id="modal-mode-work"
                  onClick={() => {
                    if (!disabled) onModeChange('WORK')
                  }}
                  disabled={disabled}
                  className={`flex-1 rounded-full py-2 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                    mode === 'WORK' ? 'text-white' : 'text-[#9ca3af] hover:text-white'
                  }`}
                  style={
                    mode === 'WORK'
                      ? {
                          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                          boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                        }
                      : {}
                  }
                >
                  🎯 Làm việc
                </button>
                <button
                  type="button"
                  id="modal-mode-break"
                  onClick={() => {
                    if (!disabled) onModeChange('BREAK')
                  }}
                  disabled={disabled}
                  className={`flex-1 rounded-full py-2 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                    mode === 'BREAK' ? 'text-white' : 'text-[#9ca3af] hover:text-white'
                  }`}
                  style={
                    mode === 'BREAK'
                      ? {
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          boxShadow: '0 2px 8px rgba(16,185,129,0.4)',
                        }
                      : {}
                  }
                >
                  ☕ Nghỉ ngơi
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 mb-4" style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />

            {/* Content */}
            <div className="space-y-4 px-5 pb-6">
              <TaskSelector
                goals={goals}
                selectedTask={selectedTask}
                disabled={disabled}
                onSelect={onSelect}
              />
              <DurationPicker
                value={duration}
                mode={mode}
                onModeChange={(m) => {
                  if (!disabled) onModeChange(m)
                }}
                onChange={onDurationChange}
                disabled={disabled}
              />
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
})
