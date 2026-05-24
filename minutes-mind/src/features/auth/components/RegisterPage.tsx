import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'

import { useRegister } from '../hooks/useRegister'
import { AuthLayout } from './AuthLayout'

const LABELS = {
  title: 'Tạo tài khoản',
  subtitle: 'Bắt đầu hành trình của bạn',
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
            icon={User}
            type="text"
            placeholder={LABELS.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
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
            minLength={8}
            autoComplete="new-password"
          />

          {(validationError || (registerMutation.isError && !validationError)) && (
            <p className="auth-error">
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              {validationError ?? LABELS.errorFallback}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={registerMutation.isPending || Boolean(validationError)}
          >
            {registerMutation.isPending ? LABELS.submitting : LABELS.submit}
          </button>
        </form>

        {/* Link */}
        <p className="auth-switch-link">
          {LABELS.haveAccount}
          <Link to="/login">
            {LABELS.loginLink}
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
