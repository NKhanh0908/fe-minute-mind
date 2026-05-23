import { useEffect } from 'react'

import { useTimerStore } from '../store/useTimerStore'

export function useTimerTick() {
  const state = useTimerStore((s) => s.state)
  const tick = useTimerStore((s) => s.tick)
  const timeRemaining = useTimerStore((s) => s.timeRemaining)

  useEffect(() => {
    if (state !== 'RUNNING' && state !== 'BREAK') return

    const interval = window.setInterval(() => {
      tick()
    }, 1000)

    tick()

    return () => window.clearInterval(interval)
  }, [state, tick])

  const isComplete = (state === 'RUNNING' || state === 'BREAK') && timeRemaining <= 0
  return { isComplete }
}
