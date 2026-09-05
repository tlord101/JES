export interface AssignedClass {
  id: string;
  name: string;
  category: string;
  studentCount: number;
  room: string;
  isFormTeacher: boolean;
}

export interface AssignedSubject {
  id: string;
  name: string;
  code: string;
  classes: string[];
  totalStudents: number;
}

export interface StaffStudent {
  id: string;
  name: string;
  admissionNo: string;
  classId: string;
  className: string;
  gender: string;
  guardianName: string;
  guardianPhone: string;
  attendanceRate: number;
  averageGrade: number;
  conductRemark: string;
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late';
  note?: string;
}

export interface AttendanceRegister {
  classId: string;
  date: string;
  records: AttendanceRecord[];
}

export interface Submission {
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl?: string;
  content?: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface StaffAssignment {
  id: string;
  title: string;
  subject: string;
  classId: string;
  className: string;
  dueDate: string;
  maxScore: number;
  instructions: string;
  attachmentUrl?: string;
  submissions: Submission[];
}

export interface QuestionBankItem {
  id: string;
  type: 'mcq' | 'multi_select' | 'true_false' | 'short_answer' | 'fill_in_blank' | 'image' | 'math';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  marks: number;
  subject: string;
  classId: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl?: string;
  mathFormula?: string;
}

export interface StaffExam {
  id: string;
  title: string;
  subject: string;
  classId: string;
  className: string;
  date: string;
  durationMinutes: number;
  totalMarks: number;
  questionIds: string[];
  publishedStatus: 'draft' | 'scheduled' | 'active' | 'completed';
}

export interface DraftResult {
  studentId: string;
  studentName: string;
  classId: string;
  subject: string;
  ca1: number; // Max 20
  ca2: number; // Max 20
  exam: number; // Max 60
  teacherRemark: string;
  status: 'draft' | 'submitted_for_review' | 'approved';
}

export interface StaffLessonMaterial {
  id: string;
  title: string;
  subject: string;
  classId: string;
  className: string;
  topic: string;
  type: 'pdf' | 'doc' | 'video' | 'quiz';
  fileUrl: string;
  uploadedAt: string;
}

export interface StaffProfile {
  id: string;
  name: string;
  staffId: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  qualification: string;
  assignedClasses: AssignedClass[];
  assignedSubjects: AssignedSubject[];
}

export const mockStaffProfile: StaffProfile = {
  id: 'st-101',
  name: 'Mr. Babatunde Adeleke',
  staffId: 'JES/STAFF/2021/014',
  email: 'babatunde.adeleke@jasmine-school.edu.ng',
  phone: '+234 803 123 4567',
  role: 'Senior Science Master & Form Teacher SS1 Blue',
  department: 'Sciences',
  qualification: 'B.Sc (Ed) Mathematics & Computer Science, M.Ed Educational Tech',
  assignedClasses: [
    { id: 'ss1-blue', name: 'SS 1 Blue', category: 'Senior Secondary', studentCount: 38, room: 'Room B-12', isFormTeacher: true },
    { id: 'jss2-gold', name: 'JSS 2 Gold', category: 'Junior Secondary', studentCount: 42, room: 'Room A-08', isFormTeacher: false },
  ],
  assignedSubjects: [
    { id: 'math-ss1', name: 'Mathematics', code: 'MTH101', classes: ['SS 1 Blue'], totalStudents: 38 },
    { id: 'fmath-ss1', name: 'Further Mathematics', code: 'FMTH101', classes: ['SS 1 Blue'], totalStudents: 24 },
    { id: 'basic-tech-jss2', name: 'Basic Technology', code: 'BTEC201', classes: ['JSS 2 Gold'], totalStudents: 42 },
  ],
};

export const mockStaffStudents: StaffStudent[] = [
  {
    id: 'jes-std-001',
    name: 'David Okafor',
    admissionNo: 'JES/2022/084',
    classId: 'ss1-blue',
    className: 'SS 1 Blue',
    gender: 'Male',
    guardianName: 'Dr. Emmanuel Okafor',
    guardianPhone: '+234 802 998 1122',
    attendanceRate: 96.5,
    averageGrade: 88.4,
    conductRemark: 'Exemplary conduct and active class participant.',
  },
  {
    id: 'jes-std-002',
    name: 'Amina Bello',
    admissionNo: 'JES/2022/091',
    classId: 'ss1-blue',
    className: 'SS 1 Blue',
    gender: 'Female',
    guardianName: 'Alhaji Sanusi Bello',
    guardianPhone: '+234 803 444 5566',
    attendanceRate: 94.0,
    averageGrade: 91.2,
    conductRemark: 'Consistent academic excellence and respectful.',
  },
  {
    id: 'jes-std-003',
    name: 'Emeka Nwosu',
    admissionNo: 'JES/2022/105',
    classId: 'ss1-blue',
    className: 'SS 1 Blue',
    gender: 'Male',
    guardianName: 'Chief Kenneth Nwosu',
    guardianPhone: '+234 805 111 2233',
    attendanceRate: 88.0,
    averageGrade: 74.5,
    conductRemark: 'Capable student; needs more concentration during lectures.',
  },
  {
    id: 'jes-std-004',
    name: 'Chinecherem Okafor',
    admissionNo: 'JES/2023/112',
    classId: 'jss2-gold',
    className: 'JSS 2 Gold',
    gender: 'Female',
    guardianName: 'Dr. Emmanuel Okafor',
    guardianPhone: '+234 802 998 1122',
    attendanceRate: 98.0,
    averageGrade: 84.2,
    conductRemark: 'Diligent worker with high enthusiasm for STEM.',
  },
];

export const mockQuestionBank: QuestionBankItem[] = [
  {
    id: 'q-101',
    type: 'mcq',
    question: 'Solve for x in the equation: 2x² - 8 = 0',
    options: ['x = ±2', 'x = 4', 'x = ±4', 'x = 2'],
    correctAnswer: 'x = ±2',
    explanation: '2x² = 8 => x² = 4 => x = ±2.',
    marks: 2,
    subject: 'Mathematics',
    classId: 'ss1-blue',
    topic: 'Quadratic Equations',
    difficulty: 'Medium',
    mathFormula: '2x^2 - 8 = 0',
  },
  {
    id: 'q-102',
    type: 'multi_select',
    question: 'Which of the following are prime numbers?',
    options: ['2', '9', '17', '21', '31'],
    correctAnswer: ['2', '17', '31'],
    explanation: '2, 17, and 31 have only two distinct positive divisors: 1 and themselves.',
    marks: 3,
    subject: 'Mathematics',
    classId: 'ss1-blue',
    topic: 'Number Theory',
    difficulty: 'Easy',
  },
  {
    id: 'q-103',
    type: 'true_false',
    question: 'The derivative of sin(x) with respect to x is cos(x).',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'd/dx[sin(x)] = cos(x) is a standard trigonometric differentiation derivative.',
    marks: 1,
    subject: 'Further Mathematics',
    classId: 'ss1-blue',
    topic: 'Calculus',
    difficulty: 'Easy',
  },
  {
    id: 'q-104',
    type: 'short_answer',
    question: 'What is the sum of interior angles of a hexagon?',
    correctAnswer: '720 degrees',
    explanation: '(n - 2) * 180 = (6 - 2) * 180 = 720 degrees.',
    marks: 2,
    subject: 'Mathematics',
    classId: 'ss1-blue',
    topic: 'Polygons',
    difficulty: 'Medium',
  },
  {
    id: 'q-105',
    type: 'fill_in_blank',
    question: 'The Pythagorean theorem states that in a right-angled triangle, a² + b² = ______.',
    correctAnswer: 'c²',
    explanation: 'c represents the length of the hypotenuse.',
    marks: 2,
    subject: 'Mathematics',
    classId: 'ss1-blue',
    topic: 'Geometry',
    difficulty: 'Easy',
  },
  {
    id: 'q-106',
    type: 'image',
    question: 'Identify the geometric transformation shown in the diagram:',
    options: ['Rotation', 'Reflection', 'Translation', 'Dilation'],
    correctAnswer: 'Reflection',
    explanation: 'The shape is mirrored across the vertical axis line.',
    marks: 2,
    subject: 'Mathematics',
    classId: 'ss1-blue',
    topic: 'Transformations',
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'q-107',
    type: 'math',
    question: 'Evaluate the definite integral ∫ from 0 to 2 of 3x² dx',
    correctAnswer: '8',
    explanation: '[x³] from 0 to 2 = 2³ - 0 = 8.',
    marks: 4,
    subject: 'Further Mathematics',
    classId: 'ss1-blue',
    topic: 'Integration',
    difficulty: 'Hard',
    mathFormula: '\\int_{0}^{2} 3x^2 dx',
  },
];

export const mockStaffAssignments: StaffAssignment[] = [
  {
    id: 'asg-301',
    title: 'Quadratic Functions & Graphs Worksheet',
    subject: 'Mathematics',
    classId: 'ss1-blue',
    className: 'SS 1 Blue',
    dueDate: '2025-03-28',
    maxScore: 20,
    instructions: 'Plot the quadratic curves for questions 1 to 5 on graph paper and state roots.',
    attachmentUrl: '/docs/quadratic_worksheet.pdf',
    submissions: [
      {
        studentId: 'jes-std-001',
        studentName: 'David Okafor',
        submittedAt: '2025-03-24 14:15',
        fileUrl: '/uploads/david_math_hw.pdf',
        grade: 19,
        feedback: 'Excellent graph precision and clear axis labeling!',
        status: 'graded',
      },
      {
        studentId: 'jes-std-002',
        studentName: 'Amina Bello',
        submittedAt: '2025-03-25 10:30',
        fileUrl: '/uploads/amina_math_hw.pdf',
        status: 'submitted',
      },
      {
        studentId: 'jes-std-003',
        studentName: 'Emeka Nwosu',
        submittedAt: '2025-03-26 09:00',
        content: 'Completed online quiz module #3.',
        status: 'submitted',
      },
    ],
  },
];

export const mockStaffExams: StaffExam[] = [
  {
    id: 'exam-401',
    title: 'Mid-Term CBT Examination in Mathematics',
    subject: 'Mathematics',
    classId: 'ss1-blue',
    className: 'SS 1 Blue',
    date: '2025-04-10',
    durationMinutes: 45,
    totalMarks: 60,
    questionIds: ['q-101', 'q-102', 'q-104', 'q-105', 'q-106'],
    publishedStatus: 'scheduled',
  },
];

export const mockDraftResults: DraftResult[] = [
  { studentId: 'jes-std-001', studentName: 'David Okafor', classId: 'ss1-blue', subject: 'Mathematics', ca1: 18, ca2: 19, exam: 58, teacherRemark: 'Outstanding grasp of advanced concepts.', status: 'draft' },
  { studentId: 'jes-std-002', studentName: 'Amina Bello', classId: 'ss1-blue', subject: 'Mathematics', ca1: 19, ca2: 20, exam: 57, teacherRemark: 'Top performer with exceptional accuracy.', status: 'draft' },
  { studentId: 'jes-std-003', studentName: 'Emeka Nwosu', classId: 'ss1-blue', subject: 'Mathematics', ca1: 14, ca2: 15, exam: 42, teacherRemark: 'Fair effort; needs steady revision.', status: 'draft' },
];

export const mockStaffMaterials: StaffLessonMaterial[] = [
  { id: 'mat-1', title: 'Calculus Introduction Slide Deck', subject: 'Further Mathematics', classId: 'ss1-blue', className: 'SS 1 Blue', topic: 'Limits & Derivatives', type: 'pdf', fileUrl: '/files/calculus_intro.pdf', uploadedAt: '2025-03-10' },
  { id: 'mat-2', title: 'Video Tutorial: Completing the Square', subject: 'Mathematics', classId: 'ss1-blue', className: 'SS 1 Blue', topic: 'Algebra', type: 'video', fileUrl: 'https://youtube.com/watch?v=mock', uploadedAt: '2025-03-12' },
];
