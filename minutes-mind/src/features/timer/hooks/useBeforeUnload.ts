import { useEffect } from 'react'

import { useTimerStore } from '../store/useTimerStore'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

export function useBeforeUnload() {
  useEffect(() => {
    const handler = () => {
      const { sessionId, state, actualMinutes } = useTimerStore.getState()
      if (!sessionId) return
      if (state !== 'RUNNING' && state !== 'BREAK') return
      if (actualMinutes <= 0) return

      const url = `${API_BASE_URL}/sessions/${sessionId}/heartbeat?currentActualMinutes=${actualMinutes}`
      try {
        navigator.sendBeacon(url)
      } catch {
        // best-effort only; ignore beacon errors
      }
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])
}
