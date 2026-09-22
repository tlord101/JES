'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { initialAuthState } from '@/lib/auth/action-state';
import { signInAction } from '@/lib/auth/actions';
import type { PortalId } from '@/lib/auth/roles';

/**
 * Credential form used by the shared login page and by every portal-specific
 * login page. Submission is a Server Action, so credentials never travel
 * through a public API route.
 */
export default function LoginForm({
  portal,
  redirectTo,
  submitLabel = 'Sign in',
}: {
  portal?: PortalId;
  redirectTo?: string;
  submitLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState(signInAction, initialAuthState);

  return (
    <form action={formAction} className="space-y-4">
      {portal ? <input type="hidden" name="portal" value={portal} /> : null}
      {redirectTo ? <input type="hidden" name="redirect" value={redirectTo} /> : null}

      {state.status === 'error' && state.message ? (
        <div
          role="alert"
          className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-start gap-2"
        >
          <i className="bi bi-exclamation-triangle-fill text-red-500 text-base flex-shrink-0"></i>
          <span>{state.message}</span>
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-[var(--text)] mb-1">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="name@example.com"
          className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
        />
        {state.errors?.email ? (
          <p className="mt-1 text-[11px] text-red-600">{state.errors.email}</p>
        ) : null}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-xs font-semibold text-[var(--text)]">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-[11px] font-bold text-[var(--primary)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Your password"
          className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
        />
        {state.errors?.password ? (
          <p className="mt-1 text-[11px] text-red-600">{state.errors.password}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-[var(--primary)] text-white text-sm font-bold rounded hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isPending ? <i className="bi bi-arrow-repeat animate-spin"></i> : null}
        {isPending ? 'Signing in...' : submitLabel}
      </button>

      <p className="text-center text-xs text-[var(--muted-text)]">
        Requesting portal access?{' '}
        <Link href="/register" className="font-bold text-[var(--primary)] hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
