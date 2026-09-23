import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState, StatusBadge, Badge } from '@/lib/admin/ui';
import { formatDate, formatDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminCalendarPage() {
  await requireRole(ADMIN_PORTAL_ROLES);
  const supabase = await createClient();

  const [{ data: events, error }, { data: terms }] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, description, starts_at, ends_at, location, category, status')
      .order('starts_at', { ascending: false })
      .limit(100),
    supabase
      .from('terms')
      .select('id, name, start_date, end_date, is_current, year:academic_years(name)')
      .order('start_date', { ascending: false })
      .limit(30),
  ]);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="School calendar" />
        <div className="alert-danger">Failed to load calendar: {error.message}</div>
      </div>
    );
  }

  const eventRows = (events ?? []) as unknown as {
    id: string;
    title: string;
    description: string | null;
    starts_at: string;
    ends_at: string | null;
    location: string | null;
    category: string | null;
    status: string;
  }[];

  const termRows = (terms ?? []) as unknown as {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    year: { name: string } | null;
  }[];

  const now = Date.now();
  const upcoming = eventRows.filter((e) => new Date(e.starts_at).getTime() >= now);
  const past = eventRows.filter((e) => new Date(e.starts_at).getTime() < now);

  return (
    <div className="space-y-6">
      <PageHeader
        title="School calendar"
        description="Academic terms and the events timeline. Manage events from the Events section."
        actions={
          <Link href="/admin/events" className="btn-primary">
            Manage events
          </Link>
        }
      />
      <Flash />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Academic terms</h2>
        {termRows.length === 0 ? (
          <EmptyState message="No academic terms yet — create them under Academic sessions." cta={{ href: '/admin/terms', label: 'Manage terms' }} />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {termRows.map((t) => (
              <div key={t.id} className="card">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900">
                    {t.year?.name ? `${t.year.name} · ` : ''}
                    {t.name}
                  </div>
                  {t.is_current ? <Badge tone="success">Current</Badge> : null}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {formatDate(t.start_date)} → {formatDate(t.end_date)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Upcoming events ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <EmptyState message="No upcoming events." cta={{ href: '/admin/events', label: 'Add an event' }} />
        ) : (
          <div className="space-y-3">
            {upcoming.map((e) => (
              <article key={e.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{e.title}</h3>
                      <StatusBadge status={e.status} />
                      {e.category ? <Badge tone="info">{e.category}</Badge> : null}
                    </div>
                    {e.description ? <p className="mt-1 text-sm text-slate-600">{e.description}</p> : null}
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <div>{formatDateTime(e.starts_at)}</div>
                    {e.ends_at ? <div>→ {formatDateTime(e.ends_at)}</div> : null}
                    {e.location ? <div className="text-slate-400">{e.location}</div> : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {past.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Past events ({past.length})</h2>
          <div className="card divide-y divide-slate-100">
            {past.slice(0, 20).map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="text-slate-700">{e.title}</span>
                <span className="text-slate-400">{formatDate(e.starts_at)}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
