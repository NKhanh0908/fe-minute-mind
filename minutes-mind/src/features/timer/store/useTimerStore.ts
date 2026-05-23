import { create } from 'zustand'

import type { ActiveSessionResponse, SessionType, TimerState } from '../../../types/api'

interface TimerStore {
  state: TimerState
  sessionId: number | null
  taskId: number | null
  taskTitle: string | null
  goalColor: string | null
  sessionType: SessionType
  plannedMinutes: number
  totalSeconds: number
  timeRemaining: number
  actualMinutes: number
  endTime: number | null
  startedAt: number | null

  setSessionMeta: (meta: { taskTitle: string | null; goalColor: string | null }) => void
  startSession: (
    response: ActiveSessionResponse,
    meta: { taskTitle: string | null; goalColor: string | null },
  ) => void
  pauseTimer: () => void
  resumeTimer: () => void
  tick: () => void
  reset: () => void
  hydrateFromActive: (
    response: ActiveSessionResponse,
    meta: { taskTitle: string | null; goalColor: string | null },
  ) => void
  startLocalBreakSession: (minutes: number) => void
}

const initialState: Omit<
  TimerStore,
  | 'setSessionMeta'
  | 'startSession'
  | 'pauseTimer'
  | 'resumeTimer'
  | 'tick'
  | 'reset'
  | 'hydrateFromActive'
  | 'startLocalBreakSession'
> = {
  state: 'IDLE',
  sessionId: null,
  taskId: null,
  taskTitle: null,
  goalColor: null,
  sessionType: 'WORK',
  plannedMinutes: 25,
  totalSeconds: 25 * 60,
  timeRemaining: 25 * 60,
  actualMinutes: 0,
  endTime: null,
  startedAt: null,
}

const computeRemaining = (endTime: number | null): number => {
  if (!endTime) return 0
  return Math.max(0, Math.round((endTime - Date.now()) / 1000))
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  ...initialState,

  setSessionMeta: ({ taskTitle, goalColor }) => set({ taskTitle, goalColor }),

  startSession: (response, meta) => {
    const totalSeconds = response.plannedMinutes * 60
    const startedAtMs = new Date(response.startedAt).getTime()
    const endTime = startedAtMs + totalSeconds * 1000

    set({
      state: response.sessionType === 'BREAK' ? 'BREAK' : 'RUNNING',
      sessionId: response.sessionId,
      taskId: response.taskId,
      taskTitle: meta.taskTitle,
      goalColor: meta.goalColor,
      sessionType: response.sessionType,
      plannedMinutes: response.plannedMinutes,
      totalSeconds,
      timeRemaining: computeRemaining(endTime),
      actualMinutes: 0,
      endTime,
      startedAt: startedAtMs,
    })
  },

  pauseTimer: () => {
    const { state, endTime } = get()
    if (state !== 'RUNNING' && state !== 'BREAK') return
    if (!endTime) return
    set({
      state: 'PAUSED',
      timeRemaining: computeRemaining(endTime),
      endTime: null,
    })
  },

  resumeTimer: () => {
    const { state, timeRemaining, sessionType } = get()
    if (state !== 'PAUSED') return
    set({
      state: sessionType === 'BREAK' ? 'BREAK' : 'RUNNING',
      endTime: Date.now() + timeRemaining * 1000,
    })
  },

  tick: () => {
    const { state, endTime, startedAt, totalSeconds } = get()
    if (!endTime || (state !== 'RUNNING' && state !== 'BREAK')) return

    const timeRemaining = computeRemaining(endTime)
    const elapsedSeconds = Math.max(0, totalSeconds - timeRemaining)
    const computedActual = timeRemaining === 0
      ? Math.floor(totalSeconds / 60)
      : startedAt
        ? Math.max(Math.floor(elapsedSeconds / 60), Math.floor((Date.now() - startedAt) / 60000))
        : Math.floor(elapsedSeconds / 60)

    set({ timeRemaining, actualMinutes: computedActual })
  },

  reset: () => set({ ...initialState }),

  hydrateFromActive: (response, meta) => {
    const totalSeconds = response.plannedMinutes * 60
    const startedAtMs = new Date(response.startedAt).getTime()
    const endTime = startedAtMs + totalSeconds * 1000
    const timeRemaining = computeRemaining(endTime)
    const elapsedSeconds = Math.max(0, totalSeconds - timeRemaining)

    set({
      state: response.sessionType === 'BREAK' ? 'BREAK' : 'RUNNING',
      sessionId: response.sessionId,
      taskId: response.taskId,
      taskTitle: meta.taskTitle,
      goalColor: meta.goalColor,
      sessionType: response.sessionType,
      plannedMinutes: response.plannedMinutes,
      totalSeconds,
      timeRemaining,
      actualMinutes: Math.floor(elapsedSeconds / 60),
      endTime,
      startedAt: startedAtMs,
    })
  },

  startLocalBreakSession: (minutes) => {
    const totalSeconds = minutes * 60
    const startedAtMs = Date.now()
    const endTime = startedAtMs + totalSeconds * 1000

    set({
      state: 'BREAK',
      sessionId: null,
      taskId: null,
      taskTitle: 'Th\u1eddi gian ngh\u1ec9 (Break)',
      goalColor: '#22C55E',
      sessionType: 'BREAK',
      plannedMinutes: minutes,
      totalSeconds,
      timeRemaining: totalSeconds,
      actualMinutes: 0,
      endTime,
      startedAt: startedAtMs,
    })
  },
}))
