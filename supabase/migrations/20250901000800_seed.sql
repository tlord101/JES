-- ============================================================================
-- Jasmine Exclusive School (JES) - Essential structure seed
-- Migration 08
-- Contains ONLY school facts, the academic calendar, the subject/class
-- structure and the school's own published website copy.
-- No students, no staff records, no news articles, no demo accounts.
-- The first administrator is created by scripts/seed-admin.mjs.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Site settings (admin editable from the dashboard)
-- ---------------------------------------------------------------------------
insert into public.site_settings (key, value, label, group_name) values
  ('school_name', to_jsonb('Jasmine Exclusive School'::text), 'School name', 'identity'),
  ('short_name', to_jsonb('JES'::text), 'Short name / initials', 'identity'),
  ('motto', to_jsonb('Diligence for Excellence'::text), 'Motto', 'identity'),
  ('tagline', to_jsonb('Nurturing intellect. Building character.'::text), 'Tagline', 'identity'),
  ('description', to_jsonb('Nurturing intellectually excellent, morally sound and socially responsible children prepared to become agents of positive change in society.'::text), 'Short description', 'identity'),
  ('address_campus_1', to_jsonb('12 Aitamegbe Street, Off Narrow Way Street, Off Reliance, Aduwawa, Benin City, Edo State.'::text), 'Campus 1 address', 'contact'),
  ('address_campus_2', to_jsonb('7 Asemota Street, Off College Road, Aduwawa, Benin City, Edo State.'::text), 'Campus 2 address', 'contact'),
  ('city', to_jsonb('Benin City'::text), 'City', 'contact'),
  ('state', to_jsonb('Edo State'::text), 'State', 'contact'),
  ('country', to_jsonb('Nigeria'::text), 'Country', 'contact'),
  ('phone_primary', to_jsonb('+234 806 078 2404'::text), 'Primary phone', 'contact'),
  ('email_primary', to_jsonb('jasmineexclusiveschool@gmail.com'::text), 'Primary email', 'contact'),
  ('office_hours', to_jsonb('Monday - Friday, 7:30 AM - 4:00 PM'::text), 'Office hours', 'contact'),
  ('logo_url', to_jsonb(''::text), 'Logo image URL', 'identity'),
  ('principal_name', to_jsonb('Dr. (Mrs.) E. O. Aigbe'::text), 'Principal name', 'leadership'),
  ('principal_title', to_jsonb('Executive Principal'::text), 'Principal title', 'leadership'),
  ('mission', to_jsonb('To diligently nurture children''s intellectual inclination until they become excellent academically and morally sound, using a well-researched robust curriculum to teach social grace and courtesy.'::text), 'Mission statement', 'identity'),
  ('vision', to_jsonb('To raise excellent moral agents of change in our society.'::text), 'Vision statement', 'identity')
on conflict (key) do nothing;-- ---------------------------------------------------------------------------
-- Editable website pages (the school''s own published copy)
-- ---------------------------------------------------------------------------
insert into public.pages (slug, title, section, content)
values
  ('homepage-hero', 'Homepage Hero', 'Homepage',
   'Welcome to Jasmine Exclusive School, Aduwawa, Benin City. We nurture intellectually excellent, morally sound and socially responsible children prepared to become agents of positive change in society.'),
  ('about-overview', 'About Overview', 'About',
   'Jasmine Exclusive School is a co-educational institution located in Aduwawa, Benin City, Edo State, Nigeria. Our mission and vision guide every lesson plan, co-curricular activity, discipline policy and community initiative. We measure success not only by academic grades, but by the integrity, courtesy and civic leadership of our graduates.'),
  ('mission-vision', 'Mission & Vision Statements', 'About',
   'Mission: To diligently nurture intellectual inclination until our children become excellent academically and morally sound, using a well-researched robust curriculum to teach social grace and courtesy.'
   || chr(10) || chr(10) ||
   'Vision: To raise excellent moral agents of change in our society.'),
  ('admissions-overview', 'Admissions Overview', 'Admissions',
   'Prospective parents begin by completing an application form online or at our administrative office. The applicant then sits for a placement diagnostic test, followed by a brief family interaction interview. Applications are received all year round for Nursery, Primary, Junior Secondary and Senior Secondary classes.'),
  ('contact-intro', 'Contact Introduction', 'Contact',
   'Our administrative offices are open Monday to Friday, 7:30 AM to 4:00 PM. You may reach the school by telephone, email, or by visiting either of our campuses in Aduwawa, Benin City.')
on conflict (slug) do nothing;-- ---------------------------------------------------------------------------
-- Frequently asked questions
-- ---------------------------------------------------------------------------
insert into public.faqs (question, answer, category, sort_order)
select * from (values
  ('What is the admission procedure for prospective students?',
   'Prospective parents begin by completing an application form online or at our administrative office. The student then sits for a placement diagnostic test, followed by a brief family interaction interview.',
   'admissions'::public.faq_category, 1),
  ('At what age can a child be admitted into Nursery or Primary?',
   'Children entering Creche must be at least 3 months old; Nursery 1 applicants must be at least 3 years old by September of the admission year.',
   'admissions'::public.faq_category, 2),
  ('What are the school fees structures?',
   'School fees vary by academic arm (Nursery, Primary, Junior Secondary and Senior Secondary). A detailed breakdown is provided upon application or through our Admissions Office.',
   'fees'::public.faq_category, 3),
  ('Are flexible payment plans or installments available?',
   'Yes, parents may opt for termly installment plans approved by the accounts department prior to the resumption of each academic term.',
   'fees'::public.faq_category, 4),
  ('Where can parents purchase the official school uniform?',
   'Official school uniforms, sports wear and cardigan sets are supplied directly through the school bookstore upon payment of the uniform fee.',
   'general'::public.faq_category, 5),
  ('Does Jasmine Exclusive School offer bus transportation?',
   'We operate school bus routes across key neighbourhoods in Benin City, including Aduwawa, Ikpoba Hill and surrounding areas. Contact the school office for current routes and stops.',
   'general'::public.faq_category, 6),
  ('Are boarding facilities available for secondary students?',
   'Boarding facilities are available for secondary students. Please contact the school office for current hostel arrangements, requirements and fees.',
   'general'::public.faq_category, 7),
  ('What curriculum does the school follow?',
   'We follow the Nigerian National Curriculum enriched with character development modules and social grace training.',
   'academics'::public.faq_category, 8),
  ('Which external examinations do students take?',
   'Our secondary students are prepared for BECE (Junior Secondary), WAEC SSCE and NECO SSCE.',
   'academics'::public.faq_category, 9),
  ('What are the daily school hours?',
   'Classes run Monday through Friday from 7:30 AM to 2:30 PM. Extracurricular clubs and sports operate from 2:30 PM to 4:00 PM on designated days.',
   'general'::public.faq_category, 10),
  ('How do parents access student report cards and fee portals?',
   'Parents receive unique login credentials to access the portal, where they can view termly results, attendance records and fee invoices.',
   'general'::public.faq_category, 11)
) as seed(question, answer, category, sort_order)
where not exists (select 1 from public.faqs where public.faqs.question = seed.question);