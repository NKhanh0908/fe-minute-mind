import { useCallback } from 'react'

const STORAGE_KEY = 'mm_session_history'
const MAX_HISTORY = 200

export interface SessionRecord {
  sessionId: number | null
  date: string            // ISO date string (new Date().toISOString())
  taskTitle: string | null
  objective: string | null
  result: string | null
  actualMinutes: number
}

function loadHistory(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SessionRecord[]
  } catch {
    return []
  }
}

function saveHistory(records: SessionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch {
    // Silently fail if storage quota exceeded
  }
}

/**
 * Hook that appends a completed session to localStorage history.
 *
 * Max 200 records (newest first). Old records are automatically pruned.
 * Access history later via localStorage key 'mm_session_history'.
 */
export function useSessionHistory() {
  const addRecord = useCallback((record: Omit<SessionRecord, 'date'>) => {
    const history = loadHistory()

    const newRecord: SessionRecord = {
      ...record,
      date: new Date().toISOString(),
    }

    // Prepend newest first, then cap at MAX_HISTORY
    const updated = [newRecord, ...history].slice(0, MAX_HISTORY)
    saveHistory(updated)
  }, [])

  return { addRecord }
}
