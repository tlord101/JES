export type QuestionType =
  | 'mcq'
  | 'multi_select'
  | 'true_false'
  | 'short_answer'
  | 'fill_in_blank'
  | 'image'
  | 'math';

export interface CBTQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  marks: number;
  subject: string;
  classId: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl?: string;
  mathFormula?: string;
}

export interface CBTExam {
  id: string;
  title: string;
  subject: string;
  classId: string;
  className: string;
  description: string;
  instructions: string;
  durationMinutes: number;
  startDate: string;
  endDate: string;
  totalQuestions: number;
  passMark: number; // e.g. 50%
  attemptsAllowed: number;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  resultVisibility: 'immediate' | 'after_deadline' | 'manual';
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  questionIds: string[];
}

export interface CBTAttempt {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt?: string;
  expiresAt: string;
  score?: number;
  percentage?: number;
  passed?: boolean;
  answers: Record<string, string | string[]>;
  markedForReview: string[];
  status: 'in_progress' | 'submitted' | 'expired';
  tabSwitchCount: number;
}

export const cbtQuestionsPool: CBTQuestion[] = [
  {
    id: 'cbt-q-101',
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
    id: 'cbt-q-102',
    type: 'multi_select',
    question: 'Which of the following are prime numbers?',
    options: ['2', '9', '17', '21', '31'],
    correctAnswer: ['2', '17', '31'],
    explanation: '2, 17, and 31 have only 2 distinct positive factors.',
    marks: 3,
    subject: 'Mathematics',
    classId: 'ss1-blue',
    topic: 'Number Theory',
    difficulty: 'Easy',
  },
  {
    id: 'cbt-q-103',
    type: 'true_false',
    question: 'The derivative of sin(x) with respect to x is cos(x).',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'd/dx[sin(x)] = cos(x).',
    marks: 1,
    subject: 'Further Mathematics',
    classId: 'ss1-blue',
    topic: 'Calculus',
    difficulty: 'Easy',
  },
  {
    id: 'cbt-q-104',
    type: 'short_answer',
    question: 'What is the sum of interior angles of a hexagon (in degrees)?',
    correctAnswer: '720',
    explanation: '(6 - 2) * 180 = 720.',
    marks: 2,
    subject: 'Mathematics',
    classId: 'ss1-blue',
    topic: 'Polygons',
    difficulty: 'Medium',
  },
  {
    id: 'cbt-q-105',
    type: 'fill_in_blank',
    question: 'The Pythagorean theorem states that in a right-angled triangle, a² + b² = ______.',
    correctAnswer: 'c²',
    explanation: 'c is the hypotenuse.',
    marks: 2,
    subject: 'Mathematics',
    classId: 'ss1-blue',
    topic: 'Geometry',
    difficulty: 'Easy',
  },
  {
    id: 'cbt-q-106',
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
    id: 'cbt-q-107',
    type: 'math',
    question: 'Evaluate the definite integral ∫ from 0 to 2 of 3x² dx',
    correctAnswer: '8',
    explanation: '[x³] from 0 to 2 = 8.',
    marks: 4,
    subject: 'Further Mathematics',
    classId: 'ss1-blue',
    topic: 'Integration',
    difficulty: 'Hard',
    mathFormula: '\\int_{0}^{2} 3x^2 dx',
  },
];

export const cbtExamsStore: CBTExam[] = [
  {
    id: 'cbt-exam-1',
    title: 'SS1 Mathematics Termly Computer-Based Test',
    subject: 'Mathematics',
    classId: 'ss1-blue',
    className: 'SS 1 Blue',
    description: 'Comprehensive mid-term CBT covering quadratic equations, number theory, geometry, and calculus.',
    instructions: 'Answer all questions carefully. You have 45 minutes. Do not leave the exam screen or switch tabs as activity is logged.',
    durationMinutes: 45,
    startDate: '2025-03-01T00:00:00Z',
    endDate: '2030-12-31T23:59:59Z',
    totalQuestions: 7,
    passMark: 50,
    attemptsAllowed: 1,
    randomizeQuestions: true,
    randomizeOptions: true,
    resultVisibility: 'immediate',
    status: 'active',
    questionIds: ['cbt-q-101', 'cbt-q-102', 'cbt-q-103', 'cbt-q-104', 'cbt-q-105', 'cbt-q-106', 'cbt-q-107'],
  },
];

export const cbtAttemptsStore: CBTAttempt[] = [];
