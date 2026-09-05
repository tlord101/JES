export interface WardChild {
  id: string;
  name: string;
  admissionNo: string;
  class: string;
  gender: string;
  dob: string;
  avatarUrl: string;
  termAverage: number;
  classRank: string;
  attendancePercentage: number;
  feeStatus: 'Paid' | 'Partial' | 'Unpaid';
  totalFees: number;
  amountPaid: number;
  outstandingBalance: number;
}

export interface ParentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  employer: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  relationship: string;
  wards: WardChild[];
}

export interface ParentFeeItem {
  id: string;
  wardId: string;
  wardName: string;
  title: string;
  category: string;
  amount: number;
  dueDate: string;
}

export interface ParentPaymentTx {
  id: string;
  wardId: string;
  wardName: string;
  receiptNo: string;
  date: string;
  amountPaid: number;
  paymentMethod: string;
  status: 'Completed' | 'Pending' | 'Verified';
  description: string;
  session: string;
  term: string;
  verifiedServerSide: boolean;
}

export interface ParentChildResult {
  id: string;
  wardId: string;
  wardName: string;
  sessionName: string;
  termName: 'First Term' | 'Second Term' | 'Third Term';
  className: string;
  status: 'Published' | 'Draft' | 'Approved';
  positionInClass: number;
  totalStudents: number;
  averageScore: number;
  subjects: {
    subjectId: string;
    subjectName: string;
    caScore: number;
    examScore: number;
    totalScore: number;
    grade: string;
    remark: string;
  }[];
  teacherRemark: string;
  principalRemark: string;
  nextTermBegins: string;
}

export interface ParentAssignment {
  id: string;
  wardId: string;
  wardName: string;
  subjectName: string;
  title: string;
  dueDate: string;
  totalMarks: number;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Late' | 'Graded';
  grade?: number;
  teacherFeedback?: string;
}

export interface ParentExam {
  id: string;
  wardId: string;
  wardName: string;
  subjectName: string;
  title: string;
  examDate: string;
  status: 'Upcoming' | 'Completed';
  totalMarks: number;
  scoreObtained?: number;
  percentage?: number;
}

export interface ParentAttendance {
  wardId: string;
  wardName: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendancePercentage: number;
  logs: {
    id: string;
    date: string;
    dayOfWeek: string;
    status: 'Present' | 'Absent' | 'Late';
    remarks?: string;
  }[];
}

export interface ParentTimetableSlot {
  id: string;
  wardId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  timeSlot: string;
  subjectName: string;
  teacherName: string;
  room: string;
}

export interface PTAForumTopic {
  id: string;
  title: string;
  author: string;
  date: string;
  repliesCount: number;
  content: string;
  category: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  content: string;
  isImportant: boolean;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  category: 'Academic' | 'Exam' | 'Holiday' | 'Sports' | 'PTA';
  date: string;
  time: string;
  location: string;
  description: string;
}

// Default Parent Wards
export const defaultWards: WardChild[] = [
  {
    id: 'std_01',
    name: 'David Okafor',
    admissionNo: 'JES/2022/084',
    class: 'SS 1 Blue',
    gender: 'Male',
    dob: '2008-05-14',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    termAverage: 88.4,
    classRank: '2nd out of 38',
    attendancePercentage: 96.5,
    feeStatus: 'Paid',
    totalFees: 230000,
    amountPaid: 230000,
    outstandingBalance: 0,
  },
  {
    id: 'std_02',
    name: 'Chinecherem Okafor',
    admissionNo: 'JES/2023/112',
    class: 'JSS 2 Gold',
    gender: 'Female',
    dob: '2010-09-20',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    termAverage: 91.2,
    classRank: '1st out of 35',
    attendancePercentage: 98.0,
    feeStatus: 'Paid',
    totalFees: 210000,
    amountPaid: 210000,
    outstandingBalance: 0,
  },
];

export const defaultParentProfile: ParentProfile = {
  id: 'prt_01',
  name: 'Dr. Emmanuel Okafor',
  email: 'parent@example.com',
  phone: '+234 803 123 4567',
  address: '24 Limit Road, Off Sapele Road, Benin City, Edo State',
  occupation: 'Consultant Surgeon',
  employer: 'University of Benin Teaching Hospital (UBTH)',
  emergencyContactName: 'Mrs. Victoria Okafor',
  emergencyContactPhone: '+234 802 345 6789',
  relationship: 'Father',
  wards: defaultWards,
};

export const defaultParentFeeItems: ParentFeeItem[] = [
  { id: 'pfee_1', wardId: 'std_01', wardName: 'David Okafor', title: 'Tuition Fee (Second Term 2024/2025)', category: 'Tuition', amount: 180000, dueDate: '2025-01-15' },
  { id: 'pfee_2', wardId: 'std_01', wardName: 'David Okafor', title: 'Science Lab & ICT Practical', category: 'Academic', amount: 50000, dueDate: '2025-01-15' },
  { id: 'pfee_3', wardId: 'std_02', wardName: 'Chinecherem Okafor', title: 'Tuition Fee (Second Term 2024/2025)', category: 'Tuition', amount: 170000, dueDate: '2025-01-15' },
  { id: 'pfee_4', wardId: 'std_02', wardName: 'Chinecherem Okafor', title: 'Junior Secondary Materials & Library', category: 'Academic', amount: 40000, dueDate: '2025-01-15' },
];

export const defaultParentPaymentTxs: ParentPaymentTx[] = [
  {
    id: 'ptx_01',
    wardId: 'std_01',
    wardName: 'David Okafor',
    receiptNo: 'JES-RCP-2025-0841',
    date: '2025-01-10',
    amountPaid: 230000,
    paymentMethod: 'Online Card / Bank Transfer',
    status: 'Verified',
    description: 'Full Payment for Second Term 2024/2025 Tuition & Labs',
    session: '2024/2025',
    term: 'Second Term',
    verifiedServerSide: true,
  },
  {
    id: 'ptx_02',
    wardId: 'std_02',
    wardName: 'Chinecherem Okafor',
    receiptNo: 'JES-RCP-2025-1122',
    date: '2025-01-11',
    amountPaid: 210000,
    paymentMethod: 'Online Card / Bank Transfer',
    status: 'Verified',
    description: 'Full Payment for Second Term 2024/2025 Tuition & Materials',
    session: '2024/2025',
    term: 'Second Term',
    verifiedServerSide: true,
  },
];

export const defaultParentChildResults: ParentChildResult[] = [
  {
    id: 'res_david_t1',
    wardId: 'std_01',
    wardName: 'David Okafor',
    sessionName: '2024/2025',
    termName: 'First Term',
    className: 'SS 1 Blue',
    status: 'Published',
    positionInClass: 2,
    totalStudents: 38,
    averageScore: 88.4,
    subjects: [
      { subjectId: 'sub_mth', subjectName: 'Mathematics', caScore: 28, examScore: 60, totalScore: 88, grade: 'A', remark: 'Excellent' },
      { subjectId: 'sub_phy', subjectName: 'Physics', caScore: 29, examScore: 63, totalScore: 92, grade: 'A+', remark: 'Distinction' },
      { subjectId: 'sub_chem', subjectName: 'Chemistry', caScore: 27, examScore: 58, totalScore: 85, grade: 'A', remark: 'Excellent' },
      { subjectId: 'sub_eng', subjectName: 'English Language', caScore: 26, examScore: 57, totalScore: 83, grade: 'A', remark: 'Excellent' },
    ],
    teacherRemark: 'David is extremely attentive, analytical, and diligent in all science subjects.',
    principalRemark: 'An impressive academic result. Keep up the high standard.',
    nextTermBegins: '2025-01-06',
  },
  {
    id: 'res_chin_t1',
    wardId: 'std_02',
    wardName: 'Chinecherem Okafor',
    sessionName: '2024/2025',
    termName: 'First Term',
    className: 'JSS 2 Gold',
    status: 'Published',
    positionInClass: 1,
    totalStudents: 35,
    averageScore: 91.2,
    subjects: [
      { subjectId: 'sub_mth', subjectName: 'Mathematics', caScore: 30, examScore: 62, totalScore: 92, grade: 'A+', remark: 'Distinction' },
      { subjectId: 'sub_eng', subjectName: 'English Language', caScore: 28, examScore: 60, totalScore: 88, grade: 'A', remark: 'Excellent' },
      { subjectId: 'sub_bio', subjectName: 'Basic Science & Biology', caScore: 29, examScore: 64, totalScore: 93, grade: 'A+', remark: 'Distinction' },
    ],
    teacherRemark: 'Chinecherem is an outstanding student who consistently tops the class rank.',
    principalRemark: 'Exemplary academic effort and brilliant leadership conduct.',
    nextTermBegins: '2025-01-06',
  },
];

export const defaultParentAssignments: ParentAssignment[] = [
  { id: 'pasg_1', wardId: 'std_01', wardName: 'David Okafor', subjectName: 'Physics', title: 'Vector Motion & Projectile Problems', dueDate: '2025-02-28', totalMarks: 20, status: 'In Progress' },
  { id: 'pasg_2', wardId: 'std_01', wardName: 'David Okafor', subjectName: 'Chemistry', title: 'Organic IUPAC Naming Essay', dueDate: '2025-02-15', totalMarks: 25, status: 'Graded', grade: 23, teacherFeedback: 'Excellent structural diagrams and clear explanation.' },
  { id: 'pasg_3', wardId: 'std_02', wardName: 'Chinecherem Okafor', subjectName: 'Mathematics', title: 'Algebraic Fractions & Quadratic Simplification', dueDate: '2025-03-01', totalMarks: 20, status: 'Submitted' },
];

export const defaultParentExams: ParentExam[] = [
  { id: 'pexm_1', wardId: 'std_01', wardName: 'David Okafor', subjectName: 'Physics', title: 'Second Term Mid-Term CBT Physics Exam', examDate: '2025-02-25', status: 'Upcoming', totalMarks: 50 },
  { id: 'pexm_2', wardId: 'std_01', wardName: 'David Okafor', subjectName: 'Chemistry', title: 'CBT Test 1: Hydrocarbons & Kinetics', examDate: '2025-01-28', status: 'Completed', totalMarks: 50, scoreObtained: 46, percentage: 92 },
  { id: 'pexm_3', wardId: 'std_02', wardName: 'Chinecherem Okafor', subjectName: 'Mathematics', title: 'JSS2 Algebra CBT Assessment', examDate: '2025-02-20', status: 'Completed', totalMarks: 40, scoreObtained: 38, percentage: 95 },
];

export const defaultParentAttendances: ParentAttendance[] = [
  {
    wardId: 'std_01',
    wardName: 'David Okafor',
    totalDays: 45,
    presentDays: 43,
    absentDays: 1,
    lateDays: 1,
    attendancePercentage: 95.6,
    logs: [
      { id: 'patt_1', date: '2025-02-14', dayOfWeek: 'Friday', status: 'Present', remarks: 'On time' },
      { id: 'patt_2', date: '2025-02-13', dayOfWeek: 'Thursday', status: 'Present', remarks: 'On time' },
      { id: 'patt_3', date: '2025-02-12', dayOfWeek: 'Wednesday', status: 'Late', remarks: 'Arrived at 08:15 AM' },
    ],
  },
  {
    wardId: 'std_02',
    wardName: 'Chinecherem Okafor',
    totalDays: 45,
    presentDays: 44,
    absentDays: 0,
    lateDays: 1,
    attendancePercentage: 98.0,
    logs: [
      { id: 'patt_4', date: '2025-02-14', dayOfWeek: 'Friday', status: 'Present', remarks: 'On time' },
      { id: 'patt_5', date: '2025-02-13', dayOfWeek: 'Thursday', status: 'Present', remarks: 'On time' },
    ],
  },
];

export const defaultParentTimetableSlots: ParentTimetableSlot[] = [
  { id: 'ptt_1', wardId: 'std_01', day: 'Monday', timeSlot: '08:30 AM - 09:45 AM', subjectName: 'Physics (Lab)', teacherName: 'Engr. K. Igbinovia', room: 'Science Lab 1' },
  { id: 'ptt_2', wardId: 'std_01', day: 'Monday', timeSlot: '10:15 AM - 11:30 AM', subjectName: 'Further Mathematics', teacherName: 'Mr. Osagie Aghedo', room: 'SS1 Blue' },
  { id: 'ptt_3', wardId: 'std_02', day: 'Monday', timeSlot: '08:30 AM - 09:45 AM', subjectName: 'Mathematics', teacherName: 'Mrs. C. Nwachukwu', room: 'JSS2 Gold' },
];

export const defaultPTATopics: PTAForumTopic[] = [
  {
    id: 'pta_1',
    title: 'PTA Second Term General Meeting & Infrastructure Project Report',
    author: 'PTA Executive Chairman (Chief A. Igbedion)',
    date: '2025-02-10',
    repliesCount: 14,
    category: 'General Assembly',
    content: 'Dear Parents, the termly general meeting will hold on Saturday Feb 22, 2025. Key topics include solar library expansion and security upgrade.',
  },
  {
    id: 'pta_2',
    title: 'Inter-House Sports Festival Parent Sponsorship & Support',
    author: 'Sports Committee Chair',
    date: '2025-02-01',
    repliesCount: 8,
    category: 'Sports',
    content: 'Parents interested in sponsoring house refreshments and sports trophies for the Feb 14 festival are invited to register.',
  },
];

export const defaultAnnouncements: AnnouncementItem[] = [
  {
    id: 'anc_p1',
    title: 'PTA General Assembly & Academic Consultation Day',
    category: 'PTA Event',
    date: '2025-02-15',
    author: 'School Management',
    content: 'All parents are invited to attend the termly general meeting on Saturday Feb 22. Academic broadsheets will be reviewed.',
    isImportant: true,
  },
  {
    id: 'anc_p2',
    title: 'Second Term Fee Payment Settlement Notice',
    category: 'Finance',
    date: '2025-01-20',
    author: 'Bursary Department',
    content: 'Parents with outstanding term fee balances are requested to complete settlement prior to the mid-term break.',
    isImportant: true,
  },
];

export const defaultCalendarEvents: CalendarEventItem[] = [
  { id: 'pcal_1', title: 'PTA General Assembly Meeting', category: 'PTA', date: '2025-02-22', time: '10:00 AM - 01:00 PM', location: 'Main Auditorium', description: 'General consultative meeting.' },
  { id: 'pcal_2', title: 'Mid-Term Break', category: 'Holiday', date: '2025-02-27', time: 'All Day', location: 'Campus Wide', description: 'School closed.' },
];
