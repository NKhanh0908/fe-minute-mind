import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

const FEATURES = [
  'Pomodoro timer với vòng tròn trực quan',
  'Quản lý goals và tasks cá nhân',
  'Theo dõi streak và tiến độ học tập',
] as const

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* ── LEFT: Branding panel (hidden on mobile) ── */}
      <aside
        className="hidden md:flex md:w-[45%] flex-col items-center justify-between py-12 px-12"
        style={{
          background:
            'linear-gradient(135deg, #0d0d14 0%, #12101e 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial glow overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 60% at 100% 0%, rgba(99,102,241,0.12) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo + tagline + features */}
        <div className="relative flex flex-col items-center gap-8 w-full">
          {/* Logo block */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>V</span>
            </div>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#F4F4F5',
                letterSpacing: '-0.5px',
              }}
            >
              Vilo
            </span>
          </div>

          {/* Tagline */}
          <div className="flex flex-col items-center gap-2" style={{ marginTop: 8 }}>
            <p
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.88)',
                lineHeight: 1.35,
                textAlign: 'center',
              }}
            >
              Focus. Track. Grow.
            </p>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.45)',
                maxWidth: 260,
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              Quản lý thời gian và mục tiêu của bạn một cách hiệu quả.
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-3 w-full" style={{ maxWidth: 280 }}>
            {FEATURES.map((feat) => (
              <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span
                  aria-hidden
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#6366f1',
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                  {feat}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright */}
        <p
          className="relative"
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}
        >
          © 2025 Vilo
        </p>
      </aside>

      {/* ── RIGHT: Form panel ── */}
      <main
        className="flex flex-1 items-center justify-center bg-background px-6 py-10 md:px-12"
      >
        {children}
      </main>
    </div>
  )
}
