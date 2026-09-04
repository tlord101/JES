'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      setStatus('verifying');
      fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus('success');
            setMessage(data.message || 'Email verified successfully!');
          } else {
            setStatus('error');
            setMessage(data.error || 'Verification failed.');
          }
        })
        .catch(() => {
          setStatus('error');
          setMessage('An error occurred during email verification.');
        });
    }
  }, [token]);

  return (
    <div className="p-8 bg-white border border-[var(--border)] rounded text-center space-y-4">
      {status === 'verifying' && (
        <div className="space-y-3 py-4">
          <i className="bi bi-arrow-repeat text-4xl text-[var(--primary)] animate-spin inline-block"></i>
          <h2 className="text-base font-bold text-[var(--primary-dark)]">Verifying Your Email...</h2>
          <p className="text-xs text-[var(--muted-text)]">Please wait while we validate your email token.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-3">
          <i className="bi bi-patch-check-fill text-4xl text-green-600"></i>
          <h2 className="text-lg font-bold text-[var(--primary-dark)]">Email Confirmed!</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="px-5 py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded inline-block hover:bg-[var(--primary-dark)] transition-colors"
            >
              Proceed to Login
            </Link>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-3">
          <i className="bi bi-exclamation-octagon-fill text-4xl text-red-600"></i>
          <h2 className="text-lg font-bold text-red-800">Verification Link Invalid</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
          <div className="pt-2 flex justify-center gap-3 text-xs">
            <Link
              href="/auth/register"
              className="px-4 py-2 border border-[var(--border)] font-bold text-[var(--text)] rounded hover:bg-[var(--soft-bg)]"
            >
              Register Again
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]"
            >
              Back to Login
            </Link>
          </div>
        </div>
      )}

      {status === 'idle' && (
        <div className="space-y-3">
          <i className="bi bi-envelope-check-fill text-4xl text-[var(--primary)]"></i>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Verify Your Email</h1>
          <p className="text-xs text-[var(--muted-text)] leading-relaxed">
            A verification link has been sent to your registered inbox. Please click the link to confirm your account email.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="px-5 py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded inline-block"
            >
              Proceed to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="py-12 bg-[var(--soft-bg)] min-h-[80vh] flex items-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <Suspense fallback={<div className="text-center text-xs text-[var(--muted-text)]">Loading...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
