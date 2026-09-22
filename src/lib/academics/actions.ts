'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { recordAudit } from '@/lib/audit';
import type { AuthActionState } from '@/lib/auth/action-state';
import { canAccessStaffPortal } from '@/lib/auth/roles';
import type { AttendanceStatus, ResultStatus } from '@/types/database';

const ATTENDANCE_STATUSES: AttendanceStatus[] = ['present', 'absent', 'late', 'excused'];

const CA1_MAX = 20;
const CA2_MAX = 20;
const EXAM_MAX = 60;

/**
 * Guard for every teaching action. Mirrors {@link requireContentManager} in the
 * CMS module: environment check, session check and role check in one place.
 */
async function requireStaff(): Promise<
  { ok: true; actorId: string; actorName: string | null } | { ok: false; state: AuthActionState }
> {
  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      state: {
        status: 'error',
        message: 'Supabase is not configured yet. Add your project URL and keys to .env.local.',
      },
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, state: { status: 'error', message: 'You are not signed in.' } };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active, full_name')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !profile.is_active || !canAccessStaffPortal(profile.role)) {
    return {
      ok: false,
      state: { status: 'error', message: 'You do not have permission to use the staff portal.' },
    };
  }

  return { ok: true, actorId: user.id, actorName: profile.full_name ?? null };
}

function clampScore(value: string, max: number): number | null {
  if (value.trim() === '') return 0;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > max) return null;
  return Math.round(parsed * 100) / 100;
}

/**
 * Saves the daily class register. Each student appears in the form as
 * `status_<studentId>` (plus an optional `remarks_<studentId>`).
 */
export async function saveAttendanceAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const staff = await requireStaff();
  if (!staff.ok) return staff.state;

  const headerList = await headers();
  const limit = rateLimit(clientKey(headerList, 'attendance-save', staff.actorId), 40, 60_000);
  if (!limit.success) {
    return { status: 'error', message: `Too many requests. Try again in ${limit.retryAfterSeconds}s.` };
  }

  const classId = String(formData.get('classId') ?? '');
  const attendanceDate = String(formData.get('attendanceDate') ?? '');
  const termId = String(formData.get('termId') ?? '');

  if (!classId || !/^\d{4}-\d{2}-\d{2}$/.test(attendanceDate)) {
    return { status: 'error', message: 'Select a class and a valid date before saving the register.' };
  }

  const statuses: { studentId: string; status: AttendanceStatus; remarks: string | null }[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('status_')) continue;
    const studentId = key.slice('status_'.length);
    const status = String(value);
    if (!studentId || !ATTENDANCE_STATUSES.includes(status as AttendanceStatus)) continue;

    const remarks = String(formData.get(`remarks_${studentId}`) ?? '').trim();
    statuses.push({
      studentId,
      status: status as AttendanceStatus,
      remarks: remarks.length > 0 ? remarks : null,
    });
  }

  if (statuses.length === 0) {
    return { status: 'error', message: 'No students were found on this register.' };
  }

  const supabase = await createClient();
  const { data: academicYear } = await supabase
    .from('academic_years')
    .select('id')
    .eq('is_current', true)
    .maybeSingle();

  const { data: existing } = await supabase
    .from('attendance')
    .select('id, student_id')
    .eq('class_id', classId)
    .eq('attendance_date', attendanceDate)
    .is('subject_id', null);

  const existingByStudent = new Map((existing ?? []).map((row) => [row.student_id, row.id]));

  let saved = 0;
  for (const entry of statuses) {
    const recordId = existingByStudent.get(entry.studentId);
    if (recordId) {
      const { error } = await supabase
        .from('attendance')
        .update({ status: entry.status, remarks: entry.remarks, recorded_by: staff.actorId })
        .eq('id', recordId);
      if (!error) saved += 1;
      continue;
    }

    const { error } = await supabase.from('attendance').insert({
      student_id: entry.studentId,
      class_id: classId,
      subject_id: null,
      academic_year_id: academicYear?.id ?? null,
      term_id: termId.length > 0 ? termId : null,
      attendance_date: attendanceDate,
      status: entry.status,
      remarks: entry.remarks,
      recorded_by: staff.actorId,
    });
    if (!error) saved += 1;
  }

  if (saved === 0) {
    return {
      status: 'error',
      message: 'Could not save the register. You can only mark attendance for your own classes.',
    };
  }

  await recordAudit({
    action: 'Attendance recorded',
    category: 'Student',
    details: `Marked ${saved} student(s) for ${attendanceDate}`,
    actorId: staff.actorId,
    actorName: staff.actorName,
  });

  revalidatePath('/staff/attendance');
  revalidatePath('/staff/dashboard');
  revalidatePath('/admin/attendance');

  return { status: 'success', message: `Register saved for ${saved} student(s).` };
}

/**
 * Saves a class gradebook for one subject and term. Each student appears in the
 * form as `ca1_<studentId>`, `ca2_<studentId>` and `exam_<studentId>`.
 */
export async function saveResultsAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const staff = await requireStaff();
  if (!staff.ok) return staff.state;

  const headerList = await headers();
  const limit = rateLimit(clientKey(headerList, 'results-save', staff.actorId), 40, 60_000);
  if (!limit.success) {
    return { status: 'error', message: `Too many requests. Try again in ${limit.retryAfterSeconds}s.` };
  }

  const classId = String(formData.get('classId') ?? '');
  const subjectId = String(formData.get('subjectId') ?? '');
  const termId = String(formData.get('termId') ?? '');

  if (!classId || !subjectId || !termId) {
    return { status: 'error', message: 'Select a class, a subject and a term before saving scores.' };
  }

  const studentIds = String(formData.get('studentIds') ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (studentIds.length === 0) {
    return { status: 'error', message: 'No students were found on this gradebook.' };
  }

  const errors: Record<string, string> = {};
  const rows: {
    student_id: string;
    subject_id: string;
    class_id: string;
    academic_year_id: string | null;
    term_id: string;
    ca1_score: number;
    ca2_score: number;
    exam_score: number;
    status: ResultStatus;
    entered_by: string;
    grade: null;
    remark: null;
    position_in_class: null;
    approved_by: null;
    approved_at: null;
  }[] = [];

  const supabase = await createClient();
  const { data: term } = await supabase.from('terms').select('id, academic_year_id').eq('id', termId).maybeSingle();

  for (const studentId of studentIds) {
    const ca1 = clampScore(String(formData.get(`ca1_${studentId}`) ?? ''), CA1_MAX);
    const ca2 = clampScore(String(formData.get(`ca2_${studentId}`) ?? ''), CA2_MAX);
    const exam = clampScore(String(formData.get(`exam_${studentId}`) ?? ''), EXAM_MAX);

    if (ca1 === null || ca2 === null || exam === null) {
      errors[studentId] = `Scores must be CA1 0-${CA1_MAX}, CA2 0-${CA2_MAX}, exam 0-${EXAM_MAX}.`;
      continue;
    }

    rows.push({
      student_id: studentId,
      subject_id: subjectId,
      class_id: classId,
      academic_year_id: term?.academic_year_id ?? null,
      term_id: termId,
      ca1_score: ca1,
      ca2_score: ca2,
      exam_score: exam,
      status: 'draft',
      grade: null,
      remark: null,
      position_in_class: null,
      approved_by: null,
      approved_at: null,
      entered_by: staff.actorId,
    });
  }

  if (rows.length === 0) {
    return { status: 'error', errors, message: 'Please review the highlighted scores.' };
  }

  const { error } = await supabase
    .from('results')
    .upsert(rows, { onConflict: 'student_id,subject_id,term_id' });

  if (error) {
    return {
      status: 'error',
      errors,
      message: 'Could not save the scores. You can only record results for your own classes.',
    };
  }

  await recordAudit({
    action: 'Results saved',
    category: 'Student',
    details: `Saved draft scores for ${rows.length} student(s)`,
    actorId: staff.actorId,
    actorName: staff.actorName,
  });

  revalidatePath('/staff/results-entry');
  revalidatePath('/staff/dashboard');
  revalidatePath('/admin/results');

  return { status: 'success', message: `Draft scores saved for ${rows.length} student(s).` };
}

/** Moves every draft score of a class + subject + term to `submitted`. */
export async function submitResultsAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const staff = await requireStaff();
  if (!staff.ok) return staff.state;

  const classId = String(formData.get('classId') ?? '');
  const subjectId = String(formData.get('subjectId') ?? '');
  const termId = String(formData.get('termId') ?? '');

  if (!classId || !subjectId || !termId) {
    return { status: 'error', message: 'Select a class, a subject and a term before submitting.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('results')
    .update({ status: 'submitted' })
    .eq('class_id', classId)
    .eq('subject_id', subjectId)
    .eq('term_id', termId)
    .eq('status', 'draft')
    .select('id');

  if (error) {
    return { status: 'error', message: 'Could not submit the gradebook. Please try again.' };
  }

  const submitted = data?.length ?? 0;
  if (submitted === 0) {
    return { status: 'error', message: 'There are no draft scores to submit for this selection.' };
  }

  await recordAudit({
    action: 'Results submitted',
    category: 'Student',
    details: `Submitted ${submitted} score(s) for review`,
    actorId: staff.actorId,
    actorName: staff.actorName,
  });

  revalidatePath('/staff/results-entry');
  revalidatePath('/staff/dashboard');
  revalidatePath('/admin/results');

  return { status: 'success', message: `Submitted ${submitted} score(s) for review.` };
}
