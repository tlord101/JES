import { requireRole } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { saveClass, deleteAdminRow } from '@/lib/admin/actions';
import { Flash } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

export default async function ClassesPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  await requireRole(['super_admin', 'admin']);
  const sp = await searchParams;
  const supabase = await createClient();
  const [{ data: classes }, { data: staff }, { count }] = await Promise.all([
    supabase.from('classes').select('*, profiles!classes_class_teacher_id_fkey(full_name)').order('name'),
    supabase.from('profiles').select('id, full_name').in('role', ['teacher', 'hod', 'vice_principal', 'principal']).order('full_name'),
    supabase.from('students').select('id', { count: 'exact', head: true }),
  ]);

  return (
    <div className="space-y-6 text-xs">
      <Flash ok={sp.ok} err={sp.err} />
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Classes</h1>
        <p className="text-xs text-[var(--muted-text)]">Class arms, capacity and form teachers. {count ?? 0} students enrolled school-wide.</p>
      </div>

      <form action={saveClass} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
        <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">Add Class</h2>
        <div className="grid md:grid-cols-6 gap-3">
          <input name="name" required placeholder="e.g. JSS 1 Blue" className="p-2 border border-[var(--border)] rounded font-bold" />
          <select name="level" className="p-2 border border-[var(--border)] rounded">
            <option value="nursery">Nursery</option><option value="primary">Primary</option>
            <option value="junior_secondary">Junior Secondary</option><option value="senior_secondary">Senior Secondary</option>
          </select>
          <input name="arm" placeholder="Arm (optional)" className="p-2 border border-[var(--border)] rounded" />
          <input name="capacity" type="number" defaultValue={40} className="p-2 border border-[var(--border)] rounded font-mono" />
          <input name="room" placeholder="Room (optional)" className="p-2 border border-[var(--border)] rounded" />
          <select name="class_teacher_id" className="p-2 border border-[var(--border)] rounded">
            <option value="">Form teacher…</option>
            {(staff ?? []).map((s: { id: string; full_name: string }) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="is_active" defaultChecked /> Active</label>
        <button className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">Save Class</button>
      </form>

      <div className="bg-white border border-[var(--border)] rounded overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] font-semibold">
            <th className="p-3">Class</th><th className="p-3">Level</th><th className="p-3">Capacity</th><th className="p-3">Form Teacher</th><th className="p-3"></th>
          </tr></thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(classes ?? []).map((c: Record<string, unknown>) => (
              <tr key={String(c.id)} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-bold text-[var(--primary-dark)]"><a href={`/admin/classes/${String(c.id)}`}>{String(c.name)}</a></td>
                <td className="p-3 capitalize">{String(c.level).replace('_', ' ')}</td>
                <td className="p-3 font-mono">{String(c.capacity)}</td>
                <td className="p-3">{String((c.profiles as { full_name?: string } | null)?.full_name ?? '—')}</td>
                <td className="p-3">
                  <form action={deleteAdminRow}>
                    <input type="hidden" name="table" value="classes" />
                    <input type="hidden" name="id" value={String(c.id)} />
                    <input type="hidden" name="path" value="/admin/classes" />
                    <button className="text-red-600 font-bold hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {!classes?.length && <tr><td className="p-4 text-[var(--muted-text)]" colSpan={5}>No classes yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
