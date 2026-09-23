import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, StatusBadge } from '@/lib/admin/ui';
import { formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function StudentDetailPage({
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

  const { data: student, error } = await supabase
    .from('students')
    .select(
      `id, admission_no, gender, date_of_birth, address, blood_group, genotype,
       medical_notes, admitted_on, status,
       profile:profiles(id, full_name, email, phone, avatar_url),
       class:classes(id, name, arm),
       guardians:parent_student(
         relationship, is_primary,
         parent:parents(id, occupation, relationship, profile:profiles(full_name, email, phone))
       )`,
    )
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Student" />
        <div className="alert-danger">Failed to load student: {error.message}</div>
      </div>
    );
  }
  if (!student) notFound();

  const s = student as unknown as {
    id: string;
    admission_no: string;
    gender: string | null;
    date_of_birth: string | null;
    address: string | null;
    blood_group: string | null;
    genotype: string | null;
    medical_notes: string | null;
    admitted_on: string;
    status: string;
    profile: { id: string; full_name: string; email: string; phone: string | null; avatar_url: string | null } | null;
    class: { id: string; name: string; arm: string | null } | null;
    guardians: {
      relationship: string;
      is_primary: boolean;
      parent: { id: string; occupation: string | null; profile: { full_name: string; email: string; phone: string | null } | null } | null;
    }[];
  };

  const facts: [string, string][] = [
    ['Admission no', s.admission_no],
    ['Class', s.class ? `${s.class.name}${s.class.arm ? ' ' + s.class.arm : ''}` : 'Not assigned'],
    ['Gender', s.gender ?? '—'],
    ['Date of birth', formatDate(s.date_of_birth)],
    ['Admitted on', formatDate(s.admitted_on)],
    ['Email', s.profile?.email ?? '—'],
    ['Phone', s.profile?.phone ?? '—'],
    ['Blood group', s.blood_group ?? '—'],
    ['Genotype', s.genotype ?? '—'],
    ['Address', s.address ?? '—'],
    ['Medical notes', s.medical_notes ?? '—'],
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={s.profile?.full_name ?? 'Student'}
        description={`Student record · ${s.admission_no}`}
        actions={
          <div className="flex gap-2">
            <Link href={`/admin/results?student=${s.id}`} className="btn-secondary">
              Results
            </Link>
            <Link href={`/admin/students`} className="btn-secondary">
              Back to students
            </Link>
          </div>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      <div className="flex items-center gap-3">
        <StatusBadge status={s.status} />
        <span className="text-sm text-slate-500">Profile ID: {s.profile?.id ?? '—'}</span>
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
      </section>

      <section className="card">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Guardians</h2>
        {s.guardians.length === 0 ? (
          <p className="text-sm text-slate-500">No guardian linked yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {s.guardians.map((g, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <div>
                  <span className="font-medium text-slate-800">
                    {g.parent?.profile?.full_name ?? 'Unknown'}
                  </span>
                  <span className="ml-2 text-slate-500">
                    {g.relationship}
                    {g.is_primary ? ' · primary' : ''}
                  </span>
                </div>
                <div className="text-slate-500">
                  {g.parent?.profile?.email} · {g.parent?.profile?.phone ?? 'no phone'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
