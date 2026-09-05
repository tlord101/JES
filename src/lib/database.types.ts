// Supabase Database Type Definitions
export type UserRole =
  | 'super_admin'
  | 'principal'
  | 'vice_principal'
  | 'bursar'
  | 'accountant'
  | 'teacher'
  | 'form_teacher'
  | 'student'
  | 'parent'
  | 'guest';

export interface Profile {
  id: string;
  user_id?: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicSession {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
}

export interface AcademicTerm {
  id: string;
  session_id: string;
  name: 'first' | 'second' | 'third';
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
}

export interface SchoolClass {
  id: string;
  code: string;
  name: string;
  department_id?: string;
  level_order: number;
  created_at: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department_id?: string;
  description?: string;
  created_at: string;
}

export interface TermResult {
  id: string;
  student_id: string;
  subject_id: string;
  session_id: string;
  term_id: string;
  ca1_score: number;
  ca2_score: number;
  exam_score: number;
  total_score: number;
  grade?: string;
  teacher_remark?: string;
  is_published: boolean;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  student_id: string;
  fee_structure_id?: string;
  total_amount: number;
  paid_amount: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue' | 'pending_verification';
  due_date: string;
  created_at: string;
}

export interface Payment {
  id: string;
  receipt_number: string;
  invoice_id: string;
  student_id: string;
  amount: number;
  payment_method: 'card' | 'bank_transfer' | 'cash' | 'cheque';
  reference_number?: string;
  verified_by?: string;
  payment_date: string;
  created_at: string;
}
