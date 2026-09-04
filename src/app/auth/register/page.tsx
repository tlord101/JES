'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Parent',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      setSuccessMessage(data.message || 'Account created successfully! Check your email to verify.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'Parent',
      });
      setLoading(false);
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-[var(--soft-bg)] min-h-[85vh] flex items-center">
      <div className="max-w-md mx-auto px-4 w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[var(--primary)] text-white font-bold rounded flex items-center justify-center text-xl mx-auto shadow-sm">
            JES
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Create an Account</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Register for access to the Jasmine Exclusive School Portal.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill text-red-500 text-base flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded space-y-2">
            <div className="flex items-center gap-2 font-bold text-green-900">
              <i className="bi bi-check-circle-fill text-green-600 text-base flex-shrink-0"></i>
              <span>Registration Successful!</span>
            </div>
            <p>{successMessage}</p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-block px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors"
              >
                Proceed to Login
              </Link>
            </div>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleRegister} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Account Category *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="Parent">Parent / Guardian</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher / Staff</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Dr. Emmanuel Okafor"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="e.g. parent@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Password * (Min. 8 characters)</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <i className="bi bi-arrow-repeat animate-spin"></i>}
              {loading ? 'Creating Account...' : 'Register'}
            </button>

            <div className="pt-2 text-center text-xs text-[var(--muted-text)]">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-bold text-[var(--primary)] hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
