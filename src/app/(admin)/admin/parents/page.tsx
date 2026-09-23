import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

type ParentRow = {
  id: string;
  relationship: string | null;
  occupation: string | null;
  profile: { full_name: string; email: string; phone: string | null } | null;
  children: { count: number }[];
};

export default async function AdminParentsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.trim().toLowerCase() : '';
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('parents')
    .select('id, relationship, occupation, profile:profiles(full_name, email, phone), children:parent_student(count)')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Parents & guardians" />
        <div className="alert-danger">Failed to load parents: {error.message}</div>
      </div>
    );
  }

  let rows = (data ?? []) as unknown as ParentRow[];
  if (q) {
    rows = rows.filter(
      (p) =>
        (p.profile?.full_name ?? '').toLowerCase().includes(q) ||
        (p.profile?.email ?? '').toLowerCase().includes(q) ||
        (p.occupation ?? '').toLowerCase().includes(q),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parents & guardians"
        description="Guardian accounts and their linked children."
        actions={
          <Link href="/admin/users/new" className="btn-primary">
            Add parent
          </Link>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      <form className="flex gap-2" action="/admin/parents">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search name or email..."
          className="input-field max-w-md"
        />
        <button type="submit" className="btn-secondary">
          Search
        </button>
      </form>

      {rows.length === 0 ? (
        <EmptyState
          title={q ? 'No matches' : 'No parents yet'}
          body={q ? 'Try a different search.' : 'Parent accounts appear here once created.'}
          action={
            <Link href="/admin/users/new" className="btn-primary">
              Add parent
            </Link>
          }
        />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Relationship</th>
                <th>Occupation</th>
                <th>Children</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium text-slate-900">{p.profile?.full_name ?? '—'}</td>
                  <td>{p.profile?.email ?? '—'}</td>
                  <td>{p.profile?.phone ?? '—'}</td>
                  <td className="capitalize">{p.relationship || 'guardian'}</td>
                  <td>{p.occupation || '—'}</td>
                  <td>{p.children?.[0]?.count ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
