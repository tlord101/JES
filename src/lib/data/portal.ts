import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { listClasses, listSubjects, listTerms, type AttendanceSummary } from '@/lib/data/academics';
import { percentage } from '@/lib/format';
import type {
  AssignmentRow,
  AssignmentSubmissionRow,
  AttendanceRow,
  AttendanceStatus,
  Gender,
  InvoiceRow,
  MessageRow,
  MyChildRow,
  PaymentRow,
  ReportCardRow,
  ResultRow,
  ResultStatus,
  SchoolContactRow,
  StudentRow,
  StudentStatus,
  SubmissionStatus,
  TeacherDirectoryRow,
  TermName,
  TimetableRow,
} from '@/types/database';

/**
 * Read helpers for the parent and student portals.
 *
 * Row level security already restricts `students`, `attendance`, `results`,
 * `invoices` and `payments` to the signed-in family (`visible_student_ids`).
 * The only things policies cannot hand over are the *display* names that live
 * on `profiles`, so those are fetched through the security-definer helpers
 * created in migration 09 (`my_children`, `teacher_directory`, `school_contacts`).
 */

// ---------------------------------------------------------------------------
// View models
// ---------------------------------------------------------------------------

export type Ward = {
  studentId: string;
  profileId: string;
  fullName: string;
  admissionNo: string;
  classId: string | null;
  className: string | null;
  gender: Gender | null;
  status: StudentStatus;
  photoUrl: string | null;
  relationship: string;
  isPrimary: boolean;
};

export type StudentResult = {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  termId: string;
  termName: TermName | null;
  ca1Score: number;
  ca2Score: number;
  examScore: number;
  caScore: number;
  totalScore: number;
  grade: string | null;
  remark: string | null;
  positionInClass: number | null;
  status: ResultStatus;
};

export type AttendanceDay = {
  id: string;
  date: string;
  status: AttendanceStatus;
  remarks: string | null;
  subjectName: string | null;
};

export type WardAttendance = {
  summary: AttendanceSummary;
  /** Present + late as a percentage of every marked day. */
  rate: number;
  recent: AttendanceDay[];
};

export type ReportCardSummary = {
  id: string;
  termId: string;
  termName: TermName | null;
  subjectsOffered: number | null;
  totalScore: number | null;
  averageScore: number | null;
  positionInClass: number | null;
  classSize: number | null;
  daysSchoolOpen: number | null;
  daysPresent: number | null;
  daysAbsent: number | null;
  nextTermBegins: string | null;
  classTeacherRemark: string | null;
  principalRemark: string | null;
  publishedAt: string | null;
};

export type WardFeeSummary = {
  invoices: InvoiceRow[];
  payments: PaymentRow[];
  billed: number;
  paid: number;
  outstanding: number;
};

export type TimetableLesson = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string | null;
  subjectId: string | null;
  subjectName: string;
  subjectCode: string | null;
  teacherName: string | null;
};

export type AssignmentItem = {
  id: string;
  title: string;
  description: string | null;
  subjectName: string | null;
  dueDate: string | null;
  maxScore: number;
  submissionStatus: SubmissionStatus | 'not-submitted';
  score: number | null;
  feedback: string | null;
  submittedAt: string | null;
};

export type SchoolContact = {
  profileId: string;
  fullName: string;
  role: string;
};

export type MessageItem = {
  id: string;
  subject: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  direction: 'incoming' | 'outgoing';
  counterpartName: string;
};

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** profile id -> teacher name, from the public staff directory projection. */
async function teacherNames(): Promise<Map<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('teacher_directory', {});
  if (error || !data) return new Map();
  return new Map(
    (data as TeacherDirectoryRow[]).map((row) => [row.profile_id, row.full_name])
  );
}

function emptySummary(total = 0): AttendanceSummary {
  return { present: 0, absent: 0, late: 0, excused: 0, unmarked: 0, total };
}

/** Average of the published totals, or null when nothing is published yet. */
export function averageScore(results: StudentResult[]): number | null {
  if (results.length === 0) return null;
  const total = results.reduce((sum, result) => sum + Number(result.totalScore), 0);
  return Math.round((total / results.length) * 100) / 100;
}

/** Plain-English standing for a term average (`72.4` -> `Credit`). */
export function performanceBand(average: number | null): string {
  if (average === null) return 'No published results yet';
  if (average >= 75) return 'Excellent';
  if (average >= 65) return 'Very good';
  if (average >= 55) return 'Good';
  if (average >= 45) return 'Fair';
  return 'Needs attention';
}

// ---------------------------------------------------------------------------
// Parent portal
// ---------------------------------------------------------------------------

/** Wards of the signed-in parent (empty for any other role). */
export const listMyChildren = cache(async (): Promise<Ward[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('my_children', {});
  if (error || !data) return [];

  return (data as MyChildRow[]).map((row) => ({
    studentId: row.student_id,
    profileId: row.profile_id,
    fullName: row.full_name,
    admissionNo: row.admission_no,
    classId: row.class_id,
    className: row.class_name,
    gender: row.gender,
    status: row.status,
    photoUrl: row.photo_url,
    relationship: row.relationship,
    isPrimary: row.is_primary,
  }));
});

/**
 * Published results of one student, newest first.
 * Only `published` rows are requested: the portal must never show a draft or a
 * score the school has not approved.
 */
export async function listPublishedResults(
  studentId: string,
  termId?: string
): Promise<StudentResult[]> {
  const supabase = await createClient();
  let query = supabase
    .from('results')
    .select('*')
    .eq('student_id', studentId)
    .eq('status', 'published');

  if (termId) query = query.eq('term_id', termId);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error || !data) return [];

  const rows = data as ResultRow[];
  const [subjects, terms] = await Promise.all([listSubjects(), listTerms()]);
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));
  const termById = new Map(terms.map((term) => [term.id, term]));

  return rows.map((row) => ({
    id: row.id,
    subjectId: row.subject_id,
    subjectName: subjectById.get(row.subject_id)?.name ?? 'Subject',
    subjectCode: subjectById.get(row.subject_id)?.code ?? '—',
    termId: row.term_id,
    termName: termById.get(row.term_id)?.name ?? null,
    ca1Score: Number(row.ca1_score),
    ca2Score: Number(row.ca2_score),
    examScore: Number(row.exam_score),
    caScore: Number(row.ca_score),
    totalScore: Number(row.total_score),
    grade: row.grade,
    remark: row.remark,
    positionInClass: row.position_in_class,
    status: row.status,
  }));
}

/** Attendance totals and the most recent marked days for one student. */
export async function getStudentAttendance(studentId: string, limit = 120): Promise<WardAttendance> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('student_id', studentId)
    .order('attendance_date', { ascending: false })
    .limit(limit);

  if (error || !data) return { summary: emptySummary(), rate: 0, recent: [] };

  const rows = data as AttendanceRow[];
  const summary = emptySummary(rows.length);
  for (const row of rows) summary[row.status] += 1;

  const subjects = await listSubjects();
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));

  return {
    summary,
    rate: percentage(summary.present + summary.late, summary.total),
    recent: rows.slice(0, 12).map((row) => ({
      id: row.id,
      date: row.attendance_date,
      status: row.status,
      remarks: row.remarks,
      subjectName: row.subject_id ? subjectById.get(row.subject_id)?.name ?? null : null,
    })),
  };
}

/** Published report cards for one student, newest first. */
export async function listStudentReportCards(studentId: string): Promise<ReportCardSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('report_cards')
    .select('*')
    .eq('student_id', studentId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  const terms = await listTerms();
  const termById = new Map(terms.map((term) => [term.id, term]));

  return (data as ReportCardRow[]).map((row) => ({
    id: row.id,
    termId: row.term_id,
    termName: termById.get(row.term_id)?.name ?? null,
    subjectsOffered: row.subjects_offered,
    totalScore: row.total_score === null ? null : Number(row.total_score),
    averageScore: row.average_score === null ? null : Number(row.average_score),
    positionInClass: row.position_in_class,
    classSize: row.class_size,
    daysSchoolOpen: row.days_school_open,
    daysPresent: row.days_present,
    daysAbsent: row.days_absent,
    nextTermBegins: row.next_term_begins,
    classTeacherRemark: row.class_teacher_remark,
    principalRemark: row.principal_remark,
    publishedAt: row.published_at,
  }));
}

/** Invoices and payments for one student, with running totals. */
export async function getStudentFees(studentId: string): Promise<WardFeeSummary> {
  const supabase = await createClient();
  const [invoicesResult, paymentsResult] = await Promise.all([
    supabase
      .from('invoices')
      .select('*')
      .eq('student_id', studentId)
      .order('issued_at', { ascending: false }),
    supabase
      .from('payments')
      .select('*')
      .eq('student_id', studentId)
      .order('paid_at', { ascending: false }),
  ]);

  const invoices = (invoicesResult.data ?? []) as InvoiceRow[];
  const payments = (paymentsResult.data ?? []) as PaymentRow[];
  const billable = invoices.filter((invoice) => invoice.status !== 'cancelled');

  return {
    invoices,
    payments,
    billed: billable.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0),
    paid: payments
      .filter((payment) => payment.status === 'completed')
      .reduce((sum, payment) => sum + Number(payment.amount), 0),
    outstanding: billable.reduce((sum, invoice) => sum + Number(invoice.balance), 0),
  };
}

export type WardOverview = {
  ward: Ward;
  attendance: WardAttendance;
  results: StudentResult[];
  average: number | null;
  fees: WardFeeSummary;
};

/** Everything the parent portal shows about a single ward. */
export async function getWardOverview(ward: Ward): Promise<WardOverview> {
  const [attendance, results, fees] = await Promise.all([
    getStudentAttendance(ward.studentId),
    listPublishedResults(ward.studentId),
    getStudentFees(ward.studentId),
  ]);

  return { ward, attendance, results, average: averageScore(results), fees };
}

/** One overview per ward — powers the dashboard and the children list. */
export const getFamilyOverview = cache(async (): Promise<WardOverview[]> => {
  const children = await listMyChildren();
  return Promise.all(children.map(getWardOverview));
});

/** Office accounts a parent may write to from the portal. */
export const listSchoolContacts = cache(async (): Promise<SchoolContact[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('school_contacts', {});
  if (error || !data) return [];

  return (data as SchoolContactRow[]).map((row) => ({
    profileId: row.profile_id,
    fullName: row.full_name,
    role: row.role,
  }));
});

/** Inbox + outbox for the signed-in family account, newest first. */
export async function listMyMessages(
  user: { id: string; fullName: string },
  limit = 50
): Promise<MessageItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const rows = data as MessageRow[];
  const [contacts, children] = await Promise.all([listSchoolContacts(), listMyChildren()]);

  const nameById = new Map<string, string>([[user.id, user.fullName]]);
  for (const contact of contacts) nameById.set(contact.profileId, contact.fullName);
  for (const child of children) nameById.set(child.profileId, child.fullName);

  return rows.map((row) => {
    const outgoing = row.sender_id === user.id;
    const counterpart = outgoing ? row.recipient_id : row.sender_id;
    return {
      id: row.id,
      subject: row.subject,
      body: row.body,
      createdAt: row.created_at,
      isRead: row.is_read,
      direction: outgoing ? ('outgoing' as const) : ('incoming' as const),
      counterpartName: nameById.get(counterpart) ?? 'School office',
    };
  });
}

/** Unread badge for the dashboard tile. */
export async function countUnreadMessages(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);

  if (error) return 0;
  return count ?? 0;
}

// ---------------------------------------------------------------------------
// Student portal
// ---------------------------------------------------------------------------

export type StudentSelf = {
  studentId: string;
  profileId: string;
  admissionNo: string;
  classId: string | null;
  className: string | null;
  gender: Gender | null;
  status: StudentStatus;
  photoUrl: string | null;
};

/** Own student record of the signed-in student (null for any other role). */
export const getMyStudentRecord = cache(async (userId: string): Promise<StudentSelf | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from('students')
    .select('*')
    .eq('profile_id', userId)
    .maybeSingle();

  if (!data) return null;

  const row = data as StudentRow;
  const classes = await listClasses();
  const className = row.class_id
    ? classes.find((item) => item.id === row.class_id)?.name ?? null
    : null;

  return {
    studentId: row.id,
    profileId: row.profile_id,
    admissionNo: row.admission_no,
    classId: row.class_id,
    className,
    gender: row.gender,
    status: row.status,
    photoUrl: row.photo_url,
  };
});

/** Weekly timetable of a class, optionally pinned to one term. */
export async function listClassTimetable(
  classId: string,
  termId?: string
): Promise<TimetableLesson[]> {
  const supabase = await createClient();
  let query = supabase.from('timetables').select('*').eq('class_id', classId);
  if (termId) query = query.eq('term_id', termId);

  const { data, error } = await query
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error || !data) return [];

  const rows = data as TimetableRow[];
  const [subjects, teachers] = await Promise.all([listSubjects(), teacherNames()]);
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));

  return rows.map((row) => {
    const subject = row.subject_id ? subjectById.get(row.subject_id) : undefined;
    return {
      id: row.id,
      dayOfWeek: row.day_of_week,
      startTime: row.start_time,
      endTime: row.end_time,
      room: row.room,
      subjectId: row.subject_id,
      subjectName: subject?.name ?? 'Lesson',
      subjectCode: subject?.code ?? null,
      teacherName: row.teacher_id ? teachers.get(row.teacher_id) ?? null : null,
    };
  });
}

/** Published assignments of a class joined with this student's submission. */
export async function listClassAssignments(
  classId: string,
  studentId: string
): Promise<AssignmentItem[]> {
  const supabase = await createClient();
  const [assignmentsResult, submissionsResult] = await Promise.all([
    supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classId)
      .eq('is_published', true)
      .order('due_date', { ascending: false, nullsFirst: false }),
    supabase.from('assignment_submissions').select('*').eq('student_id', studentId),
  ]);

  const assignments = (assignmentsResult.data ?? []) as AssignmentRow[];
  const submissions = (submissionsResult.data ?? []) as AssignmentSubmissionRow[];
  const submissionByAssignment = new Map(submissions.map((row) => [row.assignment_id, row]));

  const subjects = await listSubjects();
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));

  return assignments.map((row) => {
    const submission = submissionByAssignment.get(row.id);
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      subjectName: row.subject_id ? subjectById.get(row.subject_id)?.name ?? null : null,
      dueDate: row.due_date,
      maxScore: Number(row.max_score),
      submissionStatus: submission ? submission.status : ('not-submitted' as const),
      score: submission?.score === null || submission?.score === undefined ? null : Number(submission.score),
      feedback: submission?.feedback ?? null,
      submittedAt: submission?.submitted_at ?? null,
    };
  });
}

export type StudentDashboard = {
  attendance: WardAttendance;
  results: StudentResult[];
  average: number | null;
  lessonsToday: TimetableLesson[];
  assignmentCount: number;
  pendingAssignments: number;
  nextAssignment: AssignmentItem | null;
};

/** Aggregates for the student home page. */
export async function getStudentDashboard(record: StudentSelf): Promise<StudentDashboard> {
  const [attendance, results, timetable, assignments] = await Promise.all([
    getStudentAttendance(record.studentId),
    listPublishedResults(record.studentId),
    record.classId ? listClassTimetable(record.classId) : Promise.resolve([] as TimetableLesson[]),
    record.classId
      ? listClassAssignments(record.classId, record.studentId)
      : Promise.resolve([] as AssignmentItem[]),
  ]);

  const today = new Date().getDay();
  const pending = assignments.filter(
    (item) => item.submissionStatus === 'not-submitted' || item.submissionStatus === 'pending'
  );

  return {
    attendance,
    results,
    average: averageScore(results),
    lessonsToday: timetable.filter((lesson) => lesson.dayOfWeek === today),
    assignmentCount: assignments.length,
    pendingAssignments: pending.length,
    nextAssignment: pending[0] ?? null,
  };
}

