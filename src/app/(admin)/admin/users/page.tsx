import Link from 'next/link';
import { listUsers, getUserStatistics } from '@/lib/data/users';
import { roleLabel } from '@/lib/auth/roles';
import UsersManager from './UsersManager';

export const metadata = { title: 'User Management | JES Admin' };

type SearchParams = Promise<{ q?: string; role?: string; status?: string; page?: string }>;

export default async function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? '1', 10) || 1;

  const [result, stats] = await Promise.all([
    listUsers({
      search: params.q,
      role: params.role,
      status: params.status,
      page,
    }),
    getUserStatistics(),
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">User Account Management</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage system access accounts, assign role categories, enable/disable users, and reset credentials.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-person-plus-fill"></i>
          <span>Create New User</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Accounts', value: stats.total, icon: 'bi-people-fill' },
          { label: 'Active', value: stats.active, icon: 'bi-check-circle-fill' },
          { label: 'Disabled', value: stats.disabled, icon: 'bi-slash-circle-fill' },
          { label: 'Staff', value: stats.staff, icon: 'bi-briefcase-fill' },
          { label: 'Parents', value: stats.parents, icon: 'bi-house-heart-fill' },
          { label: 'Students', value: stats.students, icon: 'bi-mortarboard-fill' },
        ].map((tile) => (
          <div key={tile.label} className="bg-white p-4 border border-[var(--border)] rounded">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted-text)]">
                {tile.label}
              </span>
              <i className={`bi ${tile.icon} text-[var(--primary)]`}></i>
            </div>
            <div className="text-xl font-bold text-[var(--primary-dark)] mt-1">{tile.value}</div>
          </div>
        ))}
      </div>

      <UsersManager
        rows={result.rows.map((row) => ({
          id: row.id,
          email: row.email,
          fullName: row.fullName,
          phone: row.phone,
          role: row.role,
          roleLabel: roleLabel(row.role),
          isActive: row.isActive,
          isVerified: row.isVerified,
          createdAt: row.createdAt,
        }))}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        filters={{
          search: params.q ?? '',
          role: params.role ?? 'all',
          status: params.status ?? 'all',
        }}
      />
    </div>
  );
}
