import { useMutation } from '@tanstack/react-query'

import { sessionService } from '../../../services/sessionService'
import type { SessionStartRequest } from '../../../types/api'
import { useTimerStore } from '../store/useTimerStore'

interface StartArgs {
  payload: SessionStartRequest
  meta: { taskTitle: string | null; goalColor: string | null }
}

export function useStartSession() {
  const startSession = useTimerStore((s) => s.startSession)

  return useMutation({
    mutationFn: ({ payload }: StartArgs) => sessionService.start(payload),
    onSuccess: (response, variables) => {
      startSession(response, variables.meta)
    },
  })
}
