'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { recordAudit } from '@/lib/audit';
import type { ApplicationStatus } from '@/types/database';

async function ctx() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  if (!user) redirect('/login/admin');
  return { supabase, userId: user.id, email: user.email ?? '' };
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}
function num(fd: FormData, key: string): number {
  const v = Number(fd.get(key));
  return Number.isFinite(v) ? v : 0;
}
function dateOrNull(v: string): string | null {
  return v || null;
}
function back(path: string, message: string, ok = true): never {
  revalidatePath(path);
  redirect(`${path}?${ok ? 'ok' : 'err'}=${encodeURIComponent(message)}`);
}

// ------------------------------ Students -------------------------------------

/** Update an existing student record. Creating students is done via
 *  /admin/users/new (requires an auth account + profile). */
export async function updateStudent(fd: FormData) {
  const { supabase, userId } = await ctx();
  const id = str(fd, 'id');
  const path = str(fd, 'path') || '/admin/students';
  if (!id) back(path, 'Missing student id', false);
  const row: Record<string, unknown> = {};
  for (const key of ['class_id', 'address', 'photo_url', 'blood_group', 'genotype', 'medical_notes'] as const) {
    const v = str(fd, key);
    if (fd.has(key)) row[key] = v || null;
  }
  if (fd.has('status')) row.status = str(fd, 'status');
  if (fd.has('date_of_birth')) row.date_of_birth = str(fd, 'date_of_birth') || null;
  const { error } = await supabase.from('students').update(row as never).eq('id', id);
  if (!error) await recordAudit({ action: 'Student Record Updated', category: 'Student', details: id, actorId: userId });
  back(path, error ? error.message : 'Student record updated', !error);
}

// ------------------------------- Results --------------------------------------

export async function saveResult(fd: FormData) {
  const { supabase, userId } = await ctx();
  const path = '/admin/results';
  const row = {
    student_id: str(fd, 'student_id'),
    subject_id: str(fd, 'subject_id'),
    class_id: str(fd, 'class_id'),
    term_id: str(fd, 'term_id'),
    ca1_score: num(fd, 'ca1_score'),
    ca2_score: num(fd, 'ca2_score'),
    exam_score: num(fd, 'exam_score'),
    entered_by: userId,
    academic_year_id: null,
    status: 'draft' as const,
    grade: null,
    remark: null,
    position_in_class: null,
    approved_by: null,
    approved_at: null,
  };
  if (!row.student_id || !row.subject_id || !row.class_id || !row.term_id) {
    back(path, 'Student, subject, class and term are all required', false);
  }
  const { error } = await supabase.from('results').upsert(row, { onConflict: 'student_id,subject_id,term_id' });
  back(path, error ? error.message : 'Result saved (grade auto-computed)', !error);
}

export async function setResultStatus(fd: FormData) {
  const { supabase, userId } = await ctx();
  const id = str(fd, 'id');
  const status = str(fd, 'status');
  const path = str(fd, 'path') || '/admin/results';
  if (!['draft', 'submitted', 'approved', 'published'].includes(status)) back(path, 'Invalid status', false);
  const patch: Record<string, unknown> = { status };
  if (status === 'approved' || status === 'published') {
    patch.approved_by = userId;
    patch.approved_at = new Date().toISOString();
  }
  const { error } = await supabase.from('results').update(patch as never).eq('id', id);
  back(path, error ? error.message : `Result marked ${status}`, !error);
}

// ------------------------------ Attendance ------------------------------------

export async function saveAttendanceMark(fd: FormData) {
  const { supabase, userId } = await ctx();
  const path = str(fd, 'path') || '/admin/attendance';
  const attendance_date = str(fd, 'attendance_date');
  const class_id = str(fd, 'class_id');
  const term_id = str(fd, 'term_id') || null;
  const academic_year_id = str(fd, 'academic_year_id') || null;
  const rows: Array<Record<string, unknown>> = [];
  for (const [key, value] of fd.entries()) {
    if (!key.startsWith('status_')) continue;
    const studentId = key.slice('status_'.length);
    rows.push({
      student_id: studentId,
      class_id,
      attendance_date,
      term_id,
      academic_year_id,
      status: String(value),
      recorded_by: userId,
    });
  }
  if (!rows.length || !attendance_date || !class_id) back(path, 'Nothing to save', false);
  await supabase.from('attendance').delete().eq('class_id', class_id).eq('attendance_date', attendance_date).is('subject_id', null).in('student_id', rows.map((r) => String(r.student_id)));
  const { error } = await supabase.from('attendance').insert(rows as never);
  back(path, error ? error.message : `Attendance recorded for ${rows.length} student(s)`, !error);
}

// --------------------------- Admission applications -------------------------

/** Approve / reject / waitlist / review an admission application. */
export async function setApplicationStatus(fd: FormData) {
  const { supabase, userId } = await ctx();
  const id = str(fd, 'id');
  const status = str(fd, 'status');
  const allowed = ['pending', 'under_review', 'approved', 'rejected', 'waitlisted', 'withdrawn'];
  if (!id || !allowed.includes(status)) back('/admin/applications', 'Invalid request', false);

  const { error } = await supabase
    .from('admission_applications')
    .update({ status: status as ApplicationStatus, reviewed_by: userId, reviewed_at: new Date().toISOString() })
    .eq('id', id);
  if (error) back('/admin/applications', `Update failed: ${error.message}`, false);

  await recordAudit({
    actorId: userId,
    action: 'application.status_changed',
    category: 'Admissions',
    metadata: { application_id: id, status },
  });
  back('/admin/applications', `Application marked ${status}`);
}
