import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState } from '@/lib/admin/ui';
import { saveResult } from '@/lib/admin/people-actions';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function EnterResultsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const classId = typeof sp.class === 'string' ? sp.class : '';
  const subjectId = typeof sp.subject === 'string' ? sp.subject : '';
  const termId = typeof sp.term === 'string' ? sp.term : '';
  const supabase = await createClient();

  const [{ data: classes }, { data: subjects }, { data: terms }, { data: students, error: studentError }] =
    await Promise.all([
      supabase.from('classes').select('id, name, arm, level').order('level').order('name'),
      supabase.from('subjects').select('id, name, code').order('name'),
      supabase.from('terms').select('id, name, is_current').order('is_current', { ascending: false }).order('start_date', { ascending: false }).limit(10),
      classId
        ? supabase
            .from('students')
            .select('id, admission_no, profile:profiles(full_name)')
            .eq('class_id', classId)
            .eq('status', 'active')
            .order('admission_no')
            .limit(100)
        : Promise.resolve({ data: [] as unknown[], error: null as null }),
    ]);

  const classRows = (classes ?? []) as unknown as { id: string; name: string; arm: string | null }[];
  const subjectRows = (subjects ?? []) as unknown as { id: string; name: string; code: string | null }[];
  const termRows = (terms ?? []) as unknown as { id: string; name: string; is_current: boolean }[];
  const studentRows = ((students ?? []) as unknown as {
    id: string;
    admission_no: string;
    profile: { full_name: string } | null;
  }[]) ?? [];

  const ready = classId && subjectId && termId;
  const currentTerm = termId || termRows.find((t) => t.is_current)?.id || '';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enter results"
        description="Manual score entry (CA1 /20, CA2 /20, Exam /60). Grades are computed by the database."
      />
      <Flash ok={sp.ok} err={sp.err} />

      <form action="/admin/results/enter" className="card grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Class *</span>
          <select name="class" defaultValue={classId} className="input-field">
            <option value="">Select class…</option>
            {classRows.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.arm ? ' ' + c.arm : ''}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Subject *</span>
          <select name="subject" defaultValue={subjectId} className="input-field">
            <option value="">Select subject…</option>
            {subjectRows.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.code ? ` (${s.code})` : ''}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Term *</span>
          <select name="term" defaultValue={currentTerm} className="input-field">
            <option value="">Select term…</option>
            {termRows.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
                {t.is_current ? ' (current)' : ''}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full">
            Load class
          </button>
        </div>
      </form>

      {!ready ? (
        <EmptyState message="Pick a class, subject and term above, then load the class list." />
      ) : studentError ? (
        <div className="alert-danger">Failed to load students: {studentError.message}</div>
      ) : studentRows.length === 0 ? (
        <EmptyState message="No active students in this class." />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th className="text-right">CA1 /20</th>
                <th className="text-right">CA2 /20</th>
                <th className="text-right">Exam /60</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {studentRows.map((st) => (
                <tr key={st.id}>
                  <td>
                    <div className="font-medium text-slate-900">{st.profile?.full_name ?? '—'}</div>
                    <div className="font-mono text-xs text-slate-400">{st.admission_no}</div>
                  </td>
                  <td colSpan={4} className="p-0">
                    <form action={saveResult} className="flex flex-wrap items-center justify-end gap-2 p-3">
                      <input type="hidden" name="student_id" value={st.id} />
                      <input type="hidden" name="class_id" value={classId} />
                      <input type="hidden" name="subject_id" value={subjectId} />
                      <input type="hidden" name="term_id" value={termId} />
                      <input
                        type="number"
                        name="ca1_score"
                        min={0}
                        max={20}
                        step={0.5}
                        required
                        defaultValue={0}
                        className="input-field w-20 text-right"
                      />
                      <input
                        type="number"
                        name="ca2_score"
                        min={0}
                        max={20}
                        step={0.5}
                        required
                        defaultValue={0}
                        className="input-field w-20 text-right"
                      />
                      <input
                        type="number"
                        name="exam_score"
                        min={0}
                        max={60}
                        step={0.5}
                        required
                        defaultValue={0}
                        className="input-field w-20 text-right"
                      />
                      <button type="submit" className="btn-primary">
                        Save
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
