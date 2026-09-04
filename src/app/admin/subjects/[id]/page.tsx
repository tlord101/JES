'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { subjectsStore, departmentsStore } from '@/lib/academicStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminSubjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const subjectId = resolvedParams.id;

  const subject = subjectsStore.find((s) => s.id === subjectId) || subjectsStore[0];

  const [code, setCode] = useState(subject.code);
  const [name, setName] = useState(subject.name);
  const [description, setDescription] = useState(subject.description);
  const [targetClass, setTargetClass] = useState(subject.targetClass);
  const [teacherName, setTeacherName] = useState(subject.teacherName);
  const [departmentId, setDepartmentId] = useState(subject.departmentId);
  const [msg, setMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    subject.code = code;
    subject.name = name;
    subject.description = description;
    subject.targetClass = targetClass;
    subject.teacherName = teacherName;
    subject.departmentId = departmentId;

    logAuditEvent('Subject Updated', 'System', `Updated subject details for ${subject.name} (${subject.code})`);
    setMsg('Subject details updated successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/subjects" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Subjects Directory
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">{subject.name}</h1>
          <p className="text-[var(--muted-text)] font-mono">Code: {subject.code}</p>
        </div>
      </div>

      {msg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold rounded">{msg}</div>}

      <form onSubmit={handleSave} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
          Subject Details & Instructor
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Subject Code *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-mono font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-bold"
            >
              {departmentsStore.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Subject Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Target Classes</label>
            <input
              type="text"
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Lead Instructor Name</label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Subject Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded"
          ></textarea>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded">
            Save Subject Changes
          </button>
        </div>
      </form>
    </div>
  );
}
