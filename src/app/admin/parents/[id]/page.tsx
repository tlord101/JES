'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { parentsStore } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function ParentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const parentId = resolvedParams.id;

  const parent = parentsStore.find((p) => p.id === parentId) || parentsStore[0];

  const [name, setName] = useState(parent.name);
  const [email, setEmail] = useState(parent.email);
  const [phone, setPhone] = useState(parent.phone);
  const [address, setAddress] = useState(parent.address);
  const [wardStr, setWardStr] = useState(parent.wardNames.join(', '));
  const [msg, setMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    parent.name = name;
    parent.email = email;
    parent.phone = phone;
    parent.address = address;
    parent.wardNames = wardStr.split(',').map((s) => s.trim());

    logAuditEvent('Parent Profile Updated', 'Parent', `Updated directory record for parent ${parent.name}`);
    setMsg('Parent record updated successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/parents" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Parent Directory
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">{parent.name}</h1>
          <p className="text-[var(--muted-text)] font-mono">{parent.email}</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded">
          {parent.status}
        </span>
      </div>

      {msg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold rounded">{msg}</div>}

      <form onSubmit={handleSave} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
          Contact & Ward Association Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Parent / Guardian Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Associated Student Wards (Comma-separated)</label>
            <input
              type="text"
              value={wardStr}
              onChange={(e) => setWardStr(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-bold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Residential Contact Address</label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded"
            ></textarea>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded">
            Save Parent Record
          </button>
        </div>
      </form>
    </div>
  );
}
