-- ============================================================================
-- Jasmine Exclusive School - Initial Database Seed Data
-- ============================================================================

-- 1. Insert Academic Sessions & Terms
INSERT INTO public.sessions (id, name, start_date, end_date, is_current)
VALUES
  ('a1000000-0000-0000-0000-000000000001', '2024/2025', '2024-09-09', '2025-07-25', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.terms (id, session_id, name, start_date, end_date, is_current)
VALUES
  ('t1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'first', '2024-09-09', '2024-12-18', true),
  ('t1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'second', '2025-01-06', '2025-04-11', false),
  ('t1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'third', '2025-04-28', '2025-07-25', false)
ON CONFLICT DO NOTHING;

-- 2. Insert Departments
INSERT INTO public.departments (id, code, name, description)
VALUES
  ('d1000000-0000-0000-0000-000000000001', 'SCI', 'Sciences Department', 'Physics, Chemistry, Biology, Mathematics'),
  ('d1000000-0000-0000-0000-000000000002', 'ART', 'Arts & Humanities', 'English, Literature, History, Fine Arts'),
  ('d1000000-0000-0000-0000-000000000003', 'COM', 'Commercial Department', 'Accounting, Economics, Commerce')
ON CONFLICT (code) DO NOTHING;

-- 3. Insert Classes & Arms
INSERT INTO public.classes (id, code, name, level_order)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'JSS1', 'Junior Secondary School 1', 1),
  ('c1000000-0000-0000-0000-000000000002', 'JSS2', 'Junior Secondary School 2', 2),
  ('c1000000-0000-0000-0000-000000000003', 'SSS1', 'Senior Secondary School 1', 4)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.arms (id, class_id, name)
VALUES
  ('arm00000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Gold'),
  ('arm00000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Diamond')
ON CONFLICT DO NOTHING;

-- 4. Insert Subjects
INSERT INTO public.subjects (id, code, name, description)
VALUES
  ('s1000000-0000-0000-0000-000000000001', 'MTH101', 'Mathematics', 'General Mathematics and Problem Solving'),
  ('s1000000-0000-0000-0000-000000000002', 'ENG101', 'English Language', 'Grammar, Comprehension and Essay Writing'),
  ('s1000000-0000-0000-0000-000000000003', 'PHY201', 'Physics', 'Mechanics, Heat, Light and Electricity')
ON CONFLICT (code) DO NOTHING;

-- 5. Insert Core Demo Profiles
INSERT INTO public.profiles (id, email, full_name, role, phone, address, gender)
VALUES
  ('p1000000-0000-0000-0000-000000000001', 'admin@jes.edu.ng', 'Dr. Benedict O. Igbinosa', 'super_admin', '+234 806 078 2404', 'Benin City, Edo State', 'male'),
  ('p1000000-0000-0000-0000-000000000002', 'teacher@jes.edu.ng', 'Mr. David Okon', 'teacher', '+234 802 123 4567', 'Benin City, Edo State', 'male'),
  ('p1000000-0000-0000-0000-000000000003', 'student@jes.edu.ng', 'Amina Yusuf', 'student', '+234 803 987 6543', 'Benin City, Edo State', 'female'),
  ('p1000000-0000-0000-0000-000000000004', 'parent@jes.edu.ng', 'Alhaji Ibrahim Yusuf', 'parent', '+234 805 111 2233', 'Benin City, Edo State', 'male')
ON CONFLICT (email) DO NOTHING;

-- 6. Insert Student Profile
INSERT INTO public.student_profiles (id, profile_id, admission_number, current_class_id, current_arm_id)
VALUES
  ('sp000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000003', 'JES/2024/001', 'c1000000-0000-0000-0000-000000000001', 'arm00000-0000-0000-0000-000000000001')
ON CONFLICT (admission_number) DO NOTHING;

-- 7. Insert Fee Structure & Invoice
INSERT INTO public.fee_structures (id, session_id, term_id, class_id, title, amount, due_date, description)
VALUES
  ('fs000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 't1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', '1st Term Tuition & Portal Access', 85000.00, '2024-10-15', 'Covers tuition, e-learning access, and CBT software fees.')
ON CONFLICT DO NOTHING;

INSERT INTO public.invoices (id, invoice_number, student_id, fee_structure_id, total_amount, paid_amount, status, due_date)
VALUES
  ('inv00000-0000-0000-0000-000000000001', 'INV-2024-001', 'sp000000-0000-0000-0000-000000000001', 'fs000000-0000-0000-0000-000000000001', 85000.00, 85000.00, 'paid', '2024-10-15')
ON CONFLICT (invoice_number) DO NOTHING;
