import { Camera, Loader2, Trash2, User } from 'lucide-react'
import { useRef, useState } from 'react'

import { useAuthStore } from '../../auth/store/useAuthStore'
import {
  useProfile,
  useRemoveAvatar,
  useUpdateAvatar,
  useUpdateProfile,
} from '../hooks/useProfile'
import { Avatar } from '../../../components/ui/Avatar'

const TIMEZONES = [
  'Asia/Ho_Chi_Minh',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Seoul',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'UTC',
]

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const updateAvatar = useUpdateAvatar()
  const removeAvatar = useRemoveAvatar()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user?.name ?? '')
  const [timezone, setTimezone] = useState(user?.timezone ?? 'Asia/Ho_Chi_Minh')
  const [threshold, setThreshold] = useState(user?.streakThresholdMinutes ?? 25)
  const [saved, setSaved] = useState(false)

  // Keep form in sync with profile data once loaded
  if (profile && name === '' && profile.name) {
    setName(profile.name)
    setTimezone(profile.timezone)
    setThreshold(profile.streakThresholdMinutes)
  }

  const displayUser = profile ?? user

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate(
      { name, timezone, streakThresholdMinutes: threshold },
      {
        onSuccess: () => {
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
        },
      },
    )
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) updateAvatar.mutate(file)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-4 md:p-8">
      <h1 className="text-2xl font-bold text-text-primary">Hồ sơ cá nhân</h1>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface p-6">
        <div className="relative">
          <Avatar name={displayUser?.name || 'U'} url={displayUser?.avatarUrl} size="xl" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={updateAvatar.isPending}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 border border-border text-text-muted hover:text-text-primary hover:bg-border transition-colors"
            title="Đổi ảnh đại diện"
          >
            {updateAvatar.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">{displayUser?.name}</div>
          <div className="text-sm text-text-muted">{displayUser?.email}</div>
        </div>

        {displayUser?.avatarUrl && (
          <button
            type="button"
            onClick={() => removeAvatar.mutate()}
            disabled={removeAvatar.isPending}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-status-danger transition-colors"
          >
            {removeAvatar.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Xóa ảnh đại diện
          </button>
        )}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <User className="h-4 w-4 text-brand" />
          Thông tin cá nhân
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="mb-1.5 block text-xs font-medium text-text-muted">
              Tên hiển thị <span className="text-status-danger">*</span>
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
              placeholder="Nhập tên của bạn"
            />
          </div>

          <div>
            <label htmlFor="profile-timezone" className="mb-1.5 block text-xs font-medium text-text-muted">
              Múi giờ
            </label>
            <select
              id="profile-timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="profile-threshold" className="mb-1.5 block text-xs font-medium text-text-muted">
              Ngưỡng Streak mỗi ngày (phút)
            </label>
            <input
              id="profile-threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              min={1}
              max={480}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none"
            />
            <p className="mt-1 text-xs text-text-muted">
              Số phút tối thiểu cần tập trung mỗi ngày để duy trì Streak.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          {saved && (
            <span className="text-sm text-status-success">✅ Đã lưu thay đổi!</span>
          )}
          <button
            type="submit"
            disabled={updateProfile.isPending || !name.trim()}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateProfile.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </button>
        </div>
      </form>

      {/* Account info */}
      <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">Thông tin tài khoản</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Email</span>
            <span className="text-text-primary">{displayUser?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Múi giờ</span>
            <span className="text-text-primary">{displayUser?.timezone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Ngưỡng Streak</span>
            <span className="text-text-primary">{displayUser?.streakThresholdMinutes} phút/ngày</span>
          </div>
        </div>
      </div>
    </div>
  )
}
