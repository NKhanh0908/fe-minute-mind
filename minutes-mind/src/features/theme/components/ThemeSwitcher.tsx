import { Moon, Sun, Focus } from 'lucide-react'
import { useState } from 'react'

import { Theme, useThemeStore } from '../store/useThemeStore'

interface ThemeOption {
  id: Theme
  label: string
  description: string
  icon: React.ReactNode
  preview: { bg: string; surface: string; brand: string }
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: Theme.FOCUS_DARK,
    label: 'Focus Dark',
    description: 'Học tập ban đêm',
    icon: <Moon size={14} />,
    preview: { bg: '#0F172A', surface: '#1E293B', brand: '#38BDF8' },
  },
  {
    id: Theme.LIGHT_PRODUCTIVITY,
    label: 'Light',
    description: 'Văn phòng ban ngày',
    icon: <Sun size={14} />,
    preview: { bg: '#F8FAFC', surface: '#FFFFFF', brand: '#3B82F6' },
  },
  {
    id: Theme.DEEP_FOCUS,
    label: 'Deep Focus',
    description: 'Tập trung tối đa',
    icon: <Focus size={14} />,
    preview: { bg: '#050507', surface: '#0D0D10', brand: '#38BDF8' },
  },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-t border-border">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-xs text-text-muted transition-colors hover:text-text-primary"
      >
        <span className="flex items-center gap-2 font-medium uppercase tracking-wider">
          <span className="opacity-60">⚙</span>
          Theme
        </span>
        <span
          className="transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </button>

      {/* Theme options */}
      {isOpen && (
        <div className="flex flex-col gap-1 px-2 pb-2">
          {THEME_OPTIONS.map((opt) => {
            const isActive = theme === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-brand/10 text-brand border border-brand/20'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface-2 border border-transparent'
                }`}
              >
                {/* Mini color preview */}
                <span
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
                  style={{ background: opt.preview.brand }}
                >
                  {opt.icon}
                </span>

                <span className="flex flex-col">
                  <span className="text-xs font-semibold leading-tight">
                    {opt.label}
                  </span>
                  <span
                    className={`text-[10px] leading-tight ${isActive ? 'text-brand/70' : 'text-text-muted'}`}
                  >
                    {opt.description}
                  </span>
                </span>

                {/* Active dot */}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
