import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState } from '@/lib/admin/ui';
import { saveSiteSetting } from '@/lib/admin/content-actions';
import { formatDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value, label, group_name, updated_at')
    .order('group_name')
    .order('key')
    .limit(300);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Site settings" />
        <div className="alert-danger">Failed to load settings: {error.message}</div>
      </div>
    );
  }

  type Setting = { key: string; value: unknown; label: string | null; group_name: string; updated_at: string };
  const rows = (data ?? []) as unknown as Setting[];
  const display = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site settings"
        description="Key/value configuration used by the public site (school name, contact, stats, homepage copy)."
      />
      <Flash ok={sp.ok} err={sp.err} />

      <form action={saveSiteSetting} className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Key *</span>
          <input name="key" required className="input-field" placeholder="school_motto" />
        </label>
        <label className="block text-sm lg:col-span-3">
          <span className="mb-1 block font-medium text-slate-600">Value * (plain text or JSON)</span>
          <input name="value" required className="input-field" placeholder="Diligence for Excellence" />
        </label>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full">
            Save setting
          </button>
        </div>
      </form>

      {rows.length === 0 ? (
        <EmptyState message="No settings saved yet — add the first one above." />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Group</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.key}>
                  <td className="font-mono text-sm font-medium text-slate-900">{s.key}</td>
                  <td className="max-w-[24rem] truncate text-slate-600">{display(s.value)}</td>
                  <td className="text-slate-500">{s.group_name}</td>
                  <td className="text-slate-400">{formatDateTime(s.updated_at)}</td>
                  <td className="text-right">
                    <form action={saveSiteSetting} className="flex justify-end gap-2">
                      <input type="hidden" name="key" value={s.key} />
                      <input name="value" defaultValue={display(s.value)} className="input-field max-w-[16rem]" />
                      <button type="submit" className="btn-secondary">
                        Update
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
