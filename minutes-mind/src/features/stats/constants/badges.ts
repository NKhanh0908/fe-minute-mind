import type { BadgeResponse } from '../../../types/api'

export const ALL_BADGES: BadgeResponse[] = [
  { code: 'FIRST_SESSION', name: 'Bước đầu tiên', icon: '🌱', rarity: 'COMMON' },
  { code: 'STREAK_7', name: 'Tuần lửa', icon: '🔥', rarity: 'RARE' },
  { code: 'STREAK_30', name: 'Tháng vàng', icon: '💎', rarity: 'EPIC' },
  { code: 'STREAK_100', name: 'Kỷ luật Sắt', icon: '🦾', rarity: 'LEGENDARY' },
  { code: 'TOTAL_100H', name: '100 giờ', icon: '⚡', rarity: 'RARE' },
  { code: 'TOTAL_500H', name: '500 giờ', icon: '🚀', rarity: 'LEGENDARY' },
  { code: 'GOAL_CRUSHER', name: 'Goal Crusher', icon: '🎯', rarity: 'EPIC' },
  { code: 'MARATHON', name: 'Marathon', icon: '⏱️', rarity: 'RARE' },
]
