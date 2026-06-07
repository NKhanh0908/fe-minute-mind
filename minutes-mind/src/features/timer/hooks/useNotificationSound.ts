import { useCallback, useEffect, useRef } from 'react'

import type { SoundConfig } from '../constants/sounds'

/**
 * Returns a `play` function that:
 * 1. Stops any currently-playing audio (prevents overlap).
 * 2. Plays the audio specified by the given `SoundConfig`.
 * 3. Auto-stops after `config.maxDurationMs` milliseconds.
 *
 * Designed so that swapping audio files or changing duration only requires
 * updating the `SoundConfig` object — no logic changes needed here.
 */
export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /** Immediately stop & clean up any active playback */
  const stopCurrent = useCallback(() => {
    if (stopTimerRef.current !== null) {
      clearTimeout(stopTimerRef.current)
      stopTimerRef.current = null
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }, [])

  /**
   * Play a notification sound defined by `config`.
   * Any previously-playing sound is stopped first.
   */
  const play = useCallback(
    (config: SoundConfig) => {
      stopCurrent()

      const audio = new Audio(config.src)
      audio.volume = Math.min(1, Math.max(0, config.volume))
      audioRef.current = audio

      audio.play().catch(() => {
        // Browser may block autoplay — silently ignore
        audioRef.current = null
      })

      // Schedule auto-stop if a finite maxDuration is provided
      if (Number.isFinite(config.maxDurationMs)) {
        stopTimerRef.current = setTimeout(() => {
          stopCurrent()
        }, config.maxDurationMs)
      }
    },
    [stopCurrent],
  )

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCurrent()
    }
  }, [stopCurrent])

  return { play, stop: stopCurrent }
}
