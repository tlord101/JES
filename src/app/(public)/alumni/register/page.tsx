'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AlumniRegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    graduationYear: '2020',
    profession: '',
    organization: '',
    email: '',
    phone: '',
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Alumni Association</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Alumni Network Registration</h1>
          <p className="text-xs text-[var(--muted-text)] mt-1">
            Join our global directory of JES alumni, mentors, and ambassadors.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-green-50 border border-green-200 rounded text-center space-y-3">
            <i className="bi bi-check-circle-fill text-4xl text-[var(--success)]"></i>
            <h2 className="text-xl font-bold text-slate-800">Registration Complete!</h2>
            <p className="text-xs text-slate-600">
              Welcome back, <strong>{formData.name}</strong>. Your profile has been added to the Jasmine Exclusive School Alumni Association directory.
            </p>
            <div className="pt-2">
              <Link href="/alumni/directory" className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded inline-block">
                View Directory
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--soft-bg)] p-6 border border-[var(--border)] rounded">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Osagie Enabulele"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Graduation Year *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g., 2018"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Profession / Industry *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Software Engineer, Doctor"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Current Organization / Firm</label>
                <input
                  type="text"
                  placeholder="Company or institution name"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">City & Country *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Lagos, Nigeria"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="alumni@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <Link href="/alumni" className="text-xs font-bold text-[var(--primary)] hover:underline">Cancel</Link>
              <button
                type="submit"
                className="px-6 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors"
              >
                Submit Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
