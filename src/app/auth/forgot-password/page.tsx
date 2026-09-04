'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [demoToken, setDemoToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setDemoToken('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to process request.');
        setLoading(false);
        return;
      }

      setMessage(data.message || 'Password reset instructions sent.');
      if (data.resetToken) {
        setDemoToken(data.resetToken);
      }
      setLoading(false);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-[var(--soft-bg)] min-h-[80vh] flex items-center">
      <div className="max-w-md mx-auto px-4 w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[var(--primary)] text-white font-bold rounded flex items-center justify-center text-xl mx-auto shadow-sm">
            JES
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Forgot Password</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill text-red-500 text-base flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        {message ? (
          <div className="p-6 bg-white border border-[var(--border)] rounded space-y-4">
            <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
              <i className="bi bi-check-circle-fill text-green-600 text-lg"></i>
              <span>Request Dispatched</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{message}</p>

            {demoToken && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs space-y-1 text-slate-700">
                <span className="font-bold text-[var(--primary-dark)]">Demo Quick Reset Link:</span>
                <div>
                  <Link
                    href={`/auth/reset-password?token=${demoToken}`}
                    className="text-[var(--primary)] font-bold underline break-all"
                  >
                    /auth/reset-password?token={demoToken}
                  </Link>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-xs">
              <Link href="/auth/login" className="font-bold text-[var(--primary)] hover:underline">
                Back to Portal Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Registered Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. parent@jasmine.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <i className="bi bi-arrow-repeat animate-spin"></i>}
              {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
            </button>

            <div className="text-center pt-2">
              <Link href="/auth/login" className="text-xs font-bold text-[var(--primary)] hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
