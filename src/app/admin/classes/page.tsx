'use client';

import { useState } from 'react';
import Link from 'next/link';
import { classesStore, AcademicClass } from '@/lib/academicStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminClassesPage() {
  const [classesList, setClassesList] = useState<AcademicClass[]>([...classesStore]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [level, setLevel] = useState<'Nursery' | 'Primary' | 'Junior Secondary' | 'Senior Secondary'>('Junior Secondary');
  const [classTeacher, setClassTeacher] = useState('Mr. Osagie Aghedo');
  const [capacity, setCapacity] = useState(35);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newCls: AcademicClass = {
      id: `cls_${Date.now()}`,
      name,
      level,
      classTeacher,
      capacity,
      enrolledCount: 0,
      sessionId: 'sess_1',
      subjectIds: ['sub_mth', 'sub_eng'],
    };

    classesStore.push(newCls);
    setClassesList([...classesStore]);
    logAuditEvent('Class Created', 'System', `Created academic class section "${name}" with teacher ${classTeacher}`);

    setName('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Class Management Directory</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Configure Nursery, Primary, JSS, and SS class arms, assigned form teachers, and enrolled student rosters.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-building-add"></i>
          <span>Create Class Section</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classesList.map((c) => (
          <div key={c.id} className="bg-white p-5 border border-[var(--border)] rounded flex flex-col justify-between space-y-3">
            <div>
              <div className="flex justify-between items-start border-b border-[var(--border)] pb-2">
                <div>
                  <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded">
                    {c.level}
                  </span>
                  <h3 className="font-bold text-base text-[var(--primary-dark)] mt-1">{c.name}</h3>
                </div>
                <span className="font-mono font-bold text-slate-500">{c.enrolledCount}/{c.capacity} Enrolled</span>
              </div>

              <div className="mt-3 space-y-1.5 text-slate-700">
                <div>
                  <span className="font-semibold text-[var(--muted-text)]">Form Teacher:</span>{' '}
                  <strong className="text-[var(--text)]">{c.classTeacher}</strong>
                </div>
                <div>
                  <span className="font-semibold text-[var(--muted-text)]">Academic Session:</span> 2024/2025
                </div>
                <div>
                  <span className="font-semibold text-[var(--muted-text)]">Allocated Subjects:</span>{' '}
                  <span className="font-bold text-[var(--primary)]">{c.subjectIds.length} Subjects</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href={`/admin/classes/${c.id}`}
                className="px-3 py-1 bg-white border border-[var(--border)] text-[var(--text)] font-bold rounded hover:bg-[var(--soft-bg)]"
              >
                Manage Roster & Subjects
              </Link>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-[var(--border)] rounded max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Create Class Section</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Class Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JSS 1 Red or SS 3 Arts"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Education Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full p-2 border border-[var(--border)] rounded font-bold"
                >
                  <option value="Nursery">Nursery</option>
                  <option value="Primary">Primary</option>
                  <option value="Junior Secondary">Junior Secondary</option>
                  <option value="Senior Secondary">Senior Secondary</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Assigned Form Teacher</label>
                <input
                  type="text"
                  value={classTeacher}
                  onChange={(e) => setClassTeacher(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Classroom Capacity</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[var(--border)] font-bold rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
