import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ---------------------------------------------------------------------------
// Theme — defined as a const object to be compatible with erasableSyntaxOnly.
// Use Theme.FOCUS_DARK, Theme.LIGHT_PRODUCTIVITY, Theme.DEEP_FOCUS everywhere.
// ---------------------------------------------------------------------------
export const Theme = {
  FOCUS_DARK:         'focus-dark',
  LIGHT_PRODUCTIVITY: 'light-productivity',
  DEEP_FOCUS:         'deep-focus',
} as const

export type Theme = typeof Theme[keyof typeof Theme]

/** Maps each Theme value to the CSS class applied on <html> */
export const THEME_CLASS_MAP: Record<Theme, string> = {
  [Theme.FOCUS_DARK]:         'theme-focus-dark',
  [Theme.LIGHT_PRODUCTIVITY]: 'theme-light-productivity',
  [Theme.DEEP_FOCUS]:         'theme-deep-focus',
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
interface ThemeStore {
  theme: Theme
  setTheme: (id: Theme) => void
}

/** Applies the correct CSS class to <html> and removes the old one */
function applyThemeClass(theme: Theme) {
  const html = document.documentElement
  // Remove all known theme classes first
  Object.values(THEME_CLASS_MAP).forEach((cls) => html.classList.remove(cls))
  // Apply the selected theme class
  html.classList.add(THEME_CLASS_MAP[theme])
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: Theme.FOCUS_DARK,

      setTheme: (id) => {
        applyThemeClass(id)
        set({ theme: id })
      },
    }),
    {
      name: 'mm_theme',
    },
  ),
)
