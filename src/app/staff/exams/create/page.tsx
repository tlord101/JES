'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function StaffCreateExamPage() {
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Mathematics',
    classId: 'ss1-blue',
    date: '',
    durationMinutes: '45',
    totalMarks: '60',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Link href="/staff/exams" className="text-xs text-blue-600 hover:underline">
          &larr; Back to CBT Exams
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Create CBT Exam</h1>
        <p className="text-sm text-slate-500">Configure online test schedule and total marks.</p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl space-y-3">
          <div className="font-bold text-base flex items-center gap-2">
            <i className="bi bi-check-circle-fill text-lg text-emerald-600"></i> CBT Exam Scheduled
            Successfully!
          </div>
          <p className="text-xs">
            Now proceed to link question items from your CBT Question Bank to populate this test paper.
          </p>
          <Link
            href="/staff/exams/exam-401/questions"
            className="inline-block px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 transition-colors"
          >
            Attach Question Items &rarr;
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Mid-Term CBT Examination in Mathematics"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Further Mathematics">Further Mathematics</option>
                <option value="Basic Technology">Basic Technology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class</label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="ss1-blue">SS 1 Blue</option>
                <option value="jss2-gold">JSS 2 Gold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                required
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Exam Marks</label>
              <input
                type="number"
                required
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Link
              href="/staff/exams"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              Save CBT Exam
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
