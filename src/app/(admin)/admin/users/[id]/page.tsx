import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getUserById, listAuditLogsForUser } from '@/lib/data/users';
import { roleLabel } from '@/lib/auth/roles';
import UserDetailForm from './UserDetailForm';

export const metadata = { title: 'User Detail | JES Admin' };

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) notFound();

  const logs = await listAuditLogsForUser(user.id, user.email);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 border border-[var(--border)] rounded">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/users" className="text-xs font-bold text-[var(--primary)] hover:underline">
              â† Back to Users
            </Link>
            <span className="text-xs text-[var(--muted-text)]">â€¢ Account ID: {user.id}</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">{user.fullName}</h1>
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

      <UserDetailForm
        user={{
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone ?? '',
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          avatarUrl: user.avatarUrl,
          updatedAt: user.updatedAt,
          notificationPreferences: user.notificationPreferences,
        }}
      />

      {/* User Activity Log */}
      <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <h2 className="text-base font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
          <i className="bi bi-clock-history text-[var(--primary)]"></i>
          <span>Account Audit Activity Trail</span>
        </h2>
        {logs.length === 0 ? (
          <p className="text-xs text-[var(--muted-text)]">
            No activity recorded yet for this account.
          </p>
        ) : (
          <div className="space-y-2 text-xs">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-[var(--text)]">{log.action}</div>
                  {log.details && (
                    <div className="text-[11px] text-[var(--muted-text)]">{log.details}</div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {log.createdAt.substring(0, 10)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
