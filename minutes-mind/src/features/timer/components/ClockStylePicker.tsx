import { Clock } from 'lucide-react'
import { useState } from 'react'

export type ClockStyle = 'ring' | 'minimal' | 'flip'

interface ClockStylePickerProps {
  visible: boolean
  currentStyle: ClockStyle
  onSelect: (style: ClockStyle) => void
  onClose: () => void
}

const STYLES: { id: ClockStyle; label: string; preview: string; desc: string }[] = [
  {
    id: 'ring',
    label: 'Vòng tròn',
    preview: '◯',
    desc: 'Đồng hồ ring SVG cổ điển',
  },
  {
    id: 'minimal',
    label: 'Tối giản',
    preview: '—',
    desc: 'Chỉ số giờ, không có ring',
  },
  {
    id: 'flip',
    label: 'Flip',
    preview: '⬛',
    desc: 'Kiểu thẻ lật số',
  },
]

export function ClockStylePicker({ visible, currentStyle, onSelect, onClose }: ClockStylePickerProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 52,
        right: 16,
        width: 220,
        zIndex: 50,
        visibility: visible ? 'visible' : 'hidden',
        opacity: visible ? 1 : 0,
        borderRadius: 14,
        background: 'rgba(10,10,18,0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        transition: 'opacity 0.15s ease, visibility 0.15s',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'rgba(255,255,255,0.65)',
        }}
      >
        <Clock size={13} />
        <span style={{ fontSize: 12, fontWeight: 500 }}>Kiểu đồng hồ</span>
      </div>

      {/* Options */}
      <div style={{ padding: '8px 8px' }}>
        {STYLES.map((s) => {
          const isActive = s.id === currentStyle
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => { onSelect(s.id); onClose() }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 9,
                border: 'none',
                background: isActive ? 'rgba(99,102,241,0.18)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.12s',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }}
            >
              {/* Preview icon */}
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: isActive ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  flexShrink: 0,
                  border: isActive ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {s.preview}
              </span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#818cf8' : 'rgba(255,255,255,0.85)', margin: 0 }}>
                  {s.label}
                </p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0, marginTop: 1 }}>
                  {s.desc}
                </p>
              </div>
              {isActive && (
                <span style={{ marginLeft: 'auto', color: '#818cf8', fontSize: 14 }}>✓</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
