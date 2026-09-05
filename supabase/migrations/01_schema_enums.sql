-- ============================================================================
-- Jasmine Exclusive School - Supabase Database Migration
-- Step 01: Core Extensions and Custom Enum Types
-- ============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Role Enum (matches src/lib/rbac.ts definitions)
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'principal',
  'vice_principal',
  'bursar',
  'accountant',
  'teacher',
  'form_teacher',
  'student',
  'parent',
  'guest'
);

-- Gender Enum
CREATE TYPE gender_type AS ENUM (
  'male',
  'female',
  'other'
);

-- Academic Term Enum
CREATE TYPE term_type AS ENUM (
  'first',
  'second',
  'third'
);

-- Exam Type Enum
CREATE TYPE exam_type AS ENUM (
  'ca1',
  'ca2',
  'midterm',
  'final',
  'mock'
);

-- CBT Question Type Enum
CREATE TYPE question_type AS ENUM (
  'mcq',
  'multi_select',
  'true_false',
  'short_answer',
  'fill_blank',
  'image_based',
  'math_formula'
);

-- Assignment Status Enum
CREATE TYPE assignment_status AS ENUM (
  'not_started',
  'in_progress',
  'submitted',
  'late',
  'graded'
);

-- Attendance Status Enum
CREATE TYPE attendance_status AS ENUM (
  'present',
  'absent',
  'late',
  'excused'
);

-- Payment Status Enum
CREATE TYPE payment_status AS ENUM (
  'paid',
  'partial',
  'unpaid',
  'overdue',
  'pending_verification'
);

-- Payment Method Enum
CREATE TYPE payment_method AS ENUM (
  'card',
  'bank_transfer',
  'cash',
  'cheque'
);

-- Admission Application Status Enum
CREATE TYPE admission_status AS ENUM (
  'submitted',
  'under_review',
  'exam_scheduled',
  'interview_scheduled',
  'accepted',
  'rejected',
  'enrolled'
);
