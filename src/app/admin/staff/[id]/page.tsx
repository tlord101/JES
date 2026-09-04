'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { staffRecordsStore } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const staffId = resolvedParams.id;

  const staff = staffRecordsStore.find((s) => s.id === staffId) || staffRecordsStore[0];

  const [name, setName] = useState(staff.name);
  const [position, setPosition] = useState(staff.position);
  const [department, setDepartment] = useState(staff.department);
  const [subjectsStr, setSubjectsStr] = useState(staff.subjects.join(', '));
  const [qualifications, setQualifications] = useState(staff.qualifications);
  const [biography, setBiography] = useState(staff.biography);
  const [status, setStatus] = useState(staff.status);
  const [msg, setMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    staff.name = name;
    staff.position = position;
    staff.department = department;
    staff.subjects = subjectsStr.split(',').map((s) => s.trim());
    staff.qualifications = qualifications;
    staff.biography = biography;
    staff.status = status as any;

    logAuditEvent('Staff Record Updated', 'Staff', `Updated staff directory profile for ${staff.name}`);
    setMsg('Staff profile updated successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/staff" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Staff Directory
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">{staff.name}</h1>
          <p className="text-[var(--muted-text)] font-semibold">{staff.position}</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded">
          {staff.status}
        </span>
      </div>

      {msg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold rounded">{msg}</div>}

      <form onSubmit={handleSave} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
          Faculty Details & Departmental Allocation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Staff Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Position / Designation</label>
            <input
              type="text"
              required
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
              className="w-full p-2 border border-[var(--border)] rounded font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Assigned Subjects (Comma-separated)</label>
            <input
              type="text"
              value={subjectsStr}
              onChange={(e) => setSubjectsStr(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Qualifications</label>
            <input
              type="text"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Staff Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-2 border border-[var(--border)] rounded font-bold"
            >
              <option value="Active">Active Faculty</option>
              <option value="On Leave">On Leave</option>
              <option value="Resigned">Resigned</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Professional Biography</label>
            <textarea
              rows={4}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            ></textarea>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded">
            Save Staff Profile
          </button>
        </div>
      </form>
    </div>
  );
}
