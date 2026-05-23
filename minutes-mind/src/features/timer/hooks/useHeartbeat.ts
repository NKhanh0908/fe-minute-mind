import { useEffect, useRef } from 'react'

import { sessionService } from '../../../services/sessionService'
import { useTimerStore } from '../store/useTimerStore'

const HEARTBEAT_INTERVAL_MS = 30_000

export function useHeartbeat() {
  const sessionId = useTimerStore((s) => s.sessionId)
  const state = useTimerStore((s) => s.state)
  const lastSentRef = useRef<number>(-1)

  useEffect(() => {
    if (sessionId === null) return
    if (state !== 'RUNNING' && state !== 'BREAK') return

    const sendHeartbeat = () => {
      const minutes = useTimerStore.getState().actualMinutes
      if (minutes <= 0) return
      if (minutes === lastSentRef.current) return
      lastSentRef.current = minutes
      sessionService.heartbeat(sessionId, minutes).catch(() => undefined)
    }

    const interval = window.setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [sessionId, state])
}
