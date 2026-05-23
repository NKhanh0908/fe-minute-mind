import { useEffect, useRef, useState } from 'react'

import { useGoals } from '../../goals/hooks/useGoals'
import { useBeforeUnload } from '../hooks/useBeforeUnload'
import { useCompleteSession } from '../hooks/useCompleteSession'
import { useDiscardSession } from '../hooks/useDiscardSession'
import { useHeartbeat } from '../hooks/useHeartbeat'
import { useStartSession } from '../hooks/useStartSession'
import { useTimerTick } from '../hooks/useTimerTick'
import { useTimerStore } from '../store/useTimerStore'
import { BottomTaskBar } from './BottomTaskBar'
import { SessionCompleteModal } from './SessionCompleteModal'
import { TimerControls } from './TimerControls'
import { TimerDisplay } from './TimerDisplay'
import type { GoalResponse, TaskResponse } from '../../../types/api'

export function FocusTimer() {
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<GoalResponse | null>(null)
  const [mode, setMode] = useState<'WORK' | 'BREAK'>('WORK')
  const [duration, setDuration] = useState(25)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false)
  const completeModalShown = useRef(false)

  const { data: goals = [] } = useGoals()

  const state = useTimerStore((s) => s.state)
  const sessionId = useTimerStore((s) => s.sessionId)
  const taskTitle = useTimerStore((s) => s.taskTitle)
  const goalColor = useTimerStore((s) => s.goalColor)
  const timeRemaining = useTimerStore((s) => s.timeRemaining)
  const totalSeconds = useTimerStore((s) => s.totalSeconds)
  const actualMinutes = useTimerStore((s) => s.actualMinutes)
  const pauseTimer = useTimerStore((s) => s.pauseTimer)
  const resumeTimer = useTimerStore((s) => s.resumeTimer)
  const startLocalBreakSession = useTimerStore((s) => s.startLocalBreakSession)
  const resetTimer = useTimerStore((s) => s.reset)

  const startSession = useStartSession()
  const completeSession = useCompleteSession()
  const discardSession = useDiscardSession()
  const { isComplete } = useTimerTick()

  useHeartbeat()
  useBeforeUnload()

  useEffect(() => {
    if (isComplete && !completeModalShown.current) {
      if (!sessionId) {
        completeModalShown.current = false
        resetTimer()
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMode('WORK')
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDuration(25)
      } else {
        completeModalShown.current = true
        setShowCompleteModal(true)
      }
    } else if (!isComplete && state === 'IDLE') {
      completeModalShown.current = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, state, sessionId])

  const isActive = state !== 'IDLE'
  const goalIdForActive = goals.find((g) => g.title === taskTitle)?.id ?? selectedGoal?.id ?? null

  const handleStart = () => {
    if (mode === 'BREAK') {
      startLocalBreakSession(duration)
      return
    }
    if (!selectedTask) return
    startSession.mutate({
      payload: {
        taskId: selectedTask.id,
        sessionType: 'WORK',
        plannedMinutes: duration,
      },
      meta: {
        taskTitle: selectedTask.title,
        goalColor: selectedGoal?.color ?? null,
      },
    })
  }

  const handleConfirmComplete = (input: {
    actualMinutes: number
    completedTask: boolean
    notes: string | null
  }) => {
    if (!sessionId) {
      setShowCompleteModal(false)
      completeModalShown.current = false
      resetTimer()
      setMode('WORK')
      setDuration(25)
      return
    }
    completeSession.mutate(
      {
        sessionId,
        body: {
          actualMinutes: Math.max(input.actualMinutes, Math.max(actualMinutes, 1)),
          completedTask: input.completedTask,
          notes: input.notes,
        },
        goalId: goalIdForActive,
      },
      {
        onSettled: () => {
          setShowCompleteModal(false)
          completeModalShown.current = false
          setMode('BREAK')
          setDuration(5)
        },
      },
    )
  }

  const handleManualComplete = () => {
    if (!sessionId) {
      completeModalShown.current = false
      resetTimer()
      setMode('WORK')
      setDuration(25)
      return
    }
    setShowCompleteModal(true)
  }

  const handleDiscard = () => {
    if (!sessionId) {
      setShowCompleteModal(false)
      completeModalShown.current = false
      resetTimer()
      return
    }
    discardSession.mutate(sessionId, {
      onSettled: () => {
        setShowCompleteModal(false)
        completeModalShown.current = false
      },
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Main content area: clock centred vertically ── */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
        {/* Timer circle */}
        <TimerDisplay
          timeRemaining={timeRemaining}
          totalSeconds={totalSeconds}
          state={state}
          taskTitle={taskTitle ?? selectedTask?.title ?? null}
          goalColor={goalColor ?? selectedGoal?.color ?? null}
          mode={mode}
        />

        {/* Controls row: [↺]  [▶ Bắt đầu]  [⏭] */}
        <TimerControls
          state={state}
          startDisabled={(!selectedTask && mode === 'WORK') || startSession.isPending}
          onStart={handleStart}
          onPause={pauseTimer}
          onResume={resumeTimer}
          onComplete={handleManualComplete}
          onDiscard={isActive && mode === 'WORK' ? handleDiscard : undefined}
        />
      </div>

      {/* ── Floating bottom card + modal ── */}
      <BottomTaskBar
        goals={goals}
        selectedGoal={selectedGoal}
        selectedTask={selectedTask}
        duration={duration}
        mode={mode}
        disabled={isActive}
        isOpen={isTaskPanelOpen}
        onToggle={() => setIsTaskPanelOpen((prev) => !prev)}
        onClose={() => setIsTaskPanelOpen(false)}
        onSelect={(task, goal) => {
          setSelectedTask(task)
          setSelectedGoal(goal)
        }}
        onDurationChange={setDuration}
        onModeChange={(newMode) => {
          setMode(newMode)
          setDuration(newMode === 'WORK' ? 25 : 5)
        }}
      />

      <SessionCompleteModal
        isOpen={showCompleteModal}
        taskTitle={taskTitle ?? selectedTask?.title ?? null}
        actualMinutes={actualMinutes}
        saving={completeSession.isPending}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={handleConfirmComplete}
      />
    </div>
  )
}
