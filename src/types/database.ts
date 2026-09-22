/**
 * Database types for the Jasmine Exclusive School Supabase project.
 *
 * Shape mirrors `supabase gen types typescript` output so the typed client
 * keeps full IntelliSense. Regenerate with:
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'principal'
  | 'vice_principal'
  | 'hod'
  | 'teacher'
  | 'accountant'
  | 'parent'
  | 'student'
  | 'alumni';

export type Gender = 'male' | 'female';
export type StudentStatus = 'active' | 'graduated' | 'suspended' | 'withdrawn';
export type StaffStatus = 'active' | 'on_leave' | 'resigned';
export type SchoolLevel = 'nursery' | 'primary' | 'junior_secondary' | 'senior_secondary';
export type TermName = 'first_term' | 'second_term' | 'third_term';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type ResultStatus = 'draft' | 'submitted' | 'approved' | 'published';
export type SubmissionStatus = 'pending' | 'submitted' | 'late' | 'graded' | 'returned';
export type InvoiceStatus = 'unpaid' | 'partial' | 'paid' | 'cancelled';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'paystack' | 'cheque' | 'pos';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'reversed';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type AnnouncementAudience = 'everyone' | 'staff' | 'students' | 'parents' | 'class';
export type FaqCategory = 'admissions' | 'academics' | 'fees' | 'general';
export type ApplicationStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'waitlisted'
  | 'withdrawn';
export type DocumentType =
  | 'birth_certificate'
  | 'passport_photo'
  | 'transfer_certificate'
  | 'report_card'
  | 'medical_report'
  | 'other';

/** Generic table definition: `Generated` columns are optional on insert. */
type Tbl<Row, Generated extends keyof Row = never> = {
  Row: Row;
  Insert: Omit<Row, Generated> & Partial<Pick<Row, Generated>>;
  Update: Partial<Row>;
  Relationships: [];
};

type Timestamps = 'created_at' | 'updated_at';// ---------------------------------------------------------------------------
// Row shapes
// ---------------------------------------------------------------------------
export type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  last_login_at: string | null;
  notification_preferences: Json;
  created_at: string;
  updated_at: string;
};

export type AcademicYearRow = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
};

export type TermRow = {
  id: string;
  academic_year_id: string;
  name: TermName;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
};

export type ClassRow = {
  id: string;
  name: string;
  level: SchoolLevel;
  arm: string | null;
  capacity: number;
  class_teacher_id: string | null;
  room: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SubjectRow = {
  id: string;
  code: string;
  name: string;
  department: string | null;
  level: SchoolLevel | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ClassSubjectRow = {
  id: string;
  class_id: string;
  subject_id: string;
  teacher_id: string | null;
  academic_year_id: string | null;
  created_at: string;
};

export type StudentRow = {
  id: string;
  profile_id: string;
  admission_no: string;
  gender: Gender | null;
  date_of_birth: string | null;
  class_id: string | null;
  address: string | null;
  photo_url: string | null;
  blood_group: string | null;
  genotype: string | null;
  medical_notes: string | null;
  admitted_on: string;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
};

export type StaffRow = {
  id: string;
  profile_id: string;
  staff_no: string;
  position: string;
  department: string | null;
  qualification: string | null;
  biography: string | null;
  photo_url: string | null;
  date_hired: string | null;
  is_public: boolean;
  sort_order: number;
  status: StaffStatus;
  created_at: string;
  updated_at: string;
};

export type ParentRow = {
  id: string;
  profile_id: string;
  occupation: string | null;
  employer: string | null;
  address: string | null;
  alt_phone: string | null;
  relationship: string | null;
  created_at: string;
  updated_at: string;
};

export type ParentStudentRow = {
  parent_id: string;
  student_id: string;
  relationship: string;
  is_primary: boolean;
  created_at: string;
};

export type StaffSubjectRow = { staff_id: string; subject_id: string; created_at: string };
export type StaffClassRow = {
  staff_id: string;
  class_id: string;
  duty: string;
  created_at: string;
};

export type AlumniRow = {
  id: string;
  profile_id: string;
  graduation_year: number | null;
  exit_class: string | null;
  occupation: string | null;
  organisation: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type PtaMemberRow = {
  id: string;
  full_name: string;
  position: string;
  email: string | null;
  phone: string | null;
  session_name: string | null;
  is_executive: boolean;
  sort_order: number;
  created_at: string;
};export type AttendanceRow = {
  id: string;
  student_id: string;
  class_id: string;
  subject_id: string | null;
  academic_year_id: string | null;
  term_id: string | null;
  attendance_date: string;
  status: AttendanceStatus;
  remarks: string | null;
  recorded_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ResultRow = {
  id: string;
  student_id: string;
  subject_id: string;
  class_id: string;
  academic_year_id: string | null;
  term_id: string;
  ca1_score: number;
  ca2_score: number;
  exam_score: number;
  ca_score: number;
  total_score: number;
  grade: string | null;
  remark: string | null;
  position_in_class: number | null;
  status: ResultStatus;
  entered_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContinuousAssessmentRow = {
  id: string;
  result_id: string;
  title: string;
  max_score: number;
  score: number | null;
  recorded_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ReportCardRow = {
  id: string;
  student_id: string;
  class_id: string;
  academic_year_id: string | null;
  term_id: string;
  subjects_offered: number | null;
  total_score: number | null;
  average_score: number | null;
  position_in_class: number | null;
  class_size: number | null;
  days_school_open: number | null;
  days_present: number | null;
  days_absent: number | null;
  next_term_begins: string | null;
  class_teacher_remark: string | null;
  principal_remark: string | null;
  status: ResultStatus;
  generated_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AssignmentRow = {
  id: string;
  class_id: string;
  subject_id: string | null;
  teacher_id: string | null;
  academic_year_id: string | null;
  term_id: string | null;
  title: string;
  description: string | null;
  attachment_url: string | null;
  max_score: number;
  due_date: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type AssignmentSubmissionRow = {
  id: string;
  assignment_id: string;
  student_id: string;
  content: string | null;
  attachment_url: string | null;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  submitted_at: string | null;
  graded_by: string | null;
  graded_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TimetableRow = {
  id: string;
  class_id: string;
  subject_id: string | null;
  teacher_id: string | null;
  academic_year_id: string | null;
  term_id: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string | null;
  created_at: string;
  updated_at: string;
};export type FeeStructureRow = {
  id: string;
  academic_year_id: string;
  term_id: string | null;
  class_id: string | null;
  name: string;
  description: string | null;
  total_amount: number;
  due_date: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type FeeItemRow = {
  id: string;
  fee_structure_id: string;
  name: string;
  amount: number;
  is_optional: boolean;
  sort_order: number;
  created_at: string;
};

export type InvoiceRow = {
  id: string;
  invoice_no: string;
  student_id: string;
  fee_structure_id: string | null;
  academic_year_id: string | null;
  term_id: string | null;
  title: string;
  total_amount: number;
  amount_paid: number;
  balance: number;
  status: InvoiceStatus;
  due_date: string | null;
  issued_at: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentRow = {
  id: string;
  invoice_id: string | null;
  student_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string | null;
  narration: string | null;
  paid_at: string;
  recorded_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentReceiptRow = {
  id: string;
  payment_id: string;
  receipt_no: string;
  issued_by: string | null;
  issued_at: string;
  snapshot: Json;
  notes: string | null;
  created_at: string;
};

export type NewsRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string;
  author_id: string | null;
  author_name: string | null;
  status: ContentStatus;
  is_featured: boolean;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  cover_image_url: string | null;
  category: string;
  status: ContentStatus;
  is_featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type GalleryAlbumRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  category: string;
  is_published: boolean;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type GalleryImageRow = {
  id: string;
  album_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};export type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  class_id: string | null;
  priority: string;
  is_published: boolean;
  publish_at: string;
  expires_at: string | null;
  author_id: string | null;
  author_name: string | null;
  created_at: string;
  updated_at: string;
};

export type CircularRow = {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  audience: AnnouncementAudience;
  is_published: boolean;
  published_at: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PageRow = {
  id: string;
  slug: string;
  title: string;
  section: string;
  content: string;
  is_published: boolean;
  updated_by: string | null;
  updated_by_name: string | null;
  created_at: string;
  updated_at: string;
};

export type SiteSettingRow = {
  key: string;
  value: Json;
  label: string | null;
  group_name: string;
  updated_by: string | null;
  updated_at: string;
};

export type ContactMessageRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  handled_by: string | null;
  handled_at: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ClubRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  patron_id: string | null;
  meeting_day: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ClubMemberRow = {
  id: string;
  club_id: string;
  student_id: string;
  role: string;
  joined_at: string;
};export type AdmissionSessionRow = {
  id: string;
  name: string;
  academic_year_id: string | null;
  opens_on: string | null;
  closes_on: string | null;
  application_fee: number;
  is_open: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type AdmissionRequirementRow = {
  id: string;
  session_id: string | null;
  title: string;
  description: string | null;
  is_required: boolean;
  sort_order: number;
  created_at: string;
};

export type AdmissionApplicationRow = {
  id: string;
  application_no: string;
  session_id: string | null;
  first_name: string;
  last_name: string;
  other_names: string | null;
  gender: Gender;
  date_of_birth: string;
  nationality: string;
  state_of_origin: string | null;
  class_applying_for: string;
  previous_school: string | null;
  previous_class: string | null;
  guardian_full_name: string;
  guardian_email: string;
  guardian_phone: string;
  guardian_relationship: string;
  guardian_occupation: string | null;
  address: string;
  medical_notes: string | null;
  how_heard_about_us: string | null;
  status: ApplicationStatus;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  applicant_profile_id: string | null;
  converted_student_id: string | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
};

export type ApplicationDocumentRow = {
  id: string;
  application_id: string;
  doc_type: DocumentType;
  file_name: string | null;
  file_url: string;
  uploaded_at: string;
};

export type MessageRow = {
  id: string;
  sender_id: string;
  recipient_id: string;
  student_id: string | null;
  subject: string;
  body: string;
  is_read: boolean;
  read_at: string | null;
  parent_message_id: string | null;
  created_at: string;
};

export type NotificationRow = {
  id: string;
  profile_id: string;
  title: string;
  body: string | null;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export type AuditLogRow = {
  id: string;
  action: string;
  category: string;
  details: string | null;
  actor_id: string | null;
  actor_email: string | null;
  actor_name: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Json;
  created_at: string;
};

export type StaffDirectoryPublicRow = {
  id: string;
  staff_no: string;
  full_name: string;
  position: string;
  department: string | null;
  qualification: string | null;
  biography: string | null;
  photo_url: string | null;
  sort_order: number;
};

/** Result row of the `my_children()` helper (migration 09 — family portals). */
export type MyChildRow = {
  student_id: string;
  profile_id: string;
  full_name: string;
  admission_no: string;
  class_id: string | null;
  class_name: string | null;
  gender: Gender | null;
  status: StudentStatus;
  photo_url: string | null;
  relationship: string;
  is_primary: boolean;
};

/** Result row of the `teacher_directory()` helper (migration 09). */
export type TeacherDirectoryRow = {
  profile_id: string;
  full_name: string;
  position: string;
};

/** Result row of the `school_contacts()` helper (migration 09). */
export type SchoolContactRow = {
  profile_id: string;
  full_name: string;
  role: UserRole;
};// ---------------------------------------------------------------------------
// Database schema
// ---------------------------------------------------------------------------
export type Database = {
  public: {
    Tables: {
      profiles: Tbl<
    ProfileRow,
    | 'id'
    | 'avatar_url'
    | 'last_login_at'
    | 'role'
    | 'is_active'
    | 'is_verified'
    | 'notification_preferences'
    | 'created_at'
    | 'updated_at'
  >;
      academic_years: Tbl<AcademicYearRow, 'id' | 'created_at' | 'updated_at'>;
      terms: Tbl<TermRow, 'id' | 'created_at' | 'updated_at'>;
      classes: Tbl<ClassRow, 'id' | 'created_at' | 'updated_at'>;
      subjects: Tbl<SubjectRow, 'id' | 'created_at' | 'updated_at'>;
      class_subjects: Tbl<ClassSubjectRow, 'id' | 'created_at'>;
      students: Tbl<
        StudentRow,
        | 'id'
        | 'gender'
        | 'class_id'
        | 'address'
        | 'photo_url'
        | 'blood_group'
        | 'genotype'
        | 'medical_notes'
        | 'admitted_on'
        | 'status'
        | 'created_at'
        | 'updated_at'
      >;
      staff: Tbl<
        StaffRow,
        | 'id'
        | 'position'
        | 'department'
        | 'qualification'
        | 'biography'
        | 'photo_url'
        | 'date_hired'
        | 'is_public'
        | 'sort_order'
        | 'status'
        | 'created_at'
        | 'updated_at'
      >;
      parents: Tbl<
        ParentRow,
        | 'id'
        | 'occupation'
        | 'employer'
        | 'address'
        | 'alt_phone'
        | 'relationship'
        | 'created_at'
        | 'updated_at'
      >;
      parent_student: Tbl<ParentStudentRow, 'created_at'>;
      staff_subjects: Tbl<StaffSubjectRow, 'created_at'>;
      staff_classes: Tbl<StaffClassRow, 'created_at'>;
      alumni: Tbl<AlumniRow, 'id' | 'created_at' | 'updated_at'>;
      pta_members: Tbl<PtaMemberRow, 'id' | 'created_at'>;
      attendance: Tbl<AttendanceRow, 'id' | 'created_at' | 'updated_at'>;
      results: Tbl<ResultRow, 'id' | 'ca_score' | 'total_score' | 'created_at' | 'updated_at'>;
      continuous_assessments: Tbl<ContinuousAssessmentRow, 'id' | 'created_at' | 'updated_at'>;
      report_cards: Tbl<ReportCardRow, 'id' | 'created_at' | 'updated_at'>;
      assignments: Tbl<AssignmentRow, 'id' | 'created_at' | 'updated_at'>;
      assignment_submissions: Tbl<AssignmentSubmissionRow, 'id' | 'created_at' | 'updated_at'>;
      timetables: Tbl<TimetableRow, 'id' | 'created_at' | 'updated_at'>;
      fee_structures: Tbl<FeeStructureRow, 'id' | 'created_at' | 'updated_at'>;
      fee_items: Tbl<FeeItemRow, 'id' | 'created_at'>;
      invoices: Tbl<InvoiceRow, 'id' | 'balance' | 'created_at' | 'updated_at'>;
      payments: Tbl<PaymentRow, 'id' | 'created_at' | 'updated_at'>;
      payment_receipts: Tbl<PaymentReceiptRow, 'id' | 'created_at'>;
      news: Tbl<NewsRow, 'id' | 'created_at' | 'updated_at'>;
      events: Tbl<EventRow, 'id' | 'created_at' | 'updated_at'>;
      gallery_albums: Tbl<GalleryAlbumRow, 'id' | 'created_at' | 'updated_at'>;
      gallery_images: Tbl<GalleryImageRow, 'id' | 'created_at'>;
      announcements: Tbl<AnnouncementRow, 'id' | 'created_at' | 'updated_at'>;
      circulars: Tbl<CircularRow, 'id' | 'created_at' | 'updated_at'>;
      pages: Tbl<PageRow, 'id' | 'created_at' | 'updated_at'>;
      site_settings: Tbl<SiteSettingRow, 'updated_at'>;
      contact_messages: Tbl<ContactMessageRow, 'id' | 'created_at'>;
      faqs: Tbl<FaqRow, 'id' | 'created_at' | 'updated_at'>;
      clubs: Tbl<ClubRow, 'id' | 'created_at' | 'updated_at'>;
      club_members: Tbl<ClubMemberRow, 'id' | 'joined_at'>;
      admission_sessions: Tbl<AdmissionSessionRow, 'id' | 'created_at' | 'updated_at'>;
      admission_requirements: Tbl<AdmissionRequirementRow, 'id' | 'created_at'>;
      admission_applications: Tbl<AdmissionApplicationRow, 'id' | 'created_at' | 'updated_at'>;
      application_documents: Tbl<ApplicationDocumentRow, 'id' | 'uploaded_at'>;
      messages: Tbl<MessageRow, 'id' | 'created_at'>;
      notifications: Tbl<NotificationRow, 'id' | 'created_at'>;
      audit_logs: Tbl<AuditLogRow, 'id' | 'created_at'>;
    };
    Views: {
      staff_directory_public: Tbl<StaffDirectoryPublicRow>;
    };
    Functions: {
      site_setting: { Args: { setting_key: string }; Returns: Json };
      site_text: { Args: { setting_key: string; fallback?: string }; Returns: string };
      generate_admission_no: { Args: Record<string, never>; Returns: string };
      generate_staff_no: { Args: Record<string, never>; Returns: string };
      next_invoice_no: { Args: Record<string, never>; Returns: string };
      public_staff_directory: { Args: Record<string, never>; Returns: StaffDirectoryPublicRow[] };
      my_children: { Args: Record<string, never>; Returns: MyChildRow[] };
      teacher_directory: { Args: Record<string, never>; Returns: TeacherDirectoryRow[] };
      school_contacts: { Args: Record<string, never>; Returns: SchoolContactRow[] };
    };
    Enums: {
      user_role: UserRole;
      gender_type: Gender;
      student_status: StudentStatus;
      staff_status: StaffStatus;
      school_level: SchoolLevel;
      term_name: TermName;
      attendance_status: AttendanceStatus;
      result_status: ResultStatus;
      submission_status: SubmissionStatus;
      invoice_status: InvoiceStatus;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      content_status: ContentStatus;
      announcement_audience: AnnouncementAudience;
      faq_category: FaqCategory;
      application_status: ApplicationStatus;
      document_type: DocumentType;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;
export type RowOf<T extends TableName> = Tables[T]['Row'];
export type InsertOf<T extends TableName> = Tables[T]['Insert'];
export type UpdateOf<T extends TableName> = Tables[T]['Update'];