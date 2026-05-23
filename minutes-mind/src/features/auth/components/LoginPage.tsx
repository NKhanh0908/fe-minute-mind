import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { useLogin } from '../hooks/useLogin'

const LABELS = {
  title: 'Vilo',
  subtitle: '\u0110\u0103ng nh\u1eadp v\u00e0o t\u00e0i kho\u1ea3n',
  emailPlaceholder: 'Email',
  passwordPlaceholder: 'M\u1eadt kh\u1ea9u',
  submit: '\u0110\u0103ng nh\u1eadp',
  submitting: '\u0110ang \u0111\u0103ng nh\u1eadp...',
  noAccount: 'Ch\u01b0a c\u00f3 t\u00e0i kho\u1ea3n? ',
  registerLink: '\u0110\u0103ng k\u00fd',
  errorFallback: '\u0110\u0103ng nh\u1eadp th\u1ea5t b\u1ea1i, vui l\u00f2ng th\u1eed l\u1ea1i.',
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
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6">
        <h1 className="mb-1 text-center text-2xl font-bold text-brand">{LABELS.title}</h1>
        <p className="mb-6 text-center text-sm text-text-muted">{LABELS.subtitle}</p>

        <form className="space-y-4" onSubmit={onSubmit}>
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
            autoComplete="current-password"
            minLength={8}
          />

          <button
            className="flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? LABELS.submitting : LABELS.submit}
          </button>

          {loginMutation.isError ? (
            <p className="text-sm text-status-danger">{LABELS.errorFallback}</p>
          ) : null}
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          {LABELS.noAccount}
          <Link className="text-brand hover:text-brand-dark" to="/register">
            {LABELS.registerLink}
          </Link>
        </p>
      </div>
    </div>
  )
}
