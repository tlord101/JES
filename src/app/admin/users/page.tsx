'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usersStore, User, UserType } from '@/lib/db';
import { logAuditEvent } from '@/lib/auditStore';

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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([...usersStore]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // New user modal states
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserType>('Teacher');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (target) {
      target.isActive = !target.isActive;
      setUsers([...users]);
      logAuditEvent(
        'User Status Toggled',
        'User',
        `Toggled active status for user ${target.email} to ${target.isActive ? 'Active' : 'Disabled'}`
      );
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      passwordHash: 'hashed_placeholder',
      phone,
      role,
      isActive: true,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersStore.push(newUser);
    setUsers([...usersStore]);
    logAuditEvent('User Created', 'User', `Created new user account for ${email} with role ${role}`);

    setName('');
    setEmail('');
    setPhone('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">User Account Management</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage system access accounts, assign role categories, enable/disable users, and reset credentials.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-person-plus-fill"></i>
          <span>Create New User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 border border-[var(--border)] rounded flex flex-col sm:flex-row items-center gap-4 text-xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
          />
          <i className="bi bi-search absolute left-2.5 top-2.5 text-[var(--muted-text)]"></i>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="font-bold text-[var(--muted-text)] whitespace-nowrap">Role Filter:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] rounded bg-white font-bold text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
          >
            <option value="ALL">All Roles ({users.length})</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
                <th className="p-3">User Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Phone Number</th>
                <th className="p-3">Account Status</th>
                <th className="p-3">Email Verified</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--soft-bg)] transition-colors">
                  <td className="p-3 font-bold text-[var(--primary-dark)]">
                    <Link href={`/admin/users/${u.id}`} className="hover:underline">
                      {u.name}
                    </Link>
                  </td>
                  <td className="p-3 text-[var(--text)] font-mono">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded border border-blue-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-[var(--muted-text)]">{u.phone || 'N/A'}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 font-bold text-[10px] rounded ${
                        u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 font-bold text-[10px] rounded ${
                        u.isEmailVerified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {u.isEmailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="px-2.5 py-1 bg-white border border-[var(--border)] text-[var(--text)] font-bold rounded hover:bg-[var(--soft-bg)]"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`px-2.5 py-1 text-white font-bold rounded ${
                        u.isActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {u.isActive ? 'Disable' : 'Enable'}
                    </button>
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
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Create New User Account</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Chidi Amadi"
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
                  placeholder="chidi@jasmine.edu.ng"
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
                <label className="block font-semibold mb-1">Assigned Role Category *</label>
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

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[var(--border)] font-bold rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
