'use client';

import { useState } from 'react';
import Link from 'next/link';
import { staffRecordsStore, StaffRecord } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<StaffRecord[]>([...staffRecordsStore]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('Sciences');
  const [subjects, setSubjects] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [biography, setBiography] = useState('');

  const filtered = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.position.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position) return;

    const newStaff: StaffRecord = {
      id: `stf_${Date.now()}`,
      name,
      position,
      department,
      subjects: subjects ? subjects.split(',').map((s) => s.trim()) : ['General'],
      qualifications: qualifications || 'B.Ed',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      biography: biography || 'Dedicated faculty member at Jasmine Exclusive School.',
      status: 'Active',
    };

    staffRecordsStore.push(newStaff);
    setStaffList([...staffRecordsStore]);
    logAuditEvent('Staff Member Created', 'Staff', `Added staff directory profile for ${name} (${position})`);

    setName('');
    setPosition('');
    setSubjects('');
    setQualifications('');
    setBiography('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Staff & Faculty Directory</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage teaching and non-teaching staff, departmental designations, subject allocations, and qualifications.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-person-plus-fill"></i>
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="bg-white p-4 border border-[var(--border)] rounded flex items-center text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search staff by name, position, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
          />
          <i className="bi bi-search absolute left-2.5 top-2.5 text-[var(--muted-text)]"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className="bg-white p-5 border border-[var(--border)] rounded flex gap-4 text-xs">
            <img
              src={s.photo}
              alt={s.name}
              className="w-16 h-16 rounded object-cover border border-[var(--border)] flex-shrink-0"
            />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-[var(--primary-dark)]">{s.name}</h3>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">
                  {s.status}
                </span>
              </div>
              <div className="font-semibold text-[var(--text)]">{s.position}</div>
              <div className="text-[var(--muted-text)] font-semibold">Department: {s.department}</div>
              <div className="text-[11px] text-slate-500 font-mono">Qualifications: {s.qualifications}</div>
              <div className="pt-2 flex justify-end">
                <Link
                  href={`/admin/staff/${s.id}`}
                  className="px-3 py-1 bg-white border border-[var(--border)] font-bold rounded hover:bg-[var(--soft-bg)]"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-[var(--border)] rounded max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Add Staff Member</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Osagie Aghedo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Position / Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Head of Mathematics"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Assigned Subjects (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Mathematics, Further Mathematics"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Qualifications</label>
                <input
                  type="text"
                  placeholder="e.g. B.Sc, PGDE, M.Sc"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
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
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
