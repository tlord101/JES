'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { studentsStore, StudentRecord } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const student = studentsStore.find((s) => s.id === studentId) || studentsStore[0];

  const [name, setName] = useState(student.name);
  const [admissionNo, setAdmissionNo] = useState(student.admissionNo);
  const [studentClass, setStudentClass] = useState(student.class);
  const [gender, setGender] = useState<'Male' | 'Female'>(student.gender);
  const [parentName, setParentName] = useState(student.parentName);
  const [status, setStatus] = useState(student.status);
  const [msg, setMsg] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    student.name = name;
    student.admissionNo = admissionNo;
    student.class = studentClass;
    student.gender = gender;
    student.parentName = parentName;
    student.status = status;

    logAuditEvent('Student Record Updated', 'Student', `Updated academic profile for ${student.name} (${student.admissionNo})`);
    setMsg('Student profile updated successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/students" className="text-xs font-bold text-[var(--primary)] hover:underline">
            ← Back to Student Roster
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">{student.name}</h1>
          <p className="text-xs text-[var(--muted-text)] font-mono">Admission No: {student.admissionNo}</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded">
          {student.status}
        </span>
      </div>

      {msg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded">{msg}</div>}

      <form onSubmit={handleUpdate} className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
        <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
          Academic & Personal Record
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Student Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Admission Number</label>
            <input
              type="text"
              required
              value={admissionNo}
              onChange={(e) => setAdmissionNo(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Class Placement</label>
            <input
              type="text"
              required
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
              className="w-full p-2 border border-[var(--border)] rounded"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Parent / Guardian Name</label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Enrollment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-2 border border-[var(--border)] rounded font-bold"
            >
              <option value="Active">Active Enrolled</option>
              <option value="Graduated">Graduated Alumni</option>
              <option value="Suspended">Suspended</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded">
            Save Student Changes
          </button>
        </div>
      </form>
    </div>
  );
}
