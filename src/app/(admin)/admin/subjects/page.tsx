'use client';

import { useState } from 'react';
import Link from 'next/link';
import { subjectsStore, departmentsStore, AcademicSubject } from '@/lib/academicStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<AcademicSubject[]>([...subjectsStore]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetClass, setTargetClass] = useState('All Classes');
  const [teacherName, setTeacherName] = useState('Mr. Osagie Aghedo');
  const [departmentId, setDepartmentId] = useState('dept_math');

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.teacherName.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    const newSub: AcademicSubject = {
      id: `sub_${Date.now()}`,
      code: code.toUpperCase(),
      name,
      description,
      targetClass,
      teacherName,
      departmentId,
    };

    subjectsStore.push(newSub);
    setSubjects([...subjectsStore]);
    logAuditEvent('Subject Created', 'System', `Created academic subject ${name} (${code}) taught by ${teacherName}`);

    setCode('');
    setName('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Subject Directory & Course Catalog</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage curriculum subjects, subject codes, assigned lead instructors, and academic departments.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-journal-plus"></i>
          <span>Add Subject</span>
        </button>
      </div>

      <div className="bg-white p-4 border border-[var(--border)] rounded flex items-center text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search subject by code, title, or teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
          />
          <i className="bi bi-search absolute left-2.5 top-2.5 text-[var(--muted-text)]"></i>
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Subject Code</th>
              <th className="p-3">Subject Name</th>
              <th className="p-3">Target Classes</th>
              <th className="p-3">Lead Educator</th>
              <th className="p-3">Department</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map((s) => {
              const dept = departmentsStore.find((d) => d.id === s.departmentId);
              return (
                <tr key={s.id} className="hover:bg-[var(--soft-bg)]">
                  <td className="p-3 font-mono font-bold text-[var(--primary-dark)]">{s.code}</td>
                  <td className="p-3 font-bold text-[var(--text)]">
                    <Link href={`/admin/subjects/${s.id}`} className="hover:underline">
                      {s.name}
                    </Link>
                  </td>
                  <td className="p-3 text-[var(--muted-text)]">{s.targetClass}</td>
                  <td className="p-3 font-semibold text-[var(--text)]">{s.teacherName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded">
                      {dept ? dept.name : 'General'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/subjects/${s.id}`}
                      className="px-2.5 py-1 bg-white border border-[var(--border)] text-[var(--text)] font-bold rounded hover:bg-[var(--soft-bg)]"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-[var(--border)] rounded max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Create Academic Subject</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="MTH101"
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
                  placeholder="e.g. Mathematics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Classes</label>
                <input
                  type="text"
                  placeholder="e.g. JSS 1 - SS 3"
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Lead Instructor / Teacher</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                ></textarea>
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
