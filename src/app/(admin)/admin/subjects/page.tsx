import { requireRole } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { saveSubject, deleteAdminRow } from '@/lib/admin/actions';
import { Flash } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

export default async function SubjectsPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  await requireRole(['super_admin', 'admin']);
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: subjects } = await supabase.from('subjects').select('*').order('name');

  return (
    <div className="space-y-6 text-xs">
      <Flash ok={sp.ok} err={sp.err} />
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Subjects</h1>
        <p className="text-xs text-[var(--muted-text)]">Subject catalogue with codes and departments.</p>
      </div>

      <form action={saveSubject} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
        <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">Add Subject</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <input name="code" required placeholder="Code e.g. MTH101" className="p-2 border border-[var(--border)] rounded font-bold uppercase" />
          <input name="name" required placeholder="Subject name" className="p-2 border border-[var(--border)] rounded font-bold" />
          <input name="department" placeholder="Department (optional)" className="p-2 border border-[var(--border)] rounded" />
          <select name="level" className="p-2 border border-[var(--border)] rounded">
            <option value="">Any level</option>
            <option value="nursery">Nursery</option><option value="primary">Primary</option>
            <option value="junior_secondary">Junior Secondary</option><option value="senior_secondary">Senior Secondary</option>
          </select>
        </div>
        <textarea name="description" rows={2} placeholder="Description (optional)" className="w-full p-2 border border-[var(--border)] rounded"></textarea>
        <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="is_active" defaultChecked /> Active</label>
        <button className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">Save Subject</button>
      </form>

      <div className="bg-white border border-[var(--border)] rounded overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] font-semibold">
            <th className="p-3">Code</th><th className="p-3">Name</th><th className="p-3">Department</th><th className="p-3">Level</th><th className="p-3"></th>
          </tr></thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(subjects ?? []).map((s: Record<string, unknown>) => (
              <tr key={String(s.id)} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-mono font-bold text-[var(--primary-dark)]">{String(s.code)}</td>
                <td className="p-3 font-bold">{String(s.name)}</td>
                <td className="p-3">{String(s.department ?? '—')}</td>
                <td className="p-3 capitalize">{s.level ? String(s.level).replace('_', ' ') : '—'}</td>
                <td className="p-3">
                  <form action={deleteAdminRow}>
                    <input type="hidden" name="table" value="subjects" />
                    <input type="hidden" name="id" value={String(s.id)} />
                    <input type="hidden" name="path" value="/admin/subjects" />
                    <button className="text-red-600 font-bold hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {!subjects?.length && <tr><td className="p-4 text-[var(--muted-text)]" colSpan={5}>No subjects yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
