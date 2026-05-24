import { Camera, Loader2, Shield, Trash2, User } from 'lucide-react'
import { useRef, useState } from 'react'

import { useAuthStore } from '../../auth/store/useAuthStore'
import { useProfile, useRemoveAvatar, useUpdateAvatar, useUpdateProfile } from '../hooks/useProfile'
import { Avatar } from '../../../components/ui/Avatar'

const TIMEZONES = [
  'Asia/Ho_Chi_Minh', 'Asia/Bangkok', 'Asia/Singapore', 'Asia/Tokyo',
  'Asia/Seoul', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'UTC',
]

const inputClass = 'w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-brand focus:outline-none hover:border-border/70'

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
      { onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2500) } },
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
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl p-6 md:p-8 space-y-6">
        {/* Page header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-text-primary">Hồ sơ cá nhân</h1>
          <p className="mt-1 text-sm text-text-muted">Quản lý thông tin và tùy chỉnh tài khoản</p>
        </div>

        {/* Avatar card */}
        <div
          className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6"
          style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.12)' }}
        >
          {/* Top gradient */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-30"
            style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.15), transparent)' }}
          />

          <div className="relative flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar name={displayUser?.name || 'U'} url={displayUser?.avatarUrl} size="xl" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={updateAvatar.isPending}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-2 text-text-muted transition-colors hover:bg-border hover:text-text-primary"
                title="Đổi ảnh đại diện"
              >
                {updateAvatar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-text-primary">{displayUser?.name}</div>
              <div className="mt-0.5 text-sm text-text-muted">{displayUser?.email}</div>
            </div>

            {displayUser?.avatarUrl && (
              <button
                type="button"
                onClick={() => removeAvatar.mutate()}
                disabled={removeAvatar.isPending}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-text-muted transition-colors hover:bg-red-950/40 hover:text-status-danger"
              >
                {removeAvatar.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Xóa ảnh đại diện
              </button>
            )}
          </div>
        </div>

        {/* Profile form */}
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-border bg-surface p-6 space-y-5"
          style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.12)' }}
        >
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
                required minLength={2} maxLength={100}
                className={inputClass}
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div>
              <label htmlFor="profile-timezone" className="mb-1.5 block text-xs font-medium text-text-muted">Múi giờ</label>
              <select id="profile-timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputClass}>
                {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
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
                min={1} max={480}
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-text-muted">
                Số phút tối thiểu cần tập trung mỗi ngày để duy trì Streak.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-status-success">
                <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
                Đã lưu thay đổi!
              </span>
            )}
            <button
              type="submit"
              disabled={updateProfile.isPending || !name.trim()}
              className="flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 3px 12px rgba(99,102,241,0.25)' }}
            >
              {updateProfile.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </form>

        {/* Account info */}
        <div
          className="rounded-2xl border border-border bg-surface p-6 space-y-4"
          style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.12)' }}
        >
          <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Shield className="h-4 w-4 text-text-muted" />
            Thông tin tài khoản
          </h2>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Email', value: displayUser?.email },
              { label: 'Múi giờ', value: displayUser?.timezone },
              { label: 'Ngưỡng Streak', value: `${displayUser?.streakThresholdMinutes} phút/ngày` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-surface-2 px-4 py-2.5">
                <span className="text-text-muted text-xs">{label}</span>
                <span className="text-text-primary text-xs font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
