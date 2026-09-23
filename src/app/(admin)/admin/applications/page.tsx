import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, StatusBadge, EmptyState, Badge } from '@/lib/admin/ui';
import { setApplicationStatus } from '@/lib/admin/people-actions';
import { formatDateTime } from '@/lib/format';
import type { ApplicationStatus } from '@/types/database';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

const STATUSES = ['pending', 'under_review', 'approved', 'rejected', 'waitlisted', 'withdrawn'] as const;

const toneFor = (s: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' =>
  s === 'approved' ? 'success' :
  s === 'rejected' || s === 'withdrawn' ? 'error' :
  s === 'pending' ? 'warning' :
  s === 'under_review' ? 'info' : 'neutral';

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const filter = typeof sp.status === 'string' && sp.status ? sp.status : '';
  const supabase = await createClient();

  let query = supabase
    .from('admission_applications')
    .select(
      'id, application_no, first_name, last_name, gender, class_applying_for, guardian_full_name, guardian_email, guardian_phone, status, submitted_at',
    )
    .order('submitted_at', { ascending: false })
    .limit(200);
  if (filter) query = query.eq('status', filter as ApplicationStatus);
  const { data, error } = await query;

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Admission applications" />
        <div className="alert-danger">Failed to load applications: {error.message}</div>
      </div>
    );
  }

  const rows = (data ?? []) as unknown as {
    id: string;
    application_no: string;
    first_name: string;
    last_name: string;
    gender: string;
    class_applying_for: string;
    guardian_full_name: string;
    guardian_email: string;
    guardian_phone: string;
    status: string;
    submitted_at: string | null;
  }[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admission applications"
        description="Review and decide online applications from the public site."
      />
      <Flash ok={sp.ok} err={sp.err} />

      <div className="flex flex-wrap gap-2 text-sm">
        <a
          href="/admin/applications"
          className={`rounded-full px-3 py-1 ${!filter ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          All
        </a>
        {STATUSES.map((s) => (
          <a
            key={s}
            href={`/admin/applications?status=${s}`}
            className={`rounded-full px-3 py-1 capitalize ${filter === s ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {s.replace('_', ' ')}
          </a>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={filter ? 'No applications with this status' : 'No applications yet'}
          body="Applications submitted on the public site appear here instantly."
        />
      ) : (
        <div className="space-y-4">
          {rows.map((app) => (
            <section key={app.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-semibold text-slate-900">
                      {app.first_name} {app.last_name}
                    </h2>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {app.application_no} · {app.class_applying_for} · {app.gender} · submitted{' '}
                    {formatDateTime(app.submitted_at)}
                  </p>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <div className="font-medium">{app.guardian_full_name}</div>
                  <div className="text-slate-500">{app.guardian_email}</div>
                  <div className="text-slate-500">{app.guardian_phone}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {(['under_review', 'approved', 'rejected', 'waitlisted'] as const).map((s) => (
                  <form key={s} action={setApplicationStatus} className="inline-flex">
                    <input type="hidden" name="id" value={app.id} />
                    <input type="hidden" name="status" value={s} />
                    <button
                      type="submit"
                      className={
                        s === 'approved'
                          ? 'btn-primary'
                          : s === 'rejected'
                            ? 'btn-secondary border-red-200 text-red-600 hover:bg-red-50'
                            : 'btn-secondary'
                      }
                      disabled={app.status === s}
                    >
                      {s === 'under_review' ? 'Mark under review' : `Mark ${s}`}
                    </button>
                  </form>
                ))}
                <Badge tone={toneFor(app.status)}>{app.status.replace('_', ' ')}</Badge>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
