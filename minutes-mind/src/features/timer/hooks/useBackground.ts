import { useState } from 'react'
import {
  BACKGROUND_PRESETS,
  DEFAULT_BACKGROUND_ID,
  type BackgroundPreset,
} from '../constants/backgrounds'

const LS_KEY = 'vilo-bg-id'

function getInitialBg(): BackgroundPreset {
  const savedId = localStorage.getItem(LS_KEY)
  const validPreset = BACKGROUND_PRESETS.find((p) => p.id === savedId)
  return (
    validPreset ??
    BACKGROUND_PRESETS.find((p) => p.id === DEFAULT_BACKGROUND_ID) ??
    BACKGROUND_PRESETS[0]
  )
}

export function useBackground() {
  const [currentBg, setCurrentBg] = useState<BackgroundPreset>(getInitialBg)

  const selectBackground = (id: string) => {
    const preset = BACKGROUND_PRESETS.find((p) => p.id === id)
    if (!preset) return
    setCurrentBg(preset)
    localStorage.setItem(LS_KEY, id)
  }

  return { currentBg, selectBackground }
}
