export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Theme-aware tokens (driven by CSS custom properties) ──────────
        // Values are set per-theme in index.css via :root / html.theme-* selectors.
        background:     'var(--color-bg)',
        surface:        'var(--color-surface)',
        'surface-2':    'var(--color-surface-2)',
        border:         'var(--color-border)',
        brand:          'var(--color-brand)',
        'brand-dark':   'var(--color-brand-dark)',
        'brand-light':  'var(--color-brand-light)',
        'text-primary': 'var(--color-text-primary)',
        'text-muted':   'var(--color-text-muted)',

        // ── Static tokens (same across all themes) ────────────────────────
        'text-disabled':  '#3F3F46',
        'status-success': '#22C55E',
        'status-warning': '#F59E0B',
        'status-danger':  '#EF4444',
        'status-info':    '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in':  'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}