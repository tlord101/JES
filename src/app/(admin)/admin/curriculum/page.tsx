import { requireRole } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { saveCurriculumTopic, deleteAdminRow } from '@/lib/admin/actions';
import { Flash } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

export default async function CurriculumPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  await requireRole(['super_admin', 'admin']);
  const sp = await searchParams;
  const supabase = await createClient();
  const [{ data: topics }, { data: subjects }, { data: classes }, { data: terms }] = await Promise.all([
    supabase.from('curriculum_topics').select('*, subjects(name), classes(name), terms(name)').order('week_number'),
    supabase.from('subjects').select('id, name').eq('is_active', true).order('name'),
    supabase.from('classes').select('id, name').eq('is_active', true).order('name'),
    supabase.from('terms').select('id, name').order('start_date', { ascending: false }),
  ]);

  return (
    <div className="space-y-6 text-xs">
      <Flash ok={sp.ok} err={sp.err} />
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Curriculum &amp; Scheme of Work</h1>
        <p className="text-xs text-[var(--muted-text)]">Weekly topics and learning objectives, stored per subject/class/term.</p>
      </div>

      <form action={saveCurriculumTopic} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
        <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">Add Weekly Topic</h2>
        <div className="grid md:grid-cols-5 gap-3">
          <select name="subject_id" required className="p-2 border border-[var(--border)] rounded font-bold">
            <option value="">Subject…</option>
            {(subjects ?? []).map((s: { id: string; name: string }) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select name="class_id" className="p-2 border border-[var(--border)] rounded">
            <option value="">Any class</option>
            {(classes ?? []).map((c: { id: string; name: string }) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select name="term_id" className="p-2 border border-[var(--border)] rounded">
            <option value="">Any term</option>
            {(terms ?? []).map((t: { id: string; name: string }) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input name="week_number" type="number" min={1} max={14} defaultValue={1} className="p-2 border border-[var(--border)] rounded font-mono" />
          <input name="topic" required placeholder="Lesson topic *" className="p-2 border border-[var(--border)] rounded font-bold" />
        </div>
        <textarea name="objectives" rows={2} placeholder="Learning objectives (optional)" className="w-full p-2 border border-[var(--border)] rounded"></textarea>
        <button className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">Save Topic</button>
      </form>

      <div className="space-y-3">
        {(topics ?? []).map((t: Record<string, unknown>) => (
          <div key={String(t.id)} className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <span className="font-bold text-sm text-[var(--primary-dark)]">
                {String((t.subjects as { name?: string } | null)?.name ?? 'Subject')}
                {t.classes ? <span className="text-[var(--muted-text)] font-normal"> • {String((t.classes as { name?: string }).name)}</span> : null}
                {t.terms ? <span className="text-[var(--muted-text)] font-normal"> • {String((t.terms as { name?: string }).name)}</span> : null}
              </span>
              <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded font-mono">Week {String(t.week_number)}</span>
            </div>
            <div className="font-bold">Topic: {String(t.topic)}</div>
            {t.objectives ? <p className="text-slate-600 leading-relaxed">Objectives: {String(t.objectives)}</p> : null}
            <form action={deleteAdminRow}>
              <input type="hidden" name="table" value="curriculum_topics" />
              <input type="hidden" name="id" value={String(t.id)} />
              <input type="hidden" name="path" value="/admin/curriculum" />
              <button className="text-red-600 font-bold hover:underline">Delete</button>
            </form>
          </div>
        ))}
        {!topics?.length && <div className="bg-white p-10 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">No topics recorded yet — add the first above.</div>}
      </div>
    </div>
  );
}
