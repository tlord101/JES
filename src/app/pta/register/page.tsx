'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PTARegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    studentName: '',
    studentClass: 'JSS 1',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">PTA Membership</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Register for PTA Directory</h1>
          <p className="text-xs text-[var(--muted-text)] mt-1">
            Ensure you receive meeting notices, election ballots, and school development updates.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-green-50 border border-green-200 rounded text-center space-y-3">
            <i className="bi bi-check-circle-fill text-4xl text-[var(--success)]"></i>
            <h2 className="text-xl font-bold text-slate-800">PTA Registration Successful!</h2>
            <p className="text-xs text-slate-600">
              Thank you, <strong>{formData.parentName}</strong>. Your contact details have been registered in the JES PTA communications roster.
            </p>
            <div className="pt-2">
              <Link href="/pta" className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded inline-block">
                Return to PTA Overview
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--soft-bg)] p-6 border border-[var(--border)] rounded">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Parent / Guardian Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Mrs. Patience Osagie"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Ward / Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Student's name"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Student Class *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Primary 4, JSS 1"
                  value={formData.studentClass}
                  onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <Link href="/pta" className="text-xs font-bold text-[var(--primary)] hover:underline">Cancel</Link>
              <button
                type="submit"
                className="px-6 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors"
              >
                Register
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
