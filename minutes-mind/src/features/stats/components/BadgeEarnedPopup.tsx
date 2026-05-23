import { useEffect, useState } from 'react'

import type { BadgeResponse } from '../../../types/api'
import { cn } from '../../../utils/cn'

interface Props {
  badges: BadgeResponse[]
  onClose: () => void
}

export function BadgeEarnedPopup({ badges, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (badges.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= badges.length) {
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, 800)

    return () => clearInterval(timer)
  }, [badges.length])

  useEffect(() => {
    if (badges.length === 0) return

    const timer = setTimeout(() => {
      onClose()
    }, 5000 + badges.length * 800) // Auto close after 5s from the last badge

    return () => clearTimeout(timer)
  }, [badges.length, onClose])

  if (badges.length === 0) return null

  const currentBadge = badges[currentIndex]

  const getGlowClass = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]'
      case 'EPIC':
        return 'drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]'
      case 'RARE':
        return 'drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]'
      default:
        return 'drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]'
    }
  }

  const getBgClass = (rarity: string) => {
    switch (rarity) {
      case 'COMMON':
        return 'bg-zinc-800 text-zinc-300 border-zinc-700'
      case 'RARE':
        return 'bg-blue-950 text-blue-400 border-blue-800'
      case 'EPIC':
        return 'bg-violet-950 text-violet-400 border-violet-800'
      case 'LEGENDARY':
        return 'bg-amber-950 text-amber-400 border-amber-700'
      default:
        return 'bg-surface-2 text-text-muted border-border'
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        key={currentBadge.code}
        className={cn(
          'flex flex-col items-center p-8 rounded-2xl border-2',
          getBgClass(currentBadge.rarity),
          getGlowClass(currentBadge.rarity),
        )}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both' }}
      >
        <div className="text-sm font-bold tracking-widest text-white/80 uppercase mb-4">
          🎉 Badge mới!
        </div>
        <div className="text-7xl mb-4">{currentBadge.icon}</div>
        <div className="text-xl font-bold text-white mb-2">{currentBadge.name}</div>
        <div className="text-xs uppercase tracking-wider opacity-90 font-medium px-3 py-1 rounded-full bg-black/20">
          {currentBadge.rarity}
        </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
