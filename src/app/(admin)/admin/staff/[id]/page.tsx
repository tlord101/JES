import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, StatusBadge } from '@/lib/admin/ui';
import { formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function StaffDetailPage({
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

  const { data: member, error } = await supabase
    .from('staff')
    .select(
      `id, staff_no, position, department, qualification, biography, photo_url,
       date_hired, is_public, status,
       profile:profiles(id, full_name, email, phone, avatar_url, role, last_login_at),
       subjects:staff_subjects(subject:subjects(id, name, code)),
       classes:staff_classes(duty, class:classes(id, name, arm))`,
    )
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Staff member" />
        <div className="alert-danger">Failed to load staff member: {error.message}</div>
      </div>
    );
  }
  if (!member) notFound();

  const m = member as unknown as {
    id: string;
    staff_no: string;
    position: string;
    department: string | null;
    qualification: string | null;
    biography: string | null;
    photo_url: string | null;
    date_hired: string | null;
    is_public: boolean;
    status: string;
    profile: { id: string; full_name: string; email: string; phone: string | null; role: string; last_login_at: string | null } | null;
    subjects: { subject: { id: string; name: string; code: string | null } | null }[];
    classes: { duty: string; class: { id: string; name: string; arm: string | null } | null }[];
  };

  const facts: [string, string][] = [
    ['Staff no', m.staff_no],
    ['Position', m.position],
    ['Department', m.department ?? '—'],
    ['Role', m.profile?.role ?? '—'],
    ['Qualification', m.qualification ?? '—'],
    ['Date hired', formatDate(m.date_hired)],
    ['Email', m.profile?.email ?? '—'],
    ['Phone', m.profile?.phone ?? '—'],
    ['Last sign-in', m.profile?.last_login_at ? new Date(m.profile.last_login_at).toLocaleString() : 'Never'],
    ['Public directory', m.is_public ? 'Listed' : 'Hidden'],
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={m.profile?.full_name ?? 'Staff member'}
        description={`Staff record · ${m.staff_no}`}
        actions={
          <Link href="/admin/staff" className="btn-secondary">
            Back to staff
          </Link>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      <div className="flex items-center gap-3">
        <StatusBadge status={m.status} />
        <a href={`/admin/users/${m.profile?.id}`} className="text-sm text-primary-600 hover:underline">
          Manage account
        </a>
      </div>

      <section className="card">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Details</h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
              <dd className="text-sm text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>
        {m.biography && (
          <p className="mt-4 whitespace-pre-line border-t border-slate-100 pt-4 text-sm text-slate-600">
            {m.biography}
          </p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Subjects</h2>
          {m.subjects.length === 0 ? (
            <p className="text-sm text-slate-500">No subjects assigned.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {m.subjects.map((row, i) => (
                <li key={i} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  {row.subject?.name}
                  {row.subject?.code ? ` (${row.subject.code})` : ''}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Class duties</h2>
          {m.classes.length === 0 ? (
            <p className="text-sm text-slate-500">No class duties assigned.</p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {m.classes.map((row, i) => (
                <li key={i} className="flex justify-between py-2">
                  <span className="text-slate-700">
                    {row.class?.name}
                    {row.class?.arm ? ' ' + row.class.arm : ''}
                  </span>
                  <span className="capitalize text-slate-500">{row.duty}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
