import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { useLogin } from '../hooks/useLogin'

const LABELS = {
  title: 'Vilo',
  subtitle: 'Đăng nhập vào tài khoản',
  emailPlaceholder: 'Email',
  passwordPlaceholder: 'Mật khẩu',
  submit: 'Đăng nhập',
  submitting: 'Đang đăng nhập...',
  noAccount: 'Chưa có tài khoản? ',
  registerLink: 'Đăng ký',
  errorFallback: 'Đăng nhập thất bại, vui lòng thử lại.',
} as const

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLogin()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    loginMutation.mutate({ email: email.trim(), password })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
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
            <input
              className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-brand focus:outline-none hover:border-border/70"
              type="email"
              placeholder={LABELS.emailPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
            <input
              className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-brand focus:outline-none hover:border-border/70"
              type="password"
              placeholder={LABELS.passwordPlaceholder}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              minLength={8}
            />

            {loginMutation.isError && (
              <p className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-status-danger border border-red-900/40">
                {LABELS.errorFallback}
              </p>
            )}

            <button
              className="flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                marginTop: 8,
              }}
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? LABELS.submitting : LABELS.submit}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            {LABELS.noAccount}
            <Link className="font-medium text-brand hover:text-brand-dark transition-colors" to="/register">
              {LABELS.registerLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
