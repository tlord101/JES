-- ============================================================================
-- Jasmine Exclusive School - Supabase Database Migration
-- Step 04: RLS Policies, Database Functions & Storage Setup
-- ============================================================================

-- Enable Row Level Security (RLS) on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.term_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbt_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Term Results Policies
CREATE POLICY "Super admins and academic staff can view all results"
  ON public.term_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'principal', 'vice_principal', 'teacher', 'form_teacher', 'bursar')
    )
  );

CREATE POLICY "Students can view their own published results"
  ON public.term_results FOR SELECT
  TO authenticated
  USING (
    is_published = true AND EXISTS (
      SELECT 1 FROM public.student_profiles
      WHERE student_profiles.id = term_results.student_id
      AND student_profiles.profile_id IN (
        SELECT id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

-- 3. Payments Policies (Students & Parents can view, Bursar/Admins manage)
CREATE POLICY "Users can view relevant payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'principal', 'bursar', 'accountant')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.student_profiles sp
      JOIN public.profiles p ON p.id = sp.profile_id
      WHERE sp.id = payments.student_id AND p.user_id = auth.uid()
    )
  );

-- 4. Messages Policies
CREATE POLICY "Users can read sent or received messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR
    recipient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Helper Function: Calculate Student GPA / Cumulative Average
CREATE OR REPLACE FUNCTION public.calculate_student_term_average(
  p_student_id UUID,
  p_session_id UUID,
  p_term_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
  v_avg NUMERIC(5,2);
BEGIN
  SELECT AVG(total_score)::NUMERIC(5,2)
  INTO v_avg
  FROM public.term_results
  WHERE student_id = p_student_id
    AND session_id = p_session_id
    AND term_id = p_term_id;

  RETURN COALESCE(v_avg, 0.00);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage Buckets Configuration SQL
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('assignments', 'assignments', true),
  ('cbt-assets', 'cbt-assets', true),
  ('receipts', 'receipts', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
