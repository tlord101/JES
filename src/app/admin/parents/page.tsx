'use client';

import { useState } from 'react';
import Link from 'next/link';
import { parentsStore, ParentRecord } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminParentsPage() {
  const [parents, setParents] = useState<ParentRecord[]>([...parentsStore]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [wardNames, setWardNames] = useState('');

  const filtered = parents.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const wardsArr = wardNames
      ? wardNames.split(',').map((w) => w.trim())
      : ['Student Ward'];

    const newParent: ParentRecord = {
      id: `prt_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone,
      address,
      wardIds: ['std_01'],
      wardNames: wardsArr,
      status: 'Active',
    };

    parentsStore.push(newParent);
    setParents([...parentsStore]);
    logAuditEvent('Parent Record Created', 'Parent', `Created parent directory profile for ${name} (${email})`);

    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setWardNames('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Parent & Guardian Directory</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage registered parent accounts, contact details, residential addresses, and associated student wards.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-person-plus-fill"></i>
          <span>Add Parent Record</span>
        </button>
      </div>

      <div className="bg-white p-4 border border-[var(--border)] rounded flex items-center text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search parent by name, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
          />
          <i className="bi bi-search absolute left-2.5 top-2.5 text-[var(--muted-text)]"></i>
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Parent Name</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Phone Number</th>
              <th className="p-3">Associated Wards</th>
              <th className="p-3">Residential Address</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--soft-bg)] transition-colors">
                <td className="p-3 font-bold text-[var(--primary-dark)]">
                  <Link href={`/admin/parents/${p.id}`} className="hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="p-3 font-mono text-[var(--text)]">{p.email}</td>
                <td className="p-3 font-semibold">{p.phone}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {p.wardNames.map((w, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] text-[10px] font-bold rounded"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-[var(--muted-text)] max-w-xs truncate">{p.address}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/parents/${p.id}`}
                    className="px-2.5 py-1 bg-white border border-[var(--border)] text-[var(--text)] font-bold rounded hover:bg-[var(--soft-bg)]"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-[var(--border)] rounded max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Create Parent Record</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Parent Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mrs. Florence Amadasun"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="florence@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Associated Wards (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. David Okafor, Chinecherem Okafor"
                  value={wardNames}
                  onChange={(e) => setWardNames(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  placeholder="Home address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  Save Parent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
