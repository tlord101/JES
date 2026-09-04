import { logAuditEvent } from './auditStore';

export interface AcademicSession {
  id: string;
  sessionName: string; // e.g. "2024/2025" or "2025/2026"
  isCurrent: boolean;
  startDate: string;
  endDate: string;
}

export interface AcademicTerm {
  id: string;
  sessionId: string;
  termName: 'First Term' | 'Second Term' | 'Third Term';
  isCurrent: boolean;
  startDate: string;
  endDate: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  hodName: string;
  description: string;
}

export interface AcademicClass {
  id: string;
  name: string; // e.g. "JSS 1 Blue", "SS 2 Science A"
  level: 'Nursery' | 'Primary' | 'Junior Secondary' | 'Senior Secondary';
  classTeacher: string;
  capacity: number;
  enrolledCount: number;
  sessionId: string;
  subjectIds: string[];
}

export interface AcademicSubject {
  id: string;
  code: string; // e.g. "MTH101"
  name: string; // e.g. "Mathematics"
  description: string;
  targetClass: string;
  teacherName: string;
  departmentId: string;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  sessionId: string;
  sessionName: string;
  termName: string;
  classId: string;
  className: string;
  subjectIds: string[];
  enrolledDate: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string;
}

export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  sessionId: string;
  sessionName: string;
  termName: 'First Term' | 'Second Term' | 'Third Term';
  subjectId: string;
  subjectName: string;
  caScore: number; // Max 30 or 40
  examScore: number; // Max 70 or 60
  totalScore: number; // Max 100
  grade: string; // A, B, C, D, E, F
  remark: string;
  status: 'Draft' | 'Reviewed' | 'Approved' | 'Published';
  positionInClass?: number;
  teacherRemark?: string;
  principalRemark?: string;
}

// Global In-Memory Stores
export const sessionsStore: AcademicSession[] = [
  { id: 'sess_1', sessionName: '2024/2025', isCurrent: true, startDate: '2024-09-09', endDate: '2025-07-25' },
  { id: 'sess_2', sessionName: '2025/2026', isCurrent: false, startDate: '2025-09-08', endDate: '2026-07-24' },
];

export const termsStore: AcademicTerm[] = [
  { id: 't_1', sessionId: 'sess_1', termName: 'First Term', isCurrent: false, startDate: '2024-09-09', endDate: '2024-12-13' },
  { id: 't_2', sessionId: 'sess_1', termName: 'Second Term', isCurrent: true, startDate: '2025-01-06', endDate: '2025-04-11' },
  { id: 't_3', sessionId: 'sess_1', termName: 'Third Term', isCurrent: false, startDate: '2025-04-28', endDate: '2025-07-25' },
];

export const departmentsStore: Department[] = [
  { id: 'dept_math', code: 'MTH', name: 'Mathematics & Computing', hodName: 'Mr. Osagie Aghedo', description: 'Pure & Applied Mathematics, Further Math, ICT, Computer Studies' },
  { id: 'dept_sci', code: 'SCI', name: 'Sciences & Technology', hodName: 'Dr. (Mrs.) B. Osagie', description: 'Physics, Chemistry, Biology, Agricultural Science' },
  { id: 'dept_eng', code: 'ENG', name: 'Languages & Humanities', hodName: 'Mrs. C. Nwachukwu', description: 'English Language, Literature, Civic Education, History' },
  { id: 'dept_bus', code: 'BUS', name: 'Commercial & Business Studies', hodName: 'Mr. E. Amadasun', description: 'Economics, Commerce, Financial Accounting' },
];

export const classesStore: AcademicClass[] = [
  { id: 'cls_ss1b', name: 'SS 1 Blue', level: 'Senior Secondary', classTeacher: 'Mr. Osagie Aghedo', capacity: 35, enrolledCount: 28, sessionId: 'sess_1', subjectIds: ['sub_mth', 'sub_eng', 'sub_phy', 'sub_chem'] },
  { id: 'cls_jss2g', name: 'JSS 2 Gold', level: 'Junior Secondary', classTeacher: 'Mrs. C. Nwachukwu', capacity: 35, enrolledCount: 30, sessionId: 'sess_1', subjectIds: ['sub_mth', 'sub_eng', 'sub_bio'] },
  { id: 'cls_ss2a', name: 'SS 2 Science A', level: 'Senior Secondary', classTeacher: 'Engr. K. Igbinovia', capacity: 35, enrolledCount: 25, sessionId: 'sess_1', subjectIds: ['sub_mth', 'sub_eng', 'sub_phy', 'sub_chem', 'sub_fmth'] },
];

export const subjectsStore: AcademicSubject[] = [
  { id: 'sub_mth', code: 'MTH101', name: 'Mathematics', description: 'Core General Mathematics', targetClass: 'All Classes', teacherName: 'Mr. Osagie Aghedo', departmentId: 'dept_math' },
  { id: 'sub_eng', code: 'ENG101', name: 'English Language', description: 'Grammar, Comprehension, and Essay Writing', targetClass: 'All Classes', teacherName: 'Mrs. C. Nwachukwu', departmentId: 'dept_eng' },
  { id: 'sub_phy', code: 'PHY201', name: 'Physics', description: 'Mechanics, Optics, and Modern Physics', targetClass: 'SS 1 - SS 3 Science', teacherName: 'Engr. K. Igbinovia', departmentId: 'dept_sci' },
  { id: 'sub_chem', code: 'CHM201', name: 'Chemistry', description: 'Inorganic, Organic, and Physical Chemistry', targetClass: 'SS 1 - SS 3 Science', teacherName: 'Dr. (Mrs.) B. Osagie', departmentId: 'dept_sci' },
  { id: 'sub_fmth', code: 'FMTH301', name: 'Further Mathematics', description: 'Advanced Algebra, Vectors, and Calculus', targetClass: 'SS 2 - SS 3 Science', teacherName: 'Mr. Osagie Aghedo', departmentId: 'dept_math' },
  { id: 'sub_bio', code: 'BIO101', name: 'Biology', description: 'Life Sciences and Plant/Animal Physiology', targetClass: 'JSS 1 - SS 3', teacherName: 'Mr. E. Amadasun', departmentId: 'dept_sci' },
];

export const enrollmentsStore: StudentEnrollment[] = [
  { id: 'enr_01', studentId: 'std_01', studentName: 'David Okafor', admissionNo: 'JES/2022/084', sessionId: 'sess_1', sessionName: '2024/2025', termName: 'Second Term', classId: 'cls_ss1b', className: 'SS 1 Blue', subjectIds: ['sub_mth', 'sub_eng', 'sub_phy', 'sub_chem'], enrolledDate: '2025-01-07' },
  { id: 'enr_02', studentId: 'std_02', studentName: 'Chinecherem Okafor', admissionNo: 'JES/2023/112', sessionId: 'sess_1', sessionName: '2024/2025', termName: 'Second Term', classId: 'cls_jss2g', className: 'JSS 2 Gold', subjectIds: ['sub_mth', 'sub_eng', 'sub_bio'], enrolledDate: '2025-01-07' },
];

export const attendanceStore: AttendanceRecord[] = [
  { id: 'att_01', date: '2025-02-12', classId: 'cls_ss1b', className: 'SS 1 Blue', studentId: 'std_01', studentName: 'David Okafor', status: 'Present' },
  { id: 'att_02', date: '2025-02-12', classId: 'cls_jss2g', className: 'JSS 2 Gold', studentId: 'std_02', studentName: 'Chinecherem Okafor', status: 'Present' },
];

export const resultsStore: StudentResult[] = [
  {
    id: 'res_01',
    studentId: 'std_01',
    studentName: 'David Okafor',
    admissionNo: 'JES/2022/084',
    className: 'SS 1 Blue',
    sessionId: 'sess_1',
    sessionName: '2024/2025',
    termName: 'First Term',
    subjectId: 'sub_mth',
    subjectName: 'Mathematics',
    caScore: 28,
    examScore: 60,
    totalScore: 88,
    grade: 'A',
    remark: 'Excellent',
    status: 'Published',
    positionInClass: 2,
    teacherRemark: 'Consistently demonstrates strong problem-solving analytical skills.',
    principalRemark: 'Outstanding academic effort. Maintain this high standard.',
  },
  {
    id: 'res_02',
    studentId: 'std_01',
    studentName: 'David Okafor',
    admissionNo: 'JES/2022/084',
    className: 'SS 1 Blue',
    sessionId: 'sess_1',
    sessionName: '2024/2025',
    termName: 'First Term',
    subjectId: 'sub_phy',
    subjectName: 'Physics',
    caScore: 27,
    examScore: 65,
    totalScore: 92,
    grade: 'A+',
    remark: 'Distinction',
    status: 'Published',
    positionInClass: 1,
    teacherRemark: 'Exceptional mastery of physical concepts and laboratory work.',
    principalRemark: 'Brilliant performance in pure science.',
  },
  {
    id: 'res_03',
    studentId: 'std_02',
    studentName: 'Chinecherem Okafor',
    admissionNo: 'JES/2023/112',
    className: 'JSS 2 Gold',
    sessionId: 'sess_1',
    sessionName: '2024/2025',
    termName: 'Second Term',
    subjectId: 'sub_mth',
    subjectName: 'Mathematics',
    caScore: 26,
    examScore: 58,
    totalScore: 84,
    grade: 'A',
    remark: 'Excellent',
    status: 'Approved', // Not yet Published
    positionInClass: 3,
    teacherRemark: 'Very attentive in class and prompt with assignments.',
    principalRemark: 'Commendable progress.',
  },
];

export function calculateGrade(totalScore: number): { grade: string; remark: string } {
  if (totalScore >= 90) return { grade: 'A+', remark: 'Distinction' };
  if (totalScore >= 80) return { grade: 'A', remark: 'Excellent' };
  if (totalScore >= 70) return { grade: 'B', remark: 'Very Good' };
  if (totalScore >= 60) return { grade: 'C', remark: 'Good' };
  if (totalScore >= 50) return { grade: 'D', remark: 'Pass' };
  return { grade: 'F', remark: 'Fail' };
}
