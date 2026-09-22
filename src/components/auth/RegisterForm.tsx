'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { initialAuthState } from '@/lib/auth/action-state';
import { registerAction } from '@/lib/auth/actions';

/**
 * Self-service registration for parents, students and alumni.
 * Staff and administrator accounts are created by the school instead, so those
 * roles are deliberately absent from this form.
 */
export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialAuthState);

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

      <div>
        <label htmlFor="fullName" className="block text-xs font-semibold mb-1">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          placeholder="e.g. Osasere Clinton"
          className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)]"
        />
        {state.errors?.fullName ? (
          <p className="mt-1 text-[11px] text-red-600">{state.errors.fullName}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="role" className="block text-xs font-semibold mb-1">
          I am registering as
        </label>
        <select
          id="role"
          name="role"
          defaultValue="parent"
          className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
        >
          <option value="parent">Parent / Guardian</option>
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold mb-1">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            required
            placeholder="+234 800 000 0000"
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)]"
          />
          {state.errors?.phone ? (
            <p className="mt-1 text-[11px] text-red-600">{state.errors.phone}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="password" className="block text-xs font-semibold mb-1">
            Password
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
            Confirm password
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
      </div>

      <p className="text-[11px] text-[var(--muted-text)]">
        Use at least 8 characters with a mixture of letters and numbers.
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-[var(--primary)] text-white text-sm font-bold rounded hover:bg-[var(--primary-dark)] disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isPending ? <i className="bi bi-arrow-repeat animate-spin"></i> : null}
        {isPending ? 'Creating account...' : 'Create account'}
      </button>

      <p className="text-center text-xs text-[var(--muted-text)]">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-[var(--primary)] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
