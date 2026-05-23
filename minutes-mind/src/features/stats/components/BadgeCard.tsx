import type { BadgeResponse } from '../../../types/api'
import { cn } from '../../../utils/cn'

interface Props {
  badge: BadgeResponse
  earned?: boolean
}

export function BadgeCard({ badge, earned = false }: Props) {
  const getRarityClasses = (rarity: string) => {
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
      className={cn(
        'flex flex-col items-center justify-center p-4 border rounded-xl transition-transform hover:scale-105',
        getRarityClasses(badge.rarity),
        !earned && 'opacity-40 grayscale',
      )}
    >
      <div className="text-3xl mb-2">{badge.icon}</div>
      <div className="text-xs font-medium text-center truncate w-full">{badge.name}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider opacity-80">{badge.rarity}</div>
    </div>
  )
}
