'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export type UserRow = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  roleLabel: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
};

type Props = {
  rows: UserRow[];
  total: number;
  page: number;
  pageSize: number;
  filters: { search: string; role: string; status: string };
};

const ROLE_OPTIONS = [
  ['super_admin', 'Super Administrator'],
  ['admin', 'Administrator'],
  ['principal', 'Principal'],
  ['vice_principal', 'Vice Principal'],
  ['hod', 'Head of Department'],
  ['teacher', 'Teacher'],
  ['accountant', 'Accountant'],
  ['parent', 'Parent / Guardian'],
  ['student', 'Student'],
  ['alumni', 'Alumni'],
];

export default function UsersManager({ rows, total, page, pageSize, filters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.search);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function applyFilters(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value && value !== 'all') params.set(key, value);
      else params.delete(key);
    }
    params.delete('page');
    startTransition(() => router.push(`/admin/users?${params.toString()}`));
  }

  function goToPage(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(next));
    startTransition(() => router.push(`/admin/users?${params.toString()}`));
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters({ q: search });
        }}
        className="bg-white p-4 border border-[var(--border)] rounded flex flex-col sm:flex-row items-center gap-3 text-xs"
      >
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full p-2 pl-8 border border-[var(--border)] rounded"
            aria-label="Search users"
          />
          <i className="bi bi-search absolute left-2.5 top-2.5 text-[var(--muted-text)]"></i>
        </div>
        <select
          value={filters.role}
          onChange={(e) => applyFilters({ role: e.target.value })}
          className="p-2 border border-[var(--border)] rounded font-bold"
          aria-label="Filter by role"
        >
          <option value="all">All Roles</option>
          {ROLE_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => applyFilters({ status: e.target.value })}
          className="p-2 border border-[var(--border)] rounded font-bold"
          aria-label="Filter by status"
        >
          <option value="all">Any Status</option>
          <option value="active">Active Only</option>
          <option value="disabled">Disabled Only</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary-dark)] text-white font-bold rounded"
          disabled={isPending}
        >
          {isPending ? 'Loading…' : 'Apply'}
        </button>
      </form>

      {/* Table */}
      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <i className="bi bi-people text-3xl text-[var(--muted-text)]"></i>
            <p className="text-xs font-bold text-[var(--primary-dark)]">No user accounts found</p>
            <p className="text-xs text-[var(--muted-text)]">
              Try a different search, or create the first account for this role.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[var(--soft-bg)] text-left">
                <tr>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">User</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Role</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Phone</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Status</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)]">Created</th>
                  <th className="p-3 font-bold text-[var(--primary-dark)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id} className="border-t border-[var(--border)] hover:bg-[var(--soft-bg)]">
                    <td className="p-3">
                      <div className="font-bold text-[var(--primary-dark)]">{u.fullName}</div>
                      <div className="text-[11px] text-[var(--muted-text)]">{u.email}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-[var(--soft-bg)] border border-[var(--border)] rounded font-bold text-[10px]">
                        {u.roleLabel}
                      </span>
                    </td>
                    <td className="p-3 text-[var(--muted-text)]">{u.phone ?? '—'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded font-bold text-[10px] ${
                          u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                      {!u.isVerified && (
                        <span className="ml-1 px-2 py-1 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-[var(--muted-text)] font-mono text-[11px]">
                      {u.createdAt.substring(0, 10)}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-[var(--primary)] font-bold hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-xs text-[var(--muted-text)]">
          <span>
            Page {page} of {totalPages} · {total} accounts
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || isPending}
              className="px-3 py-1.5 border border-[var(--border)] rounded font-bold disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages || isPending}
              className="px-3 py-1.5 border border-[var(--border)] rounded font-bold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
