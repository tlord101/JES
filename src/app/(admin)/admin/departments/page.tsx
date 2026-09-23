import { requireRole } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { saveDepartment, deleteAdminRow } from '@/lib/admin/actions';
import { Flash } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

export default async function DepartmentsPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  await requireRole(['super_admin', 'admin']);
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: departments } = await supabase.from('departments').select('*').order('name');

  return (
    <div className="space-y-6 text-xs">
      <Flash ok={sp.ok} err={sp.err} />
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Departments</h1>
        <p className="text-xs text-[var(--muted-text)]">Academic departments and their heads of department.</p>
      </div>

      <form action={saveDepartment} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
        <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">Add Department</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <input name="code" required placeholder="Code e.g. MTH" className="p-2 border border-[var(--border)] rounded font-bold uppercase" />
          <input name="name" required placeholder="Department name" className="p-2 border border-[var(--border)] rounded font-bold" />
          <input name="hod_name" placeholder="HOD name" className="p-2 border border-[var(--border)] rounded" />
          <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="is_active" defaultChecked /> Active</label>
        </div>
        <textarea name="description" rows={2} placeholder="Description (optional)" className="w-full p-2 border border-[var(--border)] rounded"></textarea>
        <button className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">Save Department</button>
      </form>

      <div className="bg-white border border-[var(--border)] rounded overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] font-semibold">
            <th className="p-3">Code</th><th className="p-3">Name</th><th className="p-3">HOD</th><th className="p-3">Status</th><th className="p-3"></th>
          </tr></thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(departments ?? []).map((d: Record<string, unknown>) => (
              <tr key={String(d.id)} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-mono font-bold text-[var(--primary-dark)]">{String(d.code)}</td>
                <td className="p-3 font-bold">{String(d.name)}</td>
                <td className="p-3">{String(d.hod_name ?? '—')}</td>
                <td className="p-3">{d.is_active ? <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">Active</span> : <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-bold text-[10px] rounded">Inactive</span>}</td>
                <td className="p-3">
                  <form action={deleteAdminRow}>
                    <input type="hidden" name="table" value="departments" />
                    <input type="hidden" name="id" value={String(d.id)} />
                    <input type="hidden" name="path" value="/admin/departments" />
                    <button className="text-red-600 font-bold hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {!departments?.length && <tr><td className="p-4 text-[var(--muted-text)]" colSpan={5}>No departments yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
