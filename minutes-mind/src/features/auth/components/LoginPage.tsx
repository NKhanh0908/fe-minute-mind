import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, AlertCircle } from 'lucide-react'

import { useLogin } from '../hooks/useLogin'
import { AuthLayout } from './AuthLayout'

const LABELS = {
  title: 'Đăng nhập',
  subtitle: 'Chào mừng trở lại 👋',
  emailPlaceholder: 'Email',
  passwordPlaceholder: 'Mật khẩu',
  submit: 'Đăng nhập',
  submitting: 'Đang đăng nhập...',
  noAccount: 'Chưa có tài khoản? ',
  registerLink: 'Đăng ký',
  errorFallback: 'Đăng nhập thất bại, vui lòng thử lại.',
} as const

/* ── Shared input wrapper with left icon ── */
function IconInput({
  icon: Icon,
  ...inputProps
}: {
  icon: React.ElementType
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ position: 'relative' }}>
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#71717A',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <Icon size={16} />
      </span>
      <input
        {...inputProps}
        className="auth-input"
        style={{ paddingLeft: 42, ...(inputProps.style ?? {}) }}
      />
    </div>
  )
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLogin()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    loginMutation.mutate({ email: email.trim(), password })
  }

  return (
    <AuthLayout>
      {/* Card */}
      <div className="auth-card">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#F4F4F5',
              margin: 0,
            }}
          >
            {LABELS.title}
          </h1>
          <p style={{ fontSize: 14, color: '#71717A', marginTop: 4 }}>
            {LABELS.subtitle}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-3" onSubmit={onSubmit}>
          <IconInput
            icon={Mail}
            type="email"
            placeholder={LABELS.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <IconInput
            icon={Lock}
            type="password"
            placeholder={LABELS.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            minLength={8}
          />

          {loginMutation.isError && (
            <p className="auth-error">
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              {LABELS.errorFallback}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? LABELS.submitting : LABELS.submit}
          </button>
        </form>

        {/* Link */}
        <p className="auth-switch-link">
          {LABELS.noAccount}
          <Link to="/register">
            {LABELS.registerLink}
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
