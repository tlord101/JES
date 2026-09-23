import { requireRole } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { saveAcademicYear } from '@/lib/admin/actions';
import { Flash } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

export default async function AcademicSessionsPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  await requireRole(['super_admin', 'admin']);
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: years } = await supabase.from('academic_years').select('*').order('name', { ascending: false });

  return (
    <div className="space-y-6 text-xs">
      <Flash ok={sp.ok} err={sp.err} />
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Academic Sessions</h1>
        <p className="text-xs text-[var(--muted-text)]">Manage school years (e.g. 2024/2025) stored in the database.</p>
      </div>

      <form action={saveAcademicYear} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
        <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">Add Session</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <input name="name" required placeholder="2025/2026" className="p-2 border border-[var(--border)] rounded font-bold" />
          <input name="start_date" type="date" required className="p-2 border border-[var(--border)] rounded" />
          <input name="end_date" type="date" required className="p-2 border border-[var(--border)] rounded" />
          <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="is_current" /> Current session</label>
        </div>
        <button className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">Save Session</button>
      </form>

      <div className="bg-white border border-[var(--border)] rounded overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] font-semibold">
            <th className="p-3">Session</th><th className="p-3">Start</th><th className="p-3">End</th><th className="p-3">Status</th>
          </tr></thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(years ?? []).map((y: Record<string, unknown>) => (
              <tr key={String(y.id)} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-bold text-[var(--primary-dark)]">{String(y.name)}</td>
                <td className="p-3 font-mono">{String(y.start_date)}</td>
                <td className="p-3 font-mono">{String(y.end_date)}</td>
                <td className="p-3">{y.is_current ? <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">Current</span> : <span className="text-[var(--muted-text)]">—</span>}</td>
              </tr>
            ))}
            {!years?.length && <tr><td className="p-4 text-[var(--muted-text)]" colSpan={4}>No sessions yet — add the first one above.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
