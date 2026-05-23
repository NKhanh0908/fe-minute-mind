export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background:   '#0F0F11',
        surface:      '#1A1A1F',
        'surface-2':  '#25252D',
        border:       '#2E2E38',
        brand:        '#6366F1',
        'brand-dark': '#4F46E5',
        'brand-light':'#EEF2FF',
        'text-primary':  '#F4F4F5',
        'text-muted':    '#71717A',
        'text-disabled': '#3F3F46',
        'status-success':'#22C55E',
        'status-warning':'#F59E0B',
        'status-danger': '#EF4444',
        'status-info':   '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}