'use client';

import { useActionState } from 'react';
import { initialAuthState, type AuthActionState } from '@/lib/auth/action-state';
import { updateUserAction, sendPasswordResetAction } from '../actions';
import type { UserDetail } from '@/lib/data/users';

type Props = { user: UserDetail };

const ROLE_OPTIONS: [string, string][] = [
  ['super_admin', 'Super Administrator'],
  ['admin', 'Administrator'],
  ['principal', 'Principal'],
  ['vice_principal', 'Vice Principal'],
  ['hod', 'Head of Department'],
  ['teacher', 'Teacher'],
  ['accountant', 'Accountant'],
  ['parent', 'Parent / Guardian'],
  ['student', 'Student'],
  ['alumni', 'Alumni'],
];

function Alert({ state }: { state: AuthActionState }) {
  if (state.status === 'idle') return null;
  const success = state.status === 'success';
  return (
    <div
      className={`p-3 text-xs rounded font-bold ${
        success
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}
    >
      {state.message}
    </div>
  );
}

export default function UserDetailForm({ user }: Props) {
  const [updateState, updateAction, isSaving] = useActionState(updateUserAction, initialAuthState);
  const [resetState, resetAction, isResetting] = useActionState(
    sendPasswordResetAction,
    initialAuthState
  );

  return (
    <div className="space-y-4">
      <Alert state={updateState} />
      <Alert state={resetState} />

      <form action={updateAction} className="space-y-6">
        <input type="hidden" name="userId" value={user.id} />
        <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
          <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
            <i className="bi bi-person-lines-fill text-[var(--primary)]"></i>
            <span>Account Details &amp; RBAC Role</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={user.fullName}
                required
                className="w-full p-2 border border-[var(--border)] rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="email">
                Email Address (immutable)
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="w-full p-2 border border-[var(--border)] rounded bg-[var(--soft-bg)] text-[var(--muted-text)]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={user.phone ?? ''}
                className="w-full p-2 border border-[var(--border)] rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="role">
                Assigned Role Category
              </label>
              <select
                id="role"
                name="role"
                defaultValue={user.role}
                className="w-full p-2 border border-[var(--border)] rounded font-bold"
              >
                {ROLE_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="isActive">
                Account Active Status
              </label>
              <select
                id="isActive"
                name="isActive"
                defaultValue={user.isActive ? 'true' : 'false'}
                className="w-full p-2 border border-[var(--border)] rounded font-bold"
              >
                <option value="true">Active Account</option>
                <option value="false">Disabled / Suspended</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="isVerified">
                Email Verification
              </label>
              <select
                id="isVerified"
                name="isVerified"
                defaultValue={user.isVerified ? 'true' : 'false'}
                className="w-full p-2 border border-[var(--border)] rounded font-bold"
              >
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] disabled:opacity-50"
            >
              {isSaving ? 'Saving…' : 'Save User Changes'}
            </button>
          </div>
        </div>
      </form>

      {/* Credentials */}
      <div className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
        <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
          <i className="bi bi-key-fill text-[var(--primary)]"></i>
          <span>Credentials</span>
        </h2>
        <p className="text-xs text-[var(--muted-text)]">
          Passwords are never stored by the school system. Send a secure reset link from Supabase
          Auth — the user sets their own new password.
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--muted-text)]">
            Last sign-in:{' '}
            <span className="font-mono">
              {user.lastLoginAt ? user.lastLoginAt.substring(0, 16).replace('T', ' ') : 'never'}
            </span>
          </span>
          <form action={resetAction}>
            <input type="hidden" name="email" value={user.email} />
            <button
              type="submit"
              disabled={isResetting}
              className="px-4 py-2 border border-[var(--primary)] text-[var(--primary)] font-bold rounded hover:bg-[var(--soft-bg)] disabled:opacity-50"
            >
              {isResetting ? 'Sending…' : 'Send Password Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
