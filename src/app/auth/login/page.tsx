'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DEMO_ACCOUNTS = [
  { role: 'Super Admin', email: 'admin@jasmine.edu.ng', label: 'Super Admin' },
  { role: 'Principal', email: 'principal@jasmine.edu.ng', label: 'Principal' },
  { role: 'Teacher', email: 'teacher@jasmine.edu.ng', label: 'Teacher' },
  { role: 'Accountant', email: 'accountant@jasmine.edu.ng', label: 'Accountant' },
  { role: 'Parent', email: 'parent@jasmine.edu.ng', label: 'Parent' },
  { role: 'Student', email: 'student@jasmine.edu.ng', label: 'Student' },
  { role: 'Alumni', email: 'alumni@jasmine.edu.ng', label: 'Alumni' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      setSuccess(`Welcome back, ${data.user.name}! Redirecting to dashboard...`);

      const roleRedirects: Record<string, string> = {
        'Super Admin': '/admin',
        'Administrator': '/admin',
        'Principal': '/admin',
        'Vice Principal': '/admin',
        'HOD': '/staff',
        'Teacher': '/staff',
        'Accountant': '/admin',
        'Parent': '/parent',
        'Student': '/student',
        'Alumni': '/profile',
      };

      const targetPath = roleRedirects[data.user.role] || '/profile';
      setTimeout(() => {
        router.push(targetPath);
        router.refresh();
      }, 800);
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError('');
  };

  return (
    <div className="py-12 bg-[var(--soft-bg)] min-h-[80vh] flex items-center">
      <div className="max-w-md mx-auto px-4 w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[var(--primary)] text-white font-bold rounded flex items-center justify-center text-xl mx-auto shadow-sm">
            JES
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Portal Login</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Sign in to access school records, portal management, and academic resources.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill text-red-500 text-base flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded flex items-center gap-2">
            <i className="bi bi-check-circle-fill text-green-600 text-base flex-shrink-0"></i>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. parent@jasmine.edu.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-[var(--text)]">Password *</label>
              <Link href="/auth/forgot-password" className="text-[11px] font-bold text-[var(--primary)] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <i className="bi bi-arrow-repeat animate-spin"></i>}
            {loading ? 'Authenticating...' : 'Log In'}
          </button>

          <div className="pt-2 text-center text-xs text-[var(--muted-text)]">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-bold text-[var(--primary)] hover:underline">
              Register Here
            </Link>
          </div>
        </form>

        {/* Demo Accounts Quick-Fill Panel */}
        <div className="bg-white p-4 border border-[var(--border)] rounded space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
            <i className="bi bi-key-fill text-[var(--primary)]"></i>
            <span>Demo Test Accounts (Password: Password123!)</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {DEMO_ACCOUNTS.map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => fillDemoAccount(demo.email)}
                className="px-2.5 py-1 bg-[var(--soft-bg)] border border-[var(--border)] text-[11px] font-semibold text-[var(--text)] rounded hover:border-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors"
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
