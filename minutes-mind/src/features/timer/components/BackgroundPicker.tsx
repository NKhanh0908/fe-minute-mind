import { useEffect, useRef } from 'react'
import { X, Check } from 'lucide-react'
import { BACKGROUND_PRESETS } from '../constants/backgrounds'

interface BackgroundPickerProps {
  visible: boolean
  currentId: string
  onSelect: (id: string) => void
  onClose: () => void
}

export function BackgroundPicker({ visible, currentId, onSelect, onClose }: BackgroundPickerProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  // Click outside → close
  useEffect(() => {
    if (!visible) return
    const handleMouseDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [visible, onClose])

  if (!visible) return null

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: 52,
        right: 16,
        zIndex: 30,
        width: 280,
        background: 'rgba(10, 10, 18, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 16,
        padding: 14,
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)' }}>
          Ảnh nền
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.4)',
            padding: 2,
            borderRadius: 4,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)' }}
          title="Đóng"
        >
          <X size={14} />
        </button>
      </div>

      {/* Thumbnail grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          marginTop: 12,
        }}
      >
        {BACKGROUND_PRESETS.map((preset) => {
          const isSelected = preset.id === currentId
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset.id)}
              style={{
                aspectRatio: '16 / 10',
                borderRadius: 10,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                padding: 0,
                border: `2px solid ${isSelected ? '#6366f1' : 'transparent'}`,
                transition: 'border-color 0.15s',
                background: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'
                }
              }}
              title={preset.label}
            >
              {/* Thumbnail image */}
              <img
                src={preset.thumbnail}
                alt={preset.label}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {/* Label overlay */}
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '4px 6px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.85)',
                  textAlign: 'center',
                }}
              >
                {preset.label}
              </span>

              {/* Selected checkmark */}
              {isSelected && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={11} color="#fff" />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
