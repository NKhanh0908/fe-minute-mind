import type { ReactNode } from 'react'
import LottieLib from 'lottie-react'
import businessmanAnimation from '../../../assets/login/Businessman_balancing_on_time_unicycle.json'

// CJS/ESM interop safety: lottie-react bundles as CJS, Vite may wrap it as {default: fn}
const Lottie = (LottieLib as unknown as { default: typeof LottieLib }).default ?? LottieLib

interface AuthLayoutProps {
  children: ReactNode
}

const FEATURES = [
  'Quản lý goals và tasks cá nhân',
  'Theo dõi streak và tiến độ học tập',
] as const

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* ── LEFT: Branding panel (hidden on mobile) ── */}
      <aside
        className="hidden md:flex md:w-[48%] flex-col py-10 px-10"
        style={{
          background: 'linear-gradient(145deg, #0d0d14 0%, #12101e 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial glow — top-right */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 55% at 95% 5%, rgba(99,102,241,0.14) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        {/* Radial glow — bottom-left accent */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 50% 40% at 10% 90%, rgba(99,102,241,0.07) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Top: Logo ── */}
        <div className="relative flex flex-col items-center gap-2" style={{ paddingTop: 8 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 8px 28px rgba(99,102,241,0.38)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>V</span>
          </div>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#F4F4F5',
              letterSpacing: '-0.4px',
            }}
          >
            Vilo
          </span>
        </div>

        {/* ── Middle: Tagline + Animation + Features (vertically centred) ── */}
        <div
          className="relative flex flex-col items-center flex-1"
          style={{ justifyContent: 'center', gap: 0 }}
        >
          {/* Tagline */}
          <div className="flex flex-col items-center text-center" style={{ marginBottom: 4 }}>
            <p
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
                letterSpacing: '-0.3px',
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              Focus. Track. Grow.
            </p>
            <p
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                maxWidth: 240,
                lineHeight: 1.65,
                margin: '6px 0 0',
              }}
            >
              Quản lý thời gian và mục tiêu của bạn một cách hiệu quả.
            </p>
          </div>

          {/* Lottie animation — hero of the left panel */}
          <div
            style={{
              width: '100%',
              maxWidth: 320,
              aspectRatio: '1 / 1',
              margin: '0 auto',
              flexShrink: 0,
            }}
          >
            <Lottie animationData={businessmanAnimation} loop autoplay />
          </div>

          {/* Feature list — directly below animation, no gap jump */}
          <ul
            className="flex flex-col"
            style={{ gap: 10, maxWidth: 260, width: '100%', marginTop: 4 }}
          >
            {FEATURES.map((feat) => (
              <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span
                  aria-hidden
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#6366f1',
                    marginTop: 7,
                    flexShrink: 0,
                    boxShadow: '0 0 6px rgba(99,102,241,0.6)',
                  }}
                />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>
                  {feat}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Bottom: Copyright ── */}
        <p
          className="relative text-center"
          style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', paddingBottom: 4 }}
        >
          © 2025 Vilo
        </p>
      </aside>

      {/* ── RIGHT: Form panel ── */}
      <main className="flex flex-1 items-center justify-center bg-background px-8 py-10">
        {children}
      </main>
    </div>
  )
}
