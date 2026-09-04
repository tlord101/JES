'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Missing or invalid reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Password reset failed.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      setError('An error occurred while resetting password.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill text-red-500 text-base flex-shrink-0"></i>
          <span>{error}</span>
        </div>
      )}

      {submitted ? (
        <div className="p-6 bg-white border border-[var(--border)] rounded text-center space-y-3">
          <i className="bi bi-check-circle-fill text-3xl text-green-600"></i>
          <h2 className="text-base font-bold text-slate-800">Password Updated</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your password has been successfully reset. You may now log in with your new credentials.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded inline-block"
            >
              Login Now
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">New Password * (Min 8 chars)</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Confirm New Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <i className="bi bi-arrow-repeat animate-spin"></i>}
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="py-12 bg-[var(--soft-bg)] min-h-[80vh] flex items-center">
      <div className="max-w-md mx-auto px-4 w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[var(--primary)] text-white font-bold rounded flex items-center justify-center text-xl mx-auto shadow-sm">
            JES
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Reset Password</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Create a new secure password for your portal account.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-xs text-[var(--muted-text)]">Loading token...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
