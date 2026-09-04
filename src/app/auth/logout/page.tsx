'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LogoutPage() {
  const router = useRouter();
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    async function performLogout() {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        setLoggedOut(true);
        setTimeout(() => {
          router.push('/auth/login');
          router.refresh();
        }, 1200);
      } catch (err) {
        setLoggedOut(true);
      }
    }
    performLogout();
  }, [router]);

  return (
    <div className="py-20 bg-[var(--soft-bg)] min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-[var(--primary-light)] text-[var(--primary)] rounded-full flex items-center justify-center text-2xl mx-auto">
          <i className="bi bi-box-arrow-right"></i>
        </div>
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Logging Out</h1>
        <p className="text-xs text-[var(--muted-text)]">
          {loggedOut
            ? 'Your portal session has been safely closed. Redirecting to login page...'
            : 'Ending your session and clearing authorization tokens...'}
        </p>
        <div className="pt-2">
          <Link
            href="/auth/login"
            className="inline-block px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors"
          >
            Return to Login Now
          </Link>
        </div>
      </div>
    </div>
  );
}
