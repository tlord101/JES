'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { initialAuthState } from '@/lib/auth/action-state';
import {
  requestPasswordResetAction,
  resendVerificationAction,
  updatePasswordAction,
} from '@/lib/auth/actions';

type Mode = 'forgot' | 'reset' | 'verify';

const COPY: Record<Mode, { button: string; pending: string }> = {
  forgot: { button: 'Send reset link', pending: 'Sending...' },
  reset: { button: 'Update password', pending: 'Updating...' },
  verify: { button: 'Resend verification email', pending: 'Sending...' },
};

/**
 * One small form component that covers the three single-purpose auth screens:
 * requesting a reset link, choosing a new password and re-sending the email
 * verification message.
 */
export default function PasswordRecoveryForm({ mode }: { mode: Mode }) {
  const action =
    mode === 'forgot'
      ? requestPasswordResetAction
      : mode === 'reset'
        ? updatePasswordAction
        : resendVerificationAction;

  const [state, formAction, isPending] = useActionState(action, initialAuthState);
  const copy = COPY[mode];

  return (
    <form action={formAction} className="space-y-4">
      {state.status === 'error' && state.message ? (
        <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {state.message}
        </div>
      ) : null}

      {state.status === 'success' && state.message ? (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded">
          {state.message}
        </div>
      ) : null}

      {mode === 'reset' ? (
        <>
          <div>
            <label htmlFor="password" className="block text-xs font-semibold mb-1">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)]"
            />
            {state.errors?.password ? (
              <p className="mt-1 text-[11px] text-red-600">{state.errors.password}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold mb-1">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)]"
            />
            {state.errors?.confirmPassword ? (
              <p className="mt-1 text-[11px] text-red-600">{state.errors.confirmPassword}</p>
            ) : null}
          </div>
        </>
      ) : (
        <div>
          <label htmlFor="email" className="block text-xs font-semibold mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)]"
          />
          {state.errors?.email ? (
            <p className="mt-1 text-[11px] text-red-600">{state.errors.email}</p>
          ) : null}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-[var(--primary)] text-white text-sm font-bold rounded hover:bg-[var(--primary-dark)] disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isPending ? <i className="bi bi-arrow-repeat animate-spin"></i> : null}
        {isPending ? copy.pending : copy.button}
      </button>

      <p className="text-center text-xs text-[var(--muted-text)]">
        Remembered your password?{' '}
        <Link href="/login" className="font-bold text-[var(--primary)] hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
