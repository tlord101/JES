import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState, Badge } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function ParentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SP>;
}) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const { id } = await params;
  const sp = await searchParams;
  const supabase = await createClient();

  const [{ data: parent }, { data: links, error: linkError }] = await Promise.all([
    supabase
      .from('parents')
      .select('id, occupation, employer, address, alt_phone, relationship, profile:profiles(id, full_name, email, phone, avatar_url, is_active)')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('parent_student')
      .select('student_id, relationship, is_primary, student:students(id, admission_no, status, class:classes(name, arm), profile:profiles(full_name))')
      .eq('parent_id', id),
  ]);

  if (!parent) notFound();

  const p = parent as unknown as {
    id: string;
    occupation: string | null;
    employer: string | null;
    address: string | null;
    alt_phone: string | null;
    relationship: string | null;
    profile: { id: string; full_name: string; email: string; phone: string | null; avatar_url: string | null; is_active: boolean } | null;
  };
  const children = ((links ?? []) as unknown as {
    student_id: string;
    relationship: string;
    is_primary: boolean;
    student: {
      id: string;
      admission_no: string;
      status: string;
      class: { name: string; arm: string | null } | null;
      profile: { full_name: string } | null;
    } | null;
  }[]) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={p.profile?.full_name ?? 'Parent / Guardian'}
        description={`${p.occupation ?? 'Guardian'}${p.employer ? ` at ${p.employer}` : ''}`}
        actions={
          <Link href="/admin/parents" className="btn-secondary">
            ← All parents
          </Link>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Email</div>
          <div className="mt-1 break-all text-sm font-medium text-slate-900">{p.profile?.email ?? '—'}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Phone</div>
          <div className="mt-1 text-sm font-medium text-slate-900">{p.profile?.phone ?? p.alt_phone ?? '—'}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Address</div>
          <div className="mt-1 text-sm font-medium text-slate-900">{p.address ?? '—'}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Account</div>
          <div className="mt-2 flex gap-2">
            <Badge tone={p.profile?.is_active ? 'success' : 'error'}>{p.profile?.is_active ? 'Active' : 'Disabled'}</Badge>
            <Badge tone="info">{p.relationship ?? 'guardian'}</Badge>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Linked children ({children.length})</h2>
        {linkError ? (
          <div className="alert-danger">{linkError.message}</div>
        ) : children.length === 0 ? (
          <EmptyState
            message="No children linked to this parent yet — admissions links them automatically, or link manually after enrollment."
            cta={{ href: '/admin/applications', label: 'View applications' }}
          />
        ) : (
          <div className="card overflow-x-auto p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Admission no.</th>
                  <th>Class</th>
                  <th>Relationship</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {children.map((c) => (
                  <tr key={c.student_id}>
                    <td>
                      <Link href={`/admin/students/${c.student?.id}`} className="font-medium text-slate-900 hover:underline">
                        {c.student?.profile?.full_name ?? '—'}
                      </Link>
                      {c.is_primary ? <Badge tone="info">Primary</Badge> : null}
                    </td>
                    <td className="font-mono text-sm text-slate-500">{c.student?.admission_no}</td>
                    <td>{c.student?.class ? `${c.student.class.name}${c.student.class.arm ? ' ' + c.student.class.arm : ''}` : '—'}</td>
                    <td>{c.relationship}</td>
                    <td>
                      <Badge tone={c.student?.status === 'active' ? 'success' : 'neutral'}>{c.student?.status ?? '—'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
