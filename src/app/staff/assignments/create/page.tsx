'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function StaffCreateAssignmentPage() {
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Mathematics',
    classId: 'ss1-blue',
    dueDate: '',
    maxScore: '20',
    instructions: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Link href="/staff/assignments" className="text-xs text-blue-600 hover:underline">
          &larr; Back to Assignments
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Create New Assignment</h1>
        <p className="text-sm text-slate-500">Publish coursework or homework to students.</p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl space-y-3">
          <div className="font-bold text-base flex items-center gap-2">
            <i className="bi bi-check-circle-fill text-lg text-emerald-600"></i> Assignment Published
            Successfully!
          </div>
          <p className="text-xs">
            Students in the selected class have been notified. You can now view submissions in the assignment manager.
          </p>
          <Link
            href="/staff/assignments"
            className="inline-block px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 transition-colors"
          >
            Return to Assignments
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Quadratic Equations & Parabolas Worksheet"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max Score (Marks)</label>
              <input
                type="number"
                required
                value={formData.maxScore}
                onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Instructions & Guidelines</label>
            <textarea
              rows={4}
              required
              placeholder="Provide clear steps for students..."
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Link
              href="/staff/assignments"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              Publish Assignment
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
