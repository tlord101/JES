'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    gender: 'Male',
    previousSchool: '',
    classApplyingFor: 'JSS 1',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    passportPhoto: null as File | null,
    documents: null as FileList | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Admissions Portal</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Online Admission Application Form</h1>
          <p className="text-xs text-[var(--muted-text)] mt-1">
            Please fill out all required fields accurately. Mock submission behavior enabled.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-green-50 border border-green-200 rounded-md text-center space-y-4">
            <i className="bi bi-check-circle-fill text-4xl text-[var(--success)]"></i>
            <h2 className="text-2xl font-bold text-slate-800">Application Submitted Successfully!</h2>
            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
              Thank you for applying to <strong>Jasmine Exclusive School</strong> for <strong>{formData.studentName || 'your child'}</strong>.
              An official confirmation email has been dispatched to <strong>{formData.parentEmail || 'your email'}</strong>. Our admissions officer will contact you regarding entrance examination details.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--soft-bg)] p-6 md:p-8 border border-[var(--border)] rounded-md">

            {/* Student Details Section */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-slate-300 pb-2">
                1. Student Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Osasere Clinton"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Class Applying For *
                  </label>
                  <select
                    value={formData.classApplyingFor}
                    onChange={(e) => setFormData({ ...formData, classApplyingFor: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="Creche">Creche / Nursery 1</option>
                    <option value="Nursery 2">Nursery 2 / Primary 1</option>
                    <option value="Primary 2-5">Primary 2 - Primary 5</option>
                    <option value="JSS 1">Junior Secondary 1 (JSS 1)</option>
                    <option value="JSS 2">Junior Secondary 2 (JSS 2)</option>
                    <option value="SSS 1">Senior Secondary 1 (SSS 1)</option>
                    <option value="SSS 2">Senior Secondary 2 (SSS 2)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Previous School Attended
                  </label>
                  <input
                    type="text"
                    placeholder="Name of former school (if applicable)"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
            </div>

            {/* Parent Details Section */}
            <div className="space-y-4 pt-4">
              <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-slate-300 pb-2">
                2. Parent / Guardian Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Parent / Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Mr. & Mrs. Clinton"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Residential Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Residential address in Benin City or surrounding area"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="space-y-4 pt-4">
              <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-slate-300 pb-2">
                3. Passport Photo & Supporting Documents
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Student Passport Photograph
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, passportPhoto: e.target.files?.[0] || null })}
                    className="w-full text-xs text-[var(--muted-text)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary-dark)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Birth Cert / Report Cards
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFormData({ ...formData, documents: e.target.files })}
                    className="w-full text-xs text-[var(--muted-text)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary-dark)]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Link href="/admissions" className="text-xs font-bold text-[var(--primary)] hover:underline">
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
              >
                Submit Application <i className="bi bi-send"></i>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
