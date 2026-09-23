import { requireRole } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { saveTerm } from '@/lib/admin/actions';
import { Flash } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

export default async function TermsPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  await requireRole(['super_admin', 'admin']);
  const sp = await searchParams;
  const supabase = await createClient();
  const [{ data: years }, { data: terms }] = await Promise.all([
    supabase.from('academic_years').select('id, name').order('name', { ascending: false }),
    supabase.from('terms').select('*, academic_years(name)').order('start_date', { ascending: false }),
  ]);

  return (
    <div className="space-y-6 text-xs">
      <Flash ok={sp.ok} err={sp.err} />
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Academic Terms</h1>
        <p className="text-xs text-[var(--muted-text)]">First/Second/Third term windows per session.</p>
      </div>

      <form action={saveTerm} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
        <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">Add Term</h2>
        <div className="grid md:grid-cols-5 gap-3">
          <select name="academic_year_id" required className="p-2 border border-[var(--border)] rounded font-bold">
            <option value="">Select session…</option>
            {(years ?? []).map((y: { id: string; name: string }) => <option key={y.id} value={y.id}>{y.name}</option>)}
          </select>
          <select name="name" required className="p-2 border border-[var(--border)] rounded font-bold">
            <option>First Term</option><option>Second Term</option><option>Third Term</option>
          </select>
          <input name="start_date" type="date" required className="p-2 border border-[var(--border)] rounded" />
          <input name="end_date" type="date" required className="p-2 border border-[var(--border)] rounded" />
          <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="is_current" /> Current</label>
        </div>
        <button className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">Save Term</button>
      </form>

      <div className="bg-white border border-[var(--border)] rounded overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] font-semibold">
            <th className="p-3">Term</th><th className="p-3">Session</th><th className="p-3">Start</th><th className="p-3">End</th><th className="p-3">Status</th>
          </tr></thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(terms ?? []).map((t: Record<string, unknown>) => (
              <tr key={String(t.id)} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-bold text-[var(--primary-dark)]">{String(t.name)}</td>
                <td className="p-3">{String((t.academic_years as { name?: string } | null)?.name ?? '—')}</td>
                <td className="p-3 font-mono">{String(t.start_date)}</td>
                <td className="p-3 font-mono">{String(t.end_date)}</td>
                <td className="p-3">{t.is_current ? <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">Current</span> : <span className="text-[var(--muted-text)]">—</span>}</td>
              </tr>
            ))}
            {!terms?.length && <tr><td className="p-4 text-[var(--muted-text)]" colSpan={5}>No terms yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
