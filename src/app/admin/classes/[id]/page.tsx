'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { classesStore, subjectsStore } from '@/lib/academicStore';
import { studentsStore } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const classId = resolvedParams.id;

  const classItem = classesStore.find((c) => c.id === classId) || classesStore[0];

  const [name, setName] = useState(classItem.name);
  const [classTeacher, setClassTeacher] = useState(classItem.classTeacher);
  const [capacity, setCapacity] = useState(classItem.capacity);
  const [msg, setMsg] = useState('');

  const enrolledStudents = studentsStore.filter(
    (s) => s.class.toLowerCase() === classItem.name.toLowerCase() || classItem.name.includes(s.class)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    classItem.name = name;
    classItem.classTeacher = classTeacher;
    classItem.capacity = capacity;

    logAuditEvent('Class Section Updated', 'System', `Updated class configuration for ${classItem.name}`);
    setMsg('Class details saved successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/classes" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Class Directory
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">{classItem.name}</h1>
          <p className="text-[var(--muted-text)] font-semibold">Level: {classItem.level} • Session 2024/2025</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded">
          {enrolledStudents.length} Students Enrolled
        </span>
      </div>

      {msg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold rounded">{msg}</div>}

      <form onSubmit={handleSave} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
          Class Configuration & Form Teacher Allocation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-1">Class Section Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Assigned Form Teacher</label>
            <input
              type="text"
              required
              value={classTeacher}
              onChange={(e) => setClassTeacher(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Class Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full p-2 border border-[var(--border)] rounded font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded">
            Save Class Config
          </button>
        </div>
      </form>

      {/* Enrolled Students Roster */}
      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="p-4 font-bold text-sm text-[var(--primary-dark)] border-b border-[var(--border)]">
          Class Roster — Enrolled Students
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Admission No</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Parent Name</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {enrolledStudents.map((s) => (
              <tr key={s.id} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-mono font-bold text-[var(--primary-dark)]">{s.admissionNo}</td>
                <td className="p-3 font-bold text-[var(--text)]">{s.name}</td>
                <td className="p-3 text-[var(--muted-text)]">{s.gender}</td>
                <td className="p-3 text-[var(--text)]">{s.parentName}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/students/${s.id}`}
                    className="px-2.5 py-1 bg-white border border-[var(--border)] font-bold rounded hover:bg-[var(--soft-bg)]"
                  >
                    View Student Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
