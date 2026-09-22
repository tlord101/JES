import { listClassOptions } from '@/lib/data/users';
import Link from 'next/link';
import CreateUserForm from './CreateUserForm';

export const metadata = { title: 'Create User | JES Admin' };

export default async function NewUserPage() {
  const classes = await listClassOptions();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <div className="flex items-center gap-2">
          <Link href="/admin/users" className="text-xs font-bold text-[var(--primary)] hover:underline">
            ← Back to Users
          </Link>
        </div>
        <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">Create New User Account</h1>
        <p className="text-xs text-[var(--muted-text)]">
          The account is created in Supabase Auth with a verified email, then linked to the matching
          school record for the chosen role.
        </p>
      </div>

      <CreateUserForm classes={classes} />
    </div>
  );
}
