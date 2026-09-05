export type FeeCategory =
  | 'Tuition'
  | 'Books'
  | 'Uniform'
  | 'Transportation'
  | 'Examination'
  | 'Activities'
  | 'Other';

export interface FeeStructureItem {
  category: FeeCategory;
  name: string;
  amount: number;
}

export interface FeeStructure {
  id: string;
  title: string;
  session: string;
  term: string;
  classId: string; // e.g., 'ss1-blue' or 'all'
  className: string;
  studentId?: string; // specific student if applicable
  studentName?: string;
  items: FeeStructureItem[];
  totalAmount: number;
  dueDate: string;
  createdAt: string;
}

export type InvoiceStatus = 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue';

export interface StudentInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  feeStructureId: string;
  title: string;
  session: string;
  term: string;
  items: FeeStructureItem[];
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  dueDate: string;
  status: InvoiceStatus;
  createdAt: string;
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  schoolName: string;
  studentName: string;
  admissionNo: string;
  parentName: string;
  amountPaid: number;
  paymentMethod: 'Paystack' | 'Flutterwave' | 'Bank Transfer' | 'Cash';
  transactionReference: string;
  date: string;
  status: 'Successful' | 'Verified' | 'Pending';
  description: string;
}

export const feeStructuresStore: FeeStructure[] = [
  {
    id: 'fee-struct-1',
    title: 'SS1 First Term Standard Academic Fee Package',
    session: '2024/2025',
    term: 'First Term',
    classId: 'ss1-blue',
    className: 'SS 1 Blue',
    items: [
      { category: 'Tuition', name: 'Academic Tuition Fee', amount: 150000 },
      { category: 'Books', name: 'Textbooks & Course Workbooks', amount: 35000 },
      { category: 'Uniform', name: 'School & Sports Uniform Kit', amount: 25000 },
      { category: 'Examination', name: 'Terminal & CBT Examination Fee', amount: 15000 },
      { category: 'Activities', name: 'Clubs & Sports Development', amount: 10000 },
      { category: 'Other', name: 'ICT & Science Lab Consumables', amount: 15000 },
    ],
    totalAmount: 250000,
    dueDate: '2025-01-15',
    createdAt: '2024-12-01',
  },
];

export const studentInvoicesStore: StudentInvoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2025-001',
    studentId: 'std-101',
    studentName: 'David Okafor',
    admissionNo: 'JES/2023/042',
    classId: 'ss1-blue',
    className: 'SS 1 Blue',
    parentId: 'par-201',
    parentName: 'Chief Emeka Okafor',
    parentEmail: 'parent@jasmine.edu.ng',
    feeStructureId: 'fee-struct-1',
    title: '2024/2025 First Term School Fees',
    session: '2024/2025',
    term: 'First Term',
    items: [
      { category: 'Tuition', name: 'Academic Tuition Fee', amount: 150000 },
      { category: 'Books', name: 'Textbooks & Course Workbooks', amount: 35000 },
      { category: 'Uniform', name: 'School & Sports Uniform Kit', amount: 25000 },
      { category: 'Examination', name: 'Terminal & CBT Examination Fee', amount: 15000 },
      { category: 'Activities', name: 'Clubs & Sports Development', amount: 10000 },
      { category: 'Other', name: 'ICT & Science Lab Consumables', amount: 15000 },
    ],
    totalAmount: 250000,
    amountPaid: 150000,
    balanceDue: 100000,
    dueDate: '2025-01-15',
    status: 'Partially Paid',
    createdAt: '2024-12-05',
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2025-002',
    studentId: 'std-102',
    studentName: 'Chiamaka Okafor',
    admissionNo: 'JES/2024/089',
    classId: 'jss2-gold',
    className: 'JSS 2 Gold',
    parentId: 'par-201',
    parentName: 'Chief Emeka Okafor',
    parentEmail: 'parent@jasmine.edu.ng',
    feeStructureId: 'fee-struct-1',
    title: '2024/2025 First Term School Fees',
    session: '2024/2025',
    term: 'First Term',
    items: [
      { category: 'Tuition', name: 'Academic Tuition Fee', amount: 130000 },
      { category: 'Books', name: 'Textbooks & Workbooks', amount: 30000 },
      { category: 'Activities', name: 'Co-Curricular Activities', amount: 10000 },
    ],
    totalAmount: 170000,
    amountPaid: 170000,
    balanceDue: 0,
    dueDate: '2025-01-15',
    status: 'Paid',
    createdAt: '2024-12-05',
  },
];

export const paymentReceiptsStore: PaymentReceipt[] = [
  {
    id: 'rec-501',
    receiptNumber: 'RCP-2025-0891',
    invoiceId: 'inv-101',
    invoiceNumber: 'INV-2025-001',
    schoolName: 'Jasmine Exclusive School, Benin City',
    studentName: 'David Okafor',
    admissionNo: 'JES/2023/042',
    parentName: 'Chief Emeka Okafor',
    amountPaid: 150000,
    paymentMethod: 'Paystack',
    transactionReference: 'PST_REF_9812401824',
    date: '2025-01-10 14:32:05',
    status: 'Verified',
    description: 'Part Payment for 2024/2025 First Term Tuition',
  },
  {
    id: 'rec-502',
    receiptNumber: 'RCP-2025-0892',
    invoiceId: 'inv-102',
    invoiceNumber: 'INV-2025-002',
    schoolName: 'Jasmine Exclusive School, Benin City',
    studentName: 'Chiamaka Okafor',
    admissionNo: 'JES/2024/089',
    parentName: 'Chief Emeka Okafor',
    amountPaid: 170000,
    paymentMethod: 'Flutterwave',
    transactionReference: 'FLW_REF_7721094812',
    date: '2025-01-12 09:15:22',
    status: 'Verified',
    description: 'Full Payment for 2024/2025 First Term Fees',
  },
];
