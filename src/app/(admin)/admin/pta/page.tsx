import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState, Badge } from '@/lib/admin/ui';
import { saveCircular } from '@/lib/admin/content-actions';
import { formatDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function AdminPtaPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const supabase = await createClient();

  const [{ data: members, error: memberError }, { data: circulars }] = await Promise.all([
    supabase.from('pta_members').select('id, full_name, position, email').order('full_name').limit(200),
    supabase.from('circulars').select('id, title, description, audience, is_published, published_at, created_at').order('created_at', { ascending: false }).limit(100),
  ]);

  const memberRows = ((members ?? []) as unknown as { id: string; full_name: string; position: string; email: string | null }[]) ?? [];
  const circularRows = ((circulars ?? []) as unknown as {
    id: string;
    title: string;
    description: string | null;
    audience: string;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
  }[]) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="PTA"
        description="Executive committee and circulars distributed to parents."
      />
      <Flash ok={sp.ok} err={sp.err} />
      {memberError ? <div className="alert-danger">Members: {memberError.message}</div> : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Committee</h2>
        {memberRows.length === 0 ? (
          <EmptyState message="No PTA members recorded yet." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {memberRows.map((m) => (
              <div key={m.id} className="card">
                <div className="font-semibold text-slate-900">{m.full_name}</div>
                <div className="text-sm text-primary-700">{m.position}</div>
                {m.email ? <div className="mt-1 text-sm text-slate-500">{m.email}</div> : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Circulars</h2>

        <form action={saveCircular} className="card grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium text-slate-600">Title *</span>
            <input name="title" required className="input-field" placeholder="Term 2 fees deadline" />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium text-slate-600">Description</span>
            <textarea name="description" rows={3} className="input-field" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-600">Attachment URL</span>
            <input name="file_url" className="input-field" placeholder="https://..." />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-600">Audience</span>
            <select name="audience" className="input-field">
              <option value="everyone">Everyone</option>
              <option value="parents">Parents</option>
              <option value="staff">Staff</option>
              <option value="students">Students</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">
              Publish circular
            </button>
          </div>
        </form>

        {circularRows.length === 0 ? (
          <EmptyState message="No circulars published yet." />
        ) : (
          <div className="space-y-3">
            {circularRows.map((c) => (
              <article key={c.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{c.title}</h3>
                      <Badge tone={c.is_published ? 'success' : 'warning'}>{c.is_published ? 'Published' : 'Draft'}</Badge>
                      <Badge tone="info">{c.audience}</Badge>
                    </div>
                    {c.description ? <p className="mt-1 text-sm text-slate-600">{c.description}</p> : null}
                  </div>
                  <time className="text-sm text-slate-400">{formatDateTime(c.published_at ?? c.created_at)}</time>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
