import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type {
  AcademicYearRow,
  TermRow,
  ClassRow,
  SubjectRow,
  StudentRow,
  AttendanceRow,
  ResultRow,
  AttendanceStatus,
  ResultStatus,
  StudentStatus,
  Gender,
  SchoolLevel,
  TermName,
} from '@/types/database';

// ---------------------------------------------------------------------------
// View models
// ---------------------------------------------------------------------------

export type AcademicYear = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
};

export type Term = {
  id: string;
  academicYearId: string;
  name: TermName;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
};

export type SchoolClass = {
  id: string;
  name: string;
  level: SchoolLevel;
  arm: string | null;
  room: string | null;
  classTeacherId: string | null;
  classTeacherName: string | null;
  studentCount: number;
};

export type Subject = {
  id: string;
  code: string;
  name: string;
  department: string | null;
  level: SchoolLevel | null;
};

export type StudentSummary = {
  id: string;
  profileId: string;
  admissionNo: string;
  fullName: string;
  classId: string | null;
  className: string | null;
  gender: Gender | null;
  status: StudentStatus;
  photoUrl: string | null;
};

export type AttendanceRegisterEntry = {
  studentId: string;
  admissionNo: string;
  fullName: string;
  status: AttendanceStatus | 'unmarked';
  remarks: string | null;
};

export type GradebookEntry = {
  studentId: string;
  admissionNo: string;
  fullName: string;
  ca1Score: number;
  ca2Score: number;
  examScore: number;
  totalScore: number;
  grade: string | null;
  remark: string | null;
  status: ResultStatus | 'not-entered';
};

export type AttendanceSummary = {
  present: number;
  absent: number;
  late: number;
  excused: number;
  unmarked: number;
  total: number;
};

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapAcademicYear(row: AcademicYearRow): AcademicYear {
  return {
    id: row.id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
  };
}

function mapTerm(row: TermRow): Term {
  return {
    id: row.id,
    academicYearId: row.academic_year_id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
  };
}

function mapClass(row: ClassRow, teacherName: string | null, studentCount: number): SchoolClass {
  return {
    id: row.id,
    name: row.name,
    level: row.level,
    arm: row.arm,
    room: row.room,
    classTeacherId: row.class_teacher_id,
    classTeacherName: teacherName,
    studentCount,
  };
}

function mapSubject(row: SubjectRow): Subject {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    department: row.department,
    level: row.level,
  };
}

function mapStudent(row: StudentRow, fullName: string, className: string | null): StudentSummary {
  return {
    id: row.id,
    profileId: row.profile_id,
    admissionNo: row.admission_no,
    fullName,
    classId: row.class_id,
    className,
    gender: row.gender,
    status: row.status,
    photoUrl: row.photo_url,
  };
}

/** Resolves profile ids to display names in a single query. */
async function namesByIds(ids: (string | null)[]): Promise<Map<string, string>> {
  const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  if (unique.length === 0) return new Map();

  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('id, full_name').in('id', unique);
  if (!data) return new Map();

  return new Map(data.map((row) => [row.id, row.full_name]));
}

// ---------------------------------------------------------------------------
// Academic calendar
// ---------------------------------------------------------------------------

export const listAcademicYears = cache(async (): Promise<AcademicYear[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('academic_years')
    .select('*')
    .order('start_date', { ascending: false });

  if (error || !data) return [];
  return data.map((row) => mapAcademicYear(row as AcademicYearRow));
});

export const listTerms = cache(async (): Promise<Term[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('terms')
    .select('*')
    .order('start_date', { ascending: false });

  if (error || !data) return [];
  return data.map((row) => mapTerm(row as TermRow));
});

/** The current term, falling back to the most recent one that has been set up. */
export const getCurrentTerm = cache(async (): Promise<Term | null> => {
  const supabase = await createClient();
  const { data } = await supabase.from('terms').select('*').eq('is_current', true).maybeSingle();
  if (data) return mapTerm(data as TermRow);

  const terms = await listTerms();
  return terms[0] ?? null;
});

// ---------------------------------------------------------------------------
// Classes, subjects and students
// ---------------------------------------------------------------------------

export const listClasses = cache(async (): Promise<SchoolClass[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('name', { ascending: true });

  if (error || !data) return [];
  const rows = data as ClassRow[];

  const { data: students } = await supabase.from('students').select('class_id, status');
  const counts = new Map<string, number>();
  for (const student of students ?? []) {
    if (student.status !== 'active' || !student.class_id) continue;
    counts.set(student.class_id, (counts.get(student.class_id) ?? 0) + 1);
  }

  const names = await namesByIds(rows.map((row) => row.class_teacher_id));
  return rows.map((row) => mapClass(row, names.get(row.class_teacher_id ?? '') ?? null, counts.get(row.id) ?? 0));
});

export async function getClassById(id: string): Promise<SchoolClass | null> {
  const classes = await listClasses();
  return classes.find((item) => item.id === id) ?? null;
}

export const listSubjects = cache(async (): Promise<Subject[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error || !data) return [];
  return (data as SubjectRow[]).map(mapSubject);
});

/** Every active student of a class, ordered by admission number. */
export async function listClassRoster(classId: string): Promise<StudentSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('class_id', classId)
    .eq('status', 'active')
    .order('admission_no', { ascending: true });

  if (error || !data) return [];
  const rows = data as StudentRow[];

  const classes = await listClasses();
  const className = classes.find((item) => item.id === classId)?.name ?? null;
  const names = await namesByIds(rows.map((row) => row.profile_id));

  return rows.map((row) => mapStudent(row, names.get(row.profile_id) ?? 'Unnamed student', className));
}

/** Active students across a set of classes (used by the staff students list). */
export async function listStudentsByClasses(classIds: string[]): Promise<StudentSummary[]> {
  if (classIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .in('class_id', classIds)
    .eq('status', 'active')
    .order('admission_no', { ascending: true });

  if (error || !data) return [];
  const rows = data as StudentRow[];

  const classes = await listClasses();
  const nameById = new Map(classes.map((item) => [item.id, item.name]));
  const profileNames = await namesByIds(rows.map((row) => row.profile_id));

  return rows.map((row) =>
    mapStudent(row, profileNames.get(row.profile_id) ?? 'Unnamed student', row.class_id ? nameById.get(row.class_id) ?? null : null)
  );
}

/** Classes where the user is the form teacher, plus classes they teach a subject in. */
export async function listTeacherClasses(userId: string): Promise<SchoolClass[]> {
  const classes = await listClasses();
  const supabase = await createClient();

  const { data: assignments } = await supabase
    .from('class_subjects')
    .select('class_id')
    .eq('teacher_id', userId);

  const taught = new Set((assignments ?? []).map((row) => row.class_id));
  const teaching = classes.filter((item) => item.classTeacherId === userId || taught.has(item.id));

  // Administrators and academic leadership see every class.
  return teaching.length > 0 ? teaching : classes;
}

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------

/** Roster + saved marks for one class on one date (daily register, no subject). */
export async function getAttendanceRegister(
  classId: string,
  attendanceDate: string
): Promise<AttendanceRegisterEntry[]> {
  const roster = await listClassRoster(classId);
  if (roster.length === 0) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('attendance')
    .select('*')
    .eq('class_id', classId)
    .eq('attendance_date', attendanceDate)
    .is('subject_id', null);

  const byStudent = new Map<string, AttendanceRow>();
  for (const row of (data ?? []) as AttendanceRow[]) byStudent.set(row.student_id, row);

  return roster.map((student) => {
    const record = byStudent.get(student.id);
    return {
      studentId: student.id,
      admissionNo: student.admissionNo,
      fullName: student.fullName,
      status: record ? record.status : ('unmarked' as const),
      remarks: record?.remarks ?? null,
    };
  });
}

export function summariseAttendance(entries: AttendanceRegisterEntry[]): AttendanceSummary {
  const summary: AttendanceSummary = { present: 0, absent: 0, late: 0, excused: 0, unmarked: 0, total: entries.length };
  for (const entry of entries) summary[entry.status === 'unmarked' ? 'unmarked' : entry.status] += 1;
  return summary;
}

/** Attendance totals for a student across every recorded day. */
export async function getStudentAttendanceSummary(
  studentId: string
): Promise<{ status: AttendanceStatus; days: number }[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('attendance').select('status').eq('student_id', studentId);
  if (!data) return [];

  const counts = new Map<AttendanceStatus, number>();
  for (const row of data as { status: AttendanceStatus }[]) {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  }

  return [...counts.entries()].map(([status, days]) => ({ status, days }));
}

// ---------------------------------------------------------------------------
// Results / gradebook
// ---------------------------------------------------------------------------

export async function getGradebook(
  classId: string,
  subjectId: string,
  termId: string
): Promise<GradebookEntry[]> {
  const roster = await listClassRoster(classId);
  if (roster.length === 0) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('results')
    .select('*')
    .eq('class_id', classId)
    .eq('subject_id', subjectId)
    .eq('term_id', termId);

  const byStudent = new Map<string, ResultRow>();
  for (const row of (data ?? []) as ResultRow[]) byStudent.set(row.student_id, row);

  return roster.map((student) => {
    const result = byStudent.get(student.id);
    return {
      studentId: student.id,
      admissionNo: student.admissionNo,
      fullName: student.fullName,
      ca1Score: result?.ca1_score ?? 0,
      ca2Score: result?.ca2_score ?? 0,
      examScore: result?.exam_score ?? 0,
      totalScore: result?.total_score ?? 0,
      grade: result?.grade ?? null,
      remark: result?.remark ?? null,
      status: result ? result.status : ('not-entered' as const),
    };
  });
}

/** Highest score in the class (rank 1) — used for the position column. */
export function classAverage(entries: GradebookEntry[]): number {
  const scored = entries.filter((entry) => entry.status !== 'not-entered');
  if (scored.length === 0) return 0;
  const total = scored.reduce((sum, entry) => sum + Number(entry.totalScore), 0);
  return Math.round((total / scored.length) * 100) / 100;
}

/** Published results of one student, newest term first. */
export async function listStudentResults(studentId: string): Promise<GradebookEntry[]> {
  const subjects = await listSubjects();
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));

  const supabase = await createClient();
  const { data } = await supabase
    .from('results')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (!data) return [];
  return (data as ResultRow[]).map((row) => ({
    studentId: row.student_id,
    admissionNo: subjectById.get(row.subject_id)?.code ?? '',
    fullName: subjectById.get(row.subject_id)?.name ?? 'Subject',
    ca1Score: Number(row.ca1_score),
    ca2Score: Number(row.ca2_score),
    examScore: Number(row.exam_score),
    totalScore: Number(row.total_score),
    grade: row.grade,
    remark: row.remark,
    status: row.status,
  }));
}

// ---------------------------------------------------------------------------
// Staff dashboard aggregates
// ---------------------------------------------------------------------------

export type TeacherDashboard = {
  classes: SchoolClass[];
  studentCount: number;
  subjectCount: number;
  attendanceMarkedToday: number;
  draftResults: number;
  submittedResults: number;
  term: Term | null;
};

export async function getTeacherDashboard(userId: string): Promise<TeacherDashboard> {
  const [classes, term, subjects] = await Promise.all([
    listTeacherClasses(userId),
    getCurrentTerm(),
    listSubjects(),
  ]);
  const classIds = classes.map((item) => item.id);

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [students, todayAttendance, results] = await Promise.all([
    listStudentsByClasses(classIds),
    classIds.length > 0
      ? supabase.from('attendance').select('id').in('class_id', classIds).eq('attendance_date', today)
      : Promise.resolve({ data: [] as { id: string }[] }),
    classIds.length > 0 && term
      ? supabase.from('results').select('status').in('class_id', classIds).eq('term_id', term.id)
      : Promise.resolve({ data: [] as { status: ResultStatus }[] }),
  ]);

  const marked = new Set((todayAttendance.data ?? []).map((row) => row.id));
  const resultRows = (results.data ?? []) as { status: ResultStatus }[];

  return {
    classes,
    studentCount: students.length,
    subjectCount: subjects.length,
    attendanceMarkedToday: marked.size,
    draftResults: resultRows.filter((row) => row.status === 'draft').length,
    submittedResults: resultRows.filter((row) => row.status === 'submitted').length,
    term,
  };
}
