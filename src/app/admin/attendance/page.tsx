'use client';

import { useState } from 'react';
import Link from 'next/link';
import { attendanceStore, classesStore, AttendanceRecord } from '@/lib/academicStore';
import { studentsStore } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminAttendancePage() {
  const [selectedClass, setSelectedClass] = useState('cls_ss1b');
  const [selectedDate, setSelectedDate] = useState('2025-02-12');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([...attendanceStore]);
  const [savedMsg, setSavedMsg] = useState('');

  const cls = classesStore.find((c) => c.id === selectedClass) || classesStore[0];
  const classStudents = studentsStore.filter(
    (s) => s.class.toLowerCase() === cls.name.toLowerCase() || cls.name.includes(s.class)
  );

  const getStatus = (studentId: string): 'Present' | 'Absent' | 'Late' => {
    const rec = attendance.find((a) => a.studentId === studentId && a.date === selectedDate);
    return rec ? rec.status : 'Present';
  };

  const setStatus = (studentId: string, studentName: string, status: 'Present' | 'Absent' | 'Late') => {
    const idx = attendance.findIndex((a) => a.studentId === studentId && a.date === selectedDate);
    if (idx !== -1) {
      attendance[idx].status = status;
    } else {
      attendance.push({
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        date: selectedDate,
        classId: cls.id,
        className: cls.name,
        studentId,
        studentName,
        status,
      });
    }
    setAttendance([...attendance]);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    logAuditEvent('Attendance Recorded', 'System', `Recorded daily attendance for class ${cls.name} on ${selectedDate}`);
    setSavedMsg(`Attendance register for ${cls.name} saved successfully!`);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Daily Attendance Register</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Mark daily class attendance (Present, Absent, Late) and generate termly attendance summaries.
          </p>
        </div>
        <Link
          href="/admin/attendance/reports"
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-bar-chart-line-fill"></i>
          <span>Attendance Analytics Reports</span>
        </Link>
      </div>

      {savedMsg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold rounded">{savedMsg}</div>}

      {/* Class and Date Selectors */}
      <div className="bg-white p-4 border border-[var(--border)] rounded flex flex-col sm:flex-row items-center gap-4">
        <div>
          <label className="block font-semibold mb-1">Select Class Arm</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="p-2 border border-[var(--border)] rounded font-bold"
          >
            {classesStore.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.level})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Attendance Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-[var(--border)] rounded font-mono font-bold"
          />
        </div>
      </div>

      {/* Attendance Register Table */}
      <form onSubmit={handleSaveAttendance} className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="p-4 font-bold text-sm text-[var(--primary-dark)] border-b border-[var(--border)] flex justify-between items-center">
          <span>Daily Register — {cls.name} ({selectedDate})</span>
          <span className="text-xs text-[var(--muted-text)]">Form Teacher: {cls.classTeacher}</span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Admission No</th>
              <th className="p-3">Student Name</th>
              <th className="p-3 text-center">Present</th>
              <th className="p-3 text-center">Absent</th>
              <th className="p-3 text-center">Late</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {classStudents.map((s) => {
              const currentStatus = getStatus(s.id);
              return (
                <tr key={s.id} className="hover:bg-[var(--soft-bg)]">
                  <td className="p-3 font-mono font-bold text-[var(--primary-dark)]">{s.admissionNo}</td>
                  <td className="p-3 font-bold text-[var(--text)]">{s.name}</td>

                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => setStatus(s.id, s.name, 'Present')}
                      className={`px-3 py-1 font-bold rounded text-[11px] ${
                        currentStatus === 'Present'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                      }`}
                    >
                      Present
                    </button>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => setStatus(s.id, s.name, 'Absent')}
                      className={`px-3 py-1 font-bold rounded text-[11px] ${
                        currentStatus === 'Absent'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                      }`}
                    >
                      Absent
                    </button>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => setStatus(s.id, s.name, 'Late')}
                      className={`px-3 py-1 font-bold rounded text-[11px] ${
                        currentStatus === 'Late'
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
                      }`}
                    >
                      Late
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="p-4 bg-[var(--soft-bg)] border-t border-[var(--border)] flex justify-end">
          <button type="submit" className="px-6 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]">
            Save Register
          </button>
        </div>
      </form>
    </div>
  );
}
