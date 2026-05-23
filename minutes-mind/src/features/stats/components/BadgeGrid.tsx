import type { BadgeResponse } from '../../../types/api'
import { BadgeCard } from './BadgeCard'

interface Props {
  badges: BadgeResponse[]
  earnedCodes: string[]
}

export function BadgeGrid({ badges, earnedCodes }: Props) {
  const earnedBadges = badges.filter((b) => earnedCodes.includes(b.code))
  const unearnedBadges = badges.filter((b) => !earnedCodes.includes(b.code))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-text-primary mb-4">
          Đã đạt ({earnedBadges.length}/{badges.length})
        </h3>
        {earnedBadges.length === 0 ? (
          <p className="text-sm text-text-muted italic">Bạn chưa đạt được huy hiệu nào.</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge.code} badge={badge} earned={true} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-text-primary mb-4">Chưa đạt</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {unearnedBadges.map((badge) => (
            <BadgeCard key={badge.code} badge={badge} earned={false} />
          ))}
        </div>
      </div>
    </div>
  )
}
