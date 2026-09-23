import { requireRole } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { deleteAdminRow } from '@/lib/admin/actions';
import { saveAlumni } from '@/lib/admin/content-actions';
import { Flash } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

export default async function AdminAlumniPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  await requireRole(['super_admin', 'admin']);
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: alumni } = await supabase
    .from('alumni_records')
    .select('id, full_name, graduation_year, profession, email, phone, is_published')
    .order('graduation_year', { ascending: false });

  return (
    <div className="space-y-6 text-xs">
      <Flash ok={sp.ok} err={sp.err} />
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Alumni Directory & Association CMS</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Manage registered alumni records, graduation yearbooks, and alumni network events.
        </p>
      </div>

      <form action={saveAlumni} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
        <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
          Add Alumni Record
        </h2>
        <div className="grid md:grid-cols-4 gap-3">
          <input name="full_name" required placeholder="Full name *" className="p-2 border border-[var(--border)] rounded font-bold" />
          <input name="graduation_year" required placeholder="Year e.g. 2018 *" className="p-2 border border-[var(--border)] rounded font-bold" />
          <input name="profession" placeholder="Profession / field" className="p-2 border border-[var(--border)] rounded" />
          <input name="email" type="email" placeholder="Email (optional)" className="p-2 border border-[var(--border)] rounded" />
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <input name="phone" placeholder="Phone (optional)" className="p-2 border border-[var(--border)] rounded" />
          <textarea name="biography" rows={2} placeholder="Biography (optional)" className="w-full p-2 border border-[var(--border)] rounded"></textarea>
          <label className="flex items-center gap-2 font-semibold self-end">
            <input type="checkbox" name="is_published" defaultChecked /> Published / visible to public
          </label>
        </div>
        <button className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">Save Alumni Record</button>
      </form>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Alumni Name</th>
              <th className="p-3">Graduation Year</th>
              <th className="p-3">Profession / Field</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Published</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(alumni ?? []).map((a) => (
              <tr key={a.id} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-bold text-[var(--primary-dark)]">{a.full_name}</td>
                <td className="p-3 font-mono font-bold text-[var(--text)]">{a.graduation_year}</td>
                <td className="p-3 font-medium text-[var(--text)]">{a.profession ?? '—'}</td>
                <td className="p-3 font-mono text-[var(--muted-text)]">{a.email ?? '—'}</td>
                <td className="p-3 font-mono text-[var(--muted-text)]">{a.phone ?? '—'}</td>
                <td className="p-3">{a.is_published ? <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">Yes</span> : <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-bold text-[10px] rounded">No</span>}</td>
                <td className="p-3">
                  <form action={deleteAdminRow}>
                    <input type="hidden" name="table" value="alumni_records" />
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="path" value="/admin/alumni" />
                    <button className="text-red-600 font-bold hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {!alumni?.length && (
              <tr>
                <td className="p-4 text-[var(--muted-text)]" colSpan={7}>No alumni records yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
