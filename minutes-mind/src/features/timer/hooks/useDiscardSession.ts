import { useMutation } from '@tanstack/react-query'

import { sessionService } from '../../../services/sessionService'
import { useTimerStore } from '../store/useTimerStore'

export function useDiscardSession() {
  const reset = useTimerStore((s) => s.reset)

  return useMutation({
    mutationFn: (sessionId: number) => sessionService.discard(sessionId),
    onSuccess: () => {
      reset()
    },
    onError: () => {
      reset()
    },
  })
}
