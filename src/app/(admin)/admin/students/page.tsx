'use client';

import { useState } from 'react';
import Link from 'next/link';
import { studentsStore, StudentRecord } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([...studentsStore]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('');
  const [studentClass, setStudentClass] = useState('SS 1 Blue');
  const [parentName, setParentName] = useState('');

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
      s.class.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !admissionNo) return;

    const newStudent: StudentRecord = {
      id: `std_${Date.now()}`,
      admissionNo,
      name,
      gender,
      dob: dob || '2009-01-01',
      class: studentClass,
      parentId: 'prt_01',
      parentName: parentName || 'Parent / Guardian',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      session: '2024/2025',
      status: 'Active',
    };

    studentsStore.push(newStudent);
    setStudents([...studentsStore]);
    logAuditEvent('Student Created', 'Student', `Enrolled new student ${name} (${admissionNo}) into ${studentClass}`);

    setName('');
    setAdmissionNo('');
    setParentName('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Student Information System (SIS)</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage student academic profiles, admission numbers, class placement, and parent associations.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-person-plus-fill"></i>
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 border border-[var(--border)] rounded flex items-center text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search student by name, admission no, or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
          />
          <i className="bi bi-search absolute left-2.5 top-2.5 text-[var(--muted-text)]"></i>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
                <th className="p-3">Admission No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Class</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Parent / Guardian</th>
                <th className="p-3">Academic Session</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[var(--soft-bg)] transition-colors">
                  <td className="p-3 font-mono text-[11px] font-bold text-[var(--primary-dark)]">{s.admissionNo}</td>
                  <td className="p-3 font-bold text-[var(--text)]">
                    <Link href={`/admin/students/${s.id}`} className="hover:underline">
                      {s.name}
                    </Link>
                  </td>
                  <td className="p-3 font-semibold">{s.class}</td>
                  <td className="p-3 text-[var(--muted-text)]">{s.gender}</td>
                  <td className="p-3 font-medium text-[var(--text)]">{s.parentName}</td>
                  <td className="p-3 text-[var(--muted-text)]">{s.session}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/students/${s.id}`}
                      className="px-2.5 py-1 bg-white border border-[var(--border)] text-[var(--text)] font-bold rounded hover:bg-[var(--soft-bg)]"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-[var(--border)] rounded max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Enroll Student Record</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chinedu Okafor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Admission Number *</label>
                <input
                  type="text"
                  required
                  placeholder="JES/2025/140"
                  value={admissionNo}
                  onChange={(e) => setAdmissionNo(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
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
                  <label className="block font-semibold mb-1">Class Placement</label>
                  <input
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full p-2 border border-[var(--border)] rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Parent Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Emmanuel Okafor"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
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
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
