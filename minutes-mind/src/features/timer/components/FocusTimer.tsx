import { useEffect, useRef, useState } from 'react'
import { Clock, Image, Maximize2, Minimize2, Music } from 'lucide-react'

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
import { YoutubePlayer } from './YoutubePlayer'
import { ClockStylePicker } from './ClockStylePicker'
import type { ClockStyle } from './ClockStylePicker'
import { BackgroundPicker } from './BackgroundPicker'
import { useBackground } from '../hooks/useBackground'
import type { GoalResponse, TaskResponse } from '../../../types/api'


export function FocusTimer() {
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<GoalResponse | null>(null)
  const [mode, setMode] = useState<'WORK' | 'BREAK'>('WORK')
  const [duration, setDuration] = useState(25)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false)

  // UI states
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showYoutube, setShowYoutube] = useState(false)
  const [showClockPicker, setShowClockPicker] = useState(false)
  const [showBgPicker, setShowBgPicker] = useState(false)
  const [clockStyle, setClockStyle] = useState<ClockStyle>('ring')

  const { currentBg, selectBackground } = useBackground()

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

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

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
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{
        backgroundImage: `url('${currentBg.url}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
      }}
    >
      {/* Dark overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.38)', zIndex: 0 }}
      />

      {/* Top-right action buttons */}
      <div
        className="absolute flex items-center gap-2"
        style={{ top: 12, right: 16, zIndex: 20 }}
      >
        {/* Clock style picker toggle */}
        <button
          type="button"
          onClick={() => { setShowClockPicker((v) => !v); setShowYoutube(false); setShowBgPicker(false) }}
          title="Kiểu đồng hồ"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: showClockPicker ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: showClockPicker ? '#fff' : 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <Clock size={15} />
        </button>

        {/* Music toggle */}
        <button
          type="button"
          onClick={() => { setShowYoutube((v) => !v); setShowClockPicker(false); setShowBgPicker(false) }}
          title="Nhạc nền"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: showYoutube ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: showYoutube ? '#fff' : 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <Music size={15} />
        </button>

        {/* Background picker toggle */}
        <button
          type="button"
          onClick={() => {
            setShowBgPicker((v) => !v)
            setShowYoutube(false)
            setShowClockPicker(false)
          }}
          title="Ảnh nền"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: showBgPicker ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: showBgPicker ? '#fff' : 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <Image size={15} />
        </button>

        {/* Fullscreen toggle */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.20)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)' }}
        >
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      {/* ── Main content area: clock centred vertically ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4">
        {/* Timer circle */}
        <TimerDisplay
          timeRemaining={timeRemaining}
          totalSeconds={totalSeconds}
          state={state}
          taskTitle={taskTitle ?? selectedTask?.title ?? null}
          goalColor={goalColor ?? selectedGoal?.color ?? null}
          mode={mode}
          idleDuration={duration}
          clockStyle={clockStyle}
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
      <div className="relative z-10">
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
      </div>

      <SessionCompleteModal
        isOpen={showCompleteModal}
        taskTitle={taskTitle ?? selectedTask?.title ?? null}
        actualMinutes={actualMinutes}
        saving={completeSession.isPending}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={handleConfirmComplete}
      />

      {/* Floating YouTube Player */}
      <YoutubePlayer
        visible={showYoutube}
        onClose={() => setShowYoutube(false)}
      />

      {/* Clock Style Picker */}
      <ClockStylePicker
        visible={showClockPicker}
        currentStyle={clockStyle}
        onSelect={setClockStyle}
        onClose={() => setShowClockPicker(false)}
      />

      {/* Background Picker */}
      <BackgroundPicker
        visible={showBgPicker}
        currentId={currentBg.id}
        onSelect={(id) => { selectBackground(id) }}
        onClose={() => setShowBgPicker(false)}
      />
    </div>
  )
}
