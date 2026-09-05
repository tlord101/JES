'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockStaffProfile, mockStaffStudents } from '@/lib/staffData';

export default function StaffClassAttendancePage({ params }: { params: { classId: string } }) {
  const cls = mockStaffProfile.assignedClasses.find((c) => c.id === params.classId);
  if (!cls) {
    notFound();
  }

  const students = mockStaffStudents.filter((s) => s.classId === cls.id);
  const [selectedDate, setSelectedDate] = useState('2025-03-24');
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>(() => {
    const initial: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach((s) => {
      initial[s.id] = 'present';
    });
    return initial;
  });

  const [savedMsg, setSavedMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const setAllStatus = (status: 'present' | 'absent' | 'late') => {
    const updated: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendance(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSavedMsg('');

    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    try {
      const res = await fetch('/api/staff/attendance/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: cls.id, date: selectedDate, records }),
      });

      if (res.ok) {
        setSavedMsg('Attendance register saved successfully!');
      } else {
        setSavedMsg('Failed to save attendance register.');
      }
    } catch {
      setSavedMsg('Network error while saving register.');
    } finally {
      setIsSaving(false);
    }
  };

  const counts = {
    present: Object.values(attendance).filter((s) => s === 'present').length,
    absent: Object.values(attendance).filter((s) => s === 'absent').length,
    late: Object.values(attendance).filter((s) => s === 'late').length,
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/staff/attendance" className="text-xs text-blue-600 hover:underline">
            &larr; Back to Registers
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{cls.name} Class Register</h1>
          <p className="text-sm text-slate-500">Form Teacher Daily Attendance Tracking</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600">Register Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          />
        </div>
      </div>

      {/* Summary Cards & Bulk Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex gap-4 text-xs font-bold">
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
            Present: {counts.present}
          </span>
          <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-lg">
            Absent: {counts.absent}
          </span>
          <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg">
            Late: {counts.late}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Bulk Mark:</span>
          <button
            type="button"
            onClick={() => setAllStatus('present')}
            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors"
          >
            All Present
          </button>
          <button
            type="button"
            onClick={() => setAllStatus('absent')}
            className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
          >
            All Absent
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className={`p-3 rounded-xl text-xs font-bold ${savedMsg.includes('successfully') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {savedMsg}
        </div>
      )}

      {/* Register List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase bg-slate-50">
                <th className="py-2.5 px-3">Admission No</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-medium text-slate-600">{std.admissionNo}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{std.name}</td>
                  <td className="py-3 px-3">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(std.id, 'present')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          attendance[std.id] === 'present'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(std.id, 'absent')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          attendance[std.id] === 'absent'
                            ? 'bg-red-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(std.id, 'late')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          attendance[std.id] === 'late'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Late
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? 'Saving Register...' : 'Save Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
