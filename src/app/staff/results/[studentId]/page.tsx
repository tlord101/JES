'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockStaffStudents, mockDraftResults } from '@/lib/staffData';

export default function StaffStudentResultDetailPage({ params }: { params: { studentId: string } }) {
  const student = mockStaffStudents.find((s) => s.id === params.studentId);
  if (!student) {
    notFound();
  }

  const existingResult = mockDraftResults.find((r) => r.studentId === student.id) || {
    studentId: student.id,
    studentName: student.name,
    classId: student.classId,
    subject: 'Mathematics',
    ca1: 15,
    ca2: 16,
    exam: 50,
    teacherRemark: 'Good effort, continue practicing problem sets.',
    status: 'draft' as const,
  };

  const [ca1, setCa1] = useState(existingResult.ca1);
  const [ca2, setCa2] = useState(existingResult.ca2);
  const [exam, setExam] = useState(existingResult.exam);
  const [remark, setRemark] = useState(existingResult.teacherRemark);
  const [msg, setMsg] = useState('');

  const total = ca1 + ca2 + exam;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Draft result updated for ' + student.name);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Link href="/staff/results" className="text-xs text-blue-600 hover:underline">
          &larr; Back to Results Overview
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Individual Score Entry: {student.name}</h1>
        <p className="text-sm text-slate-500">
          Admission No: {student.admissionNo} • Class: {student.className}
        </p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl">
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">CA 1 (Max 20)</label>
            <input
              type="number"
              max={20}
              min={0}
              value={ca1}
              onChange={(e) => setCa1(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">CA 2 (Max 20)</label>
            <input
              type="number"
              max={20}
              min={0}
              value={ca2}
              onChange={(e) => setCa2(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Score (Max 60)</label>
            <input
              type="number"
              max={60}
              min={0}
              value={exam}
              onChange={(e) => setExam(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none"
            />
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold text-blue-900 uppercase">Calculated Total</span>
          <span className="text-xl font-bold text-blue-800">{total} / 100</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Teacher Performance Remark</label>
          <textarea
            rows={3}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium outline-none"
          />
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Link
            href="/staff/results"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
          >
            Save Draft Score
          </button>
        </div>
      </form>
    </div>
  );
}
