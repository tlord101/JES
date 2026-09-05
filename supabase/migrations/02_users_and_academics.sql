-- ============================================================================
-- Jasmine Exclusive School - Supabase Database Migration
-- Step 02: Profiles, User Roles, and Academic Structures
-- ============================================================================

-- 1. Profiles Table (Extends Supabase auth.users or standalone profile table)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE, -- References auth.users(id) ON DELETE CASCADE
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'guest',
  phone VARCHAR(50),
  address TEXT,
  gender gender_type,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Academic Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- e.g., '2024/2025'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Academic Terms Table
CREATE TABLE IF NOT EXISTS public.terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  name term_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, name)
);

-- 4. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  head_of_department_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Classes Table (e.g., JSS 1, SSS 2)
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  level_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Class Arms Table (e.g., JSS 1 Alpha, JSS 1 Gold)
CREATE TABLE IF NOT EXISTS public.arms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  form_teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (class_id, name)
);

-- 7. Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Staff Profiles Table
CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  staff_id VARCHAR(50) NOT NULL UNIQUE,
  designation VARCHAR(100) NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  qualification TEXT,
  date_joined DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Parent Profiles Table
CREATE TABLE IF NOT EXISTS public.parent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  occupation VARCHAR(100),
  relationship VARCHAR(50) DEFAULT 'Parent',
  emergency_contact VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Student Profiles Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  admission_number VARCHAR(50) NOT NULL UNIQUE,
  current_class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  current_arm_id UUID REFERENCES public.arms(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.parent_profiles(id) ON DELETE SET NULL,
  date_of_birth DATE,
  blood_group VARCHAR(10),
  genotype VARCHAR(10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Class Enrollments Table
CREATE TABLE IF NOT EXISTS public.class_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  arm_id UUID REFERENCES public.arms(id) ON DELETE SET NULL,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  term_id UUID REFERENCES public.terms(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, session_id, term_id)
);

-- 12. Teacher Subject Class Allocations
CREATE TABLE IF NOT EXISTS public.teacher_subject_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.staff_profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  arm_id UUID REFERENCES public.arms(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (teacher_id, subject_id, class_id, arm_id, session_id)
);
