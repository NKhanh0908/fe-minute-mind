import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { useRegister } from '../hooks/useRegister'

const LABELS = {
  title: 'Vilo',
  subtitle: 'T\u1ea1o t\u00e0i kho\u1ea3n m\u1edbi',
  namePlaceholder: 'H\u1ecd t\u00ean',
  emailPlaceholder: 'Email',
  passwordPlaceholder: 'M\u1eadt kh\u1ea9u (\u2265 8 k\u00fd t\u1ef1)',
  submit: '\u0110\u0103ng k\u00fd',
  submitting: '\u0110ang \u0111\u0103ng k\u00fd...',
  haveAccount: '\u0110\u00e3 c\u00f3 t\u00e0i kho\u1ea3n? ',
  loginLink: '\u0110\u0103ng nh\u1eadp',
  errorFallback: '\u0110\u0103ng k\u00fd th\u1ea5t b\u1ea1i, vui l\u00f2ng th\u1eed l\u1ea1i.',
  emailInvalid: 'Email kh\u00f4ng h\u1ee3p l\u1ec7',
  passwordTooShort: 'M\u1eadt kh\u1ea9u c\u1ea7n t\u1ed1i thi\u1ec3u 8 k\u00fd t\u1ef1',
  nameRequired: 'Vui l\u00f2ng nh\u1eadp h\u1ecd t\u00ean',
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6">
        <h1 className="mb-1 text-center text-2xl font-bold text-brand">{LABELS.title}</h1>
        <p className="mb-6 text-center text-sm text-text-muted">{LABELS.subtitle}</p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
            type="text"
            placeholder={LABELS.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoComplete="name"
          />
          <input
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
            type="email"
            placeholder={LABELS.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
          <input
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
            type="password"
            placeholder={LABELS.passwordPlaceholder}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />

          <button
            className="flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={registerMutation.isPending || Boolean(validationError)}
          >
            {registerMutation.isPending ? LABELS.submitting : LABELS.submit}
          </button>

          {validationError ? (
            <p className="text-sm text-status-danger">{validationError}</p>
          ) : null}
          {registerMutation.isError && !validationError ? (
            <p className="text-sm text-status-danger">{LABELS.errorFallback}</p>
          ) : null}
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          {LABELS.haveAccount}
          <Link className="text-brand hover:text-brand-dark" to="/login">
            {LABELS.loginLink}
          </Link>
        </p>
      </div>
    </div>
  )
}
