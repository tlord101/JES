'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usersStore, UserType } from '@/lib/db';
import { logAuditEvent, auditLogsStore } from '@/lib/auditStore';

const ROLES: UserType[] = [
  'Super Admin',
  'Administrator',
  'Principal',
  'Vice Principal',
  'HOD',
  'Teacher',
  'Accountant',
  'Parent',
  'Student',
  'Alumni',
];

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const userId = resolvedParams.id;

  const user = usersStore.find((u) => u.id === userId) || usersStore[0];

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [role, setRole] = useState<UserType>(user.role);
  const [isActive, setIsActive] = useState(user.isActive);
  const [newPassword, setNewPassword] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const userLogs = auditLogsStore.filter(
    (l) => l.userEmail.toLowerCase() === user.email.toLowerCase()
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    user.name = name;
    user.email = email.toLowerCase();
    user.phone = phone;
    user.role = role;
    user.isActive = isActive;
    user.updatedAt = new Date().toISOString();

    if (newPassword) {
      logAuditEvent('Password Reset', 'User', `Admin reset password for user ${user.email}`);
      setNewPassword('');
    }

    logAuditEvent('User Account Updated', 'User', `Updated profile and credentials for user ${user.email}`);
    setSavedMsg('User record updated successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 border border-[var(--border)] rounded">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/users" className="text-xs font-bold text-[var(--primary)] hover:underline">
              ← Back to Users
            </Link>
            <span className="text-xs text-[var(--muted-text)]">• Account ID: {user.id}</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">{user.name}</h1>
          <p className="text-xs text-[var(--muted-text)]">{user.email}</p>
        </div>
        <span
          className={`px-3 py-1 font-bold text-xs rounded ${
            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {user.isActive ? 'Active Account' : 'Account Disabled'}
        </span>
      </div>

      {savedMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded font-bold">
          {savedMsg}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
          <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
            <i className="bi bi-person-lines-fill text-[var(--primary)]"></i>
            <span>Account Details & RBAC Role</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Full Name</label>
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
              <label className="block font-semibold mb-1">Assigned Role Category</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserType)}
                className="w-full p-2 border border-[var(--border)] rounded font-bold"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Account Active Status</label>
              <select
                value={isActive ? 'Active' : 'Disabled'}
                onChange={(e) => setIsActive(e.target.value === 'Active')}
                className="w-full p-2 border border-[var(--border)] rounded font-bold"
              >
                <option value="Active">Active Account</option>
                <option value="Disabled">Disabled / Suspended</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Admin Password Override</label>
              <input
                type="password"
                placeholder="Enter new password to override..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-[var(--border)] rounded"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="submit"
              className="px-5 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)]"
            >
              Save User Changes
            </button>
          </div>
        </div>
      </form>

      {/* User Activity Log */}
      <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
          <i className="bi bi-clock-history text-[var(--primary)]"></i>
          <span>Account Audit Activity Trail</span>
        </h2>
        {userLogs.length === 0 ? (
          <p className="text-xs text-[var(--muted-text)]">No specific activity logs recorded for this user email.</p>
        ) : (
          <div className="space-y-2 text-xs">
            {userLogs.map((log) => (
              <div key={log.id} className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex justify-between items-center">
                <div>
                  <div className="font-bold text-[var(--text)]">{log.action}</div>
                  <div className="text-[11px] text-[var(--muted-text)]">{log.details}</div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{log.timestamp.substring(0, 10)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
