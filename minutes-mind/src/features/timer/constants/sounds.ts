/**
 * Notification sound configuration for timer sessions.
 *
 * To change a sound file in the future, update the `src` path here.
 * The `maxDurationMs` controls how long the sound plays before being
 * auto-stopped — no changes to hook logic are needed.
 */

export interface SoundConfig {
  /** Path to the audio asset (relative to the public root or import) */
  src: string
  /**
   * Maximum playback duration in milliseconds.
   * The audio is force-stopped after this duration to avoid long interruptions.
   * Set to Infinity to play the full file.
   */
  maxDurationMs: number
  /** Volume level (0.0 – 1.0) */
  volume: number
}

// ---------------------------------------------------------------------------
// Sound assets (imported so Vite handles the asset hashing / bundling)
// ---------------------------------------------------------------------------
import focusEndSfx from '../../../assets/sound/mixkit-bell-tick-tock-timer-1046.wav'

/** Played when a Focus session completes (Focus → Break transition) */
export const FOCUS_END_SOUND: SoundConfig = {
  src: focusEndSfx,
  maxDurationMs: 3500, // play for ~3.5 s then stop
  volume: 0.75,
}

/** Played when a Break session completes (Break → Focus transition) */
export const BREAK_END_SOUND: SoundConfig = {
  src: focusEndSfx,   // reuse the same file; swap to a different import if needed
  maxDurationMs: 2500, // shorter cue for break-end
  volume: 0.6,
}
