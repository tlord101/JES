-- ============================================================================
-- Jasmine Exclusive School - Supabase Database Migration
-- Step 03: Assignments, Learning, CBT, Results, Finance, CMS & Audit Logs
-- ============================================================================

-- 1. Courses & E-Learning Modules
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  video_url TEXT,
  document_url TEXT,
  order_index INT NOT NULL DEFAULT 0,
  duration_minutes INT DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Assignments
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ NOT NULL,
  total_marks INT NOT NULL DEFAULT 100,
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Assignment Submissions
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  submission_text TEXT,
  attachment_url TEXT,
  status assignment_status NOT NULL DEFAULT 'submitted',
  grade_score NUMERIC(5,2),
  teacher_feedback TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  graded_at TIMESTAMPTZ,
  UNIQUE (assignment_id, student_id)
);

-- 5. CBT Exams
CREATE TABLE IF NOT EXISTS public.cbt_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  duration_minutes INT NOT NULL DEFAULT 60,
  total_questions INT NOT NULL DEFAULT 20,
  total_marks INT NOT NULL DEFAULT 100,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  shuffle_questions BOOLEAN NOT NULL DEFAULT true,
  allow_backtrack BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CBT Questions
CREATE TABLE IF NOT EXISTS public.cbt_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.cbt_exams(id) ON DELETE CASCADE,
  question_type question_type NOT NULL DEFAULT 'mcq',
  prompt TEXT NOT NULL,
  image_url TEXT,
  options JSONB, -- Array of options: [{id: 'a', text: 'Option A'}, ...]
  correct_answer JSONB NOT NULL, -- Correct option ID, string array, or text value
  marks INT NOT NULL DEFAULT 5,
  explanation TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CBT Submissions & Session Logs
CREATE TABLE IF NOT EXISTS public.cbt_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.cbt_exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  tab_switch_count INT NOT NULL DEFAULT 0,
  score NUMERIC(5,2),
  percentage NUMERIC(5,2),
  status VARCHAR(20) NOT NULL DEFAULT 'completed',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (exam_id, student_id)
);

-- 8. Term Academic Results
CREATE TABLE IF NOT EXISTS public.term_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES public.terms(id) ON DELETE CASCADE,
  ca1_score NUMERIC(5,2) DEFAULT 0,
  ca2_score NUMERIC(5,2) DEFAULT 0,
  exam_score NUMERIC(5,2) DEFAULT 0,
  total_score NUMERIC(5,2) GENERATED ALWAYS AS (COALESCE(ca1_score,0) + COALESCE(ca2_score,0) + COALESCE(exam_score,0)) STORED,
  grade VARCHAR(5),
  teacher_remark TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, subject_id, session_id, term_id)
);

-- 9. Attendance Logs
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  arm_id UUID REFERENCES public.arms(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status attendance_status NOT NULL DEFAULT 'present',
  remark TEXT,
  recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, date)
);

-- 10. Fee Structures
CREATE TABLE IF NOT EXISTS public.fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES public.terms(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  due_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Student Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  fee_structure_id UUID REFERENCES public.fee_structures(id) ON DELETE SET NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  balance NUMERIC(12,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  status payment_status NOT NULL DEFAULT 'unpaid',
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Payment Transactions & Receipts
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number VARCHAR(50) NOT NULL UNIQUE,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  payment_method payment_method NOT NULL DEFAULT 'bank_transfer',
  reference_number VARCHAR(100),
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Admissions Applications
CREATE TABLE IF NOT EXISTS public.admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number VARCHAR(50) NOT NULL UNIQUE,
  applicant_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  target_class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  status admission_status NOT NULL DEFAULT 'submitted',
  application_fee_paid BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Announcements & Messaging
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  target_audience VARCHAR(50) NOT NULL DEFAULT 'all', -- 'all', 'students', 'parents', 'teachers'
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_important BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. CMS Pages, News, Events & Gallery
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.news_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'news', -- 'news' or 'event'
  content TEXT NOT NULL,
  event_date DATE,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'General',
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Audit Log (Immutable security trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  user_role VARCHAR(50),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
