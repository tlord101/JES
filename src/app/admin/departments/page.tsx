'use client';

import { useState } from 'react';
import { departmentsStore, Department } from '@/lib/academicStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([...departmentsStore]);
  const [showModal, setShowModal] = useState(false);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [hodName, setHodName] = useState('Mr. Osagie Aghedo');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    const newDept: Department = {
      id: `dept_${Date.now()}`,
      code: code.toUpperCase(),
      name,
      hodName,
      description,
    };

    departmentsStore.push(newDept);
    setDepartments([...departmentsStore]);
    logAuditEvent('Department Created', 'System', `Created academic department ${name} (${code})`);

    setCode('');
    setName('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Academic Departments Directory</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage academic faculties, departmental codes, and appointed Heads of Department (HOD).
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-diagram-3-fill"></i>
          <span>Create Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((d) => (
          <div key={d.id} className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <span className="font-bold text-base text-[var(--primary-dark)]">{d.name}</span>
              <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-mono font-bold text-[10px] rounded">
                {d.code}
              </span>
            </div>
            <div>
              <span className="font-semibold text-[var(--muted-text)]">Head of Department (HOD):</span>{' '}
              <strong className="text-[var(--text)]">{d.hodName}</strong>
            </div>
            <p className="text-slate-600 leading-relaxed pt-1">{d.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-[var(--border)] rounded max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Create Department</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Dept Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="MTH"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2 border border-[var(--border)] rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Head of Dept (HOD)</label>
                  <input
                    type="text"
                    value={hodName}
                    onChange={(e) => setHodName(e.target.value)}
                    className="w-full p-2 border border-[var(--border)] rounded font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics & Computing"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description & Subject Scope</label>
                <textarea
                  rows={3}
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
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
