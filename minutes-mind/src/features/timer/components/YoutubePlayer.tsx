import { useState } from 'react'
import { X } from 'lucide-react'

interface YoutubePlayerProps {
  visible: boolean
  onClose: () => void
}

type Tab = 'music' | 'noise'

interface VideoPreset {
  id: string
  title: string
  label: string
}

const MUSIC_PRESETS: VideoPreset[] = [
  { id: 'jfKfPfyJRdk', title: 'Lofi Hip Hop Radio', label: 'Lofi Girl – 24/7' },
  { id: '5qap5aO4i9A', title: 'Lofi Hip Hop Mix', label: 'Study & Relax' },
  { id: 'DWcJFNfaw9c', title: 'Deep Focus Music', label: 'Alpha Waves' },
  { id: 'lTRiuFIWV54', title: 'Coffee Shop Ambience', label: 'Lo-fi Chill' },
]

const NOISE_PRESETS: VideoPreset[] = [
  { id: 'nMfPqeZjc2c', title: 'White Noise', label: 'Tập trung sâu' },
  { id: 'q76bMs-NwRk', title: 'Rain Sounds', label: 'Tiếng mưa nhẹ' },
  { id: 'jbIfaT9UJZE', title: 'Brown Noise', label: 'Não thư giãn' },
  { id: 'WHPEKLQID4U', title: 'Forest Sounds', label: 'Tiếng rừng' },
]

function parseYoutubeUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim())
    const list = url.searchParams.get('list')
    if (list && url.hostname.includes('youtube.com')) {
      return `https://www.youtube.com/embed/videoseries?list=${list}&autoplay=1`
    }
    const v = url.searchParams.get('v')
    if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1)
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`
    }
    return null
  } catch {
    return null
  }
}

export function YoutubePlayer({ visible, onClose }: YoutubePlayerProps) {
  const [tab, setTab] = useState<Tab>('music')
  const [url, setUrl] = useState('')
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [urlError, setUrlError] = useState(false)

  const handlePlayUrl = () => {
    const parsed = parseYoutubeUrl(url)
    if (parsed) { setEmbedUrl(parsed); setUrlError(false) }
    else setUrlError(true)
  }

  const handlePlayPreset = (video: VideoPreset) => {
    setEmbedUrl(`https://www.youtube.com/embed/${video.id}?autoplay=1`)
    setUrlError(false)
  }

  const presets = tab === 'music' ? MUSIC_PRESETS : NOISE_PRESETS

  return (
    <div
      style={{
        position: 'fixed',
        top: 52,
        right: 16,
        width: 380,
        zIndex: 50,
        visibility: visible ? 'visible' : 'hidden',
        opacity: visible ? 1 : 0,
        borderRadius: 18,
        background: 'rgba(14,14,22,0.94)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        transition: 'opacity 0.15s ease, visibility 0.15s',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: '14px 16px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['music', 'noise'] as Tab[]).map((t) => {
            const label = t === 'music' ? 'Nhạc' : 'Tiếng ồn'
            const isActive = tab === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: 26, height: 26, borderRadius: 8,
            border: 'none', background: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.12s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)' }}
        >
          <X size={13} />
        </button>
      </div>

      {/* ── Tab underline ── */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '10px 0 0' }} />

      {/* ── Body ── */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* URL input section */}
        <div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontWeight: 500, letterSpacing: '0.04em' }}>
            VIDEO YOUTUBE
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && handlePlayUrl()}
              placeholder="Dán URL YouTube..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.07)',
                border: urlError ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.09)',
                borderRadius: 10,
                padding: '8px 12px',
                color: '#fff',
                fontSize: 12,
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={handlePlayUrl}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 10px rgba(99,102,241,0.35)',
              }}
            >
              Phát ▶
            </button>
          </div>
          {urlError && <p style={{ fontSize: 10, color: 'rgba(239,68,68,0.9)', marginTop: 4 }}>Link không hợp lệ</p>}
        </div>

        {/* iframe */}
        {embedUrl && (
          <iframe
            src={embedUrl}
            width="100%"
            height="170"
            style={{ border: 'none', borderRadius: 10, display: 'block' }}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="YouTube player"
          />
        )}

        {/* Suggested grid */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {presets.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => handlePlayPreset(video)}
                style={{
                  borderRadius: 10,
                  border: embedUrl?.includes(video.id)
                    ? '1.5px solid rgba(99,102,241,0.6)'
                    : '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  textAlign: 'left',
                  padding: 0,
                  transition: 'border-color 0.15s, transform 0.1s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', background: '#0a0a12' }}>
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                    alt={video.title}
                    style={{
                      position: 'absolute', inset: 0, width: '100%', height: '100%',
                      objectFit: 'cover',
                    }}
                    loading="lazy"
                  />
                  {embedUrl?.includes(video.id) && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(99,102,241,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 20, color: '#fff' }}>▶</span>
                    </div>
                  )}
                </div>
                {/* Labels */}
                <div style={{ padding: '7px 9px 8px' }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.3 }}>
                    {video.title}
                  </p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>
                    {video.label}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 10, textAlign: 'center' }}>
            Đề xuất của chúng tôi
          </p>
        </div>
      </div>
    </div>
  )
}
