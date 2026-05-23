import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { useRegister } from '../hooks/useRegister'

const LABELS = {
  title: 'Vilo',
  subtitle: 'Tạo tài khoản mới',
  namePlaceholder: 'Họ tên',
  emailPlaceholder: 'Email',
  passwordPlaceholder: 'Mật khẩu (≥ 8 ký tự)',
  submit: 'Đăng ký',
  submitting: 'Đang đăng ký...',
  haveAccount: 'Đã có tài khoản? ',
  loginLink: 'Đăng nhập',
  errorFallback: 'Đăng ký thất bại, vui lòng thử lại.',
  emailInvalid: 'Email không hợp lệ',
  passwordTooShort: 'Mật khẩu cần tối thiểu 8 ký tự',
  nameRequired: 'Vui lòng nhập họ tên',
} as const

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const registerMutation = useRegister()

  const validationError = useMemo(() => {
    if (name.length > 0 && name.trim().length === 0) return LABELS.nameRequired
    if (email.length > 0 && !EMAIL_REGEX.test(email)) return LABELS.emailInvalid
    if (password.length > 0 && password.length < 8) return LABELS.passwordTooShort
    return null
  }, [name, email, password])

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (validationError) return
    registerMutation.mutate({ name: name.trim(), email: email.trim(), password })
  }

  const inputClass = 'w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-brand focus:outline-none hover:border-border/70'

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div
        className="pointer-events-none fixed inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm">
        <div
          className="rounded-2xl border border-border bg-surface p-8"
          style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 20px 60px rgba(0,0,0,0.4)' }}
        >
          {/* Logo + heading */}
          <div className="mb-8 text-center">
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
            >
              <span className="text-xl font-bold text-white">V</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">{LABELS.title}</h1>
            <p className="mt-1 text-sm text-text-muted">{LABELS.subtitle}</p>
          </div>

          <form className="space-y-3" onSubmit={onSubmit}>
            <input className={inputClass} type="text" placeholder={LABELS.namePlaceholder} value={name}
              onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            <input className={inputClass} type="email" placeholder={LABELS.emailPlaceholder} value={email}
              onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <input className={inputClass} type="password" placeholder={LABELS.passwordPlaceholder} value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />

            {(validationError || (registerMutation.isError && !validationError)) && (
              <p className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-status-danger border border-red-900/40">
                {validationError ?? LABELS.errorFallback}
              </p>
            )}

            <button
              className="flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)', marginTop: 8 }}
              type="submit"
              disabled={registerMutation.isPending || Boolean(validationError)}
            >
              {registerMutation.isPending ? LABELS.submitting : LABELS.submit}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            {LABELS.haveAccount}
            <Link className="font-medium text-brand hover:text-brand-dark transition-colors" to="/login">
              {LABELS.loginLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
