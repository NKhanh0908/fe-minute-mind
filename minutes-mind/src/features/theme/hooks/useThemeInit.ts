import { useEffect } from 'react'

import { THEME_CLASS_MAP, useThemeStore } from '../store/useThemeStore'

/**
 * Reads the persisted theme from the store and applies the correct CSS class
 * to <html> on app mount.
 *
 * Call once at the top of AppBootstrap so the theme is active before first render.
 */
export function useThemeInit() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    const html = document.documentElement
    // Clear any stale theme classes then apply the current one
    Object.values(THEME_CLASS_MAP).forEach((cls) => html.classList.remove(cls))
    html.classList.add(THEME_CLASS_MAP[theme])
  }, [theme])
}
