import { logAuditEvent } from './auditStore';

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  section: 'Homepage' | 'About' | 'Admissions' | 'Academics' | 'Contact' | 'Policy';
  content: string;
  updatedAt: string;
  updatedBy: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  author: string;
  publishDate: string;
  status: 'Draft' | 'Published';
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: string;
  type: 'image' | 'document' | 'video';
  category: string;
  uploadedAt: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  photoCount: number;
  category: string;
  photos: string[];
}

export interface StudentRecord {
  id: string;
  admissionNo: string;
  name: string;
  gender: 'Male' | 'Female';
  dob: string;
  class: string;
  parentId: string;
  parentName: string;
  photo: string;
  session: string;
  status: 'Active' | 'Graduated' | 'Suspended' | 'Withdrawn';
}

export interface ParentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  wardIds: string[];
  wardNames: string[];
  status: 'Active' | 'Inactive';
}

export interface StaffRecord {
  id: string;
  name: string;
  position: string;
  department: string;
  subjects: string[];
  qualifications: string;
  photo: string;
  biography: string;
  status: 'Active' | 'On Leave' | 'Resigned';
}

// Global In-Memory CMS Stores
export const pagesCMSStore: PageContent[] = [
  {
    id: 'pg_home',
    slug: 'homepage',
    title: 'Homepage Content & Hero Banner',
    section: 'Homepage',
    content: 'Nurturing intellectually excellent, morally sound and socially responsible children prepared to become agents of positive change in society.',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin',
  },
  {
    id: 'pg_mission',
    slug: 'mission-vision',
    title: 'Mission & Vision Statement',
    section: 'About',
    content: 'Mission: To diligently nurture children\'s intellectual inclination until they become excellent academically and morally sound. Vision: To raise excellent moral agents of change in our society.',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Admin',
  },
  {
    id: 'pg_principal',
    slug: 'principal-message',
    title: 'Principal\'s Official Address',
    section: 'About',
    content: 'Welcome to Jasmine Exclusive School. Education at Jasmine Exclusive School is built upon our unyielding motto: Diligence for Excellence.',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Principal',
  },
];

export const newsCMSStore: NewsArticle[] = [
  {
    id: 'news_1',
    title: 'Jasmine Exclusive School Wins National STEM Robotics Competition',
    slug: 'stem-robotics-championship-2024',
    excerpt: 'Our senior secondary robotics team took first place with their solar-powered water filtration prototype.',
    content: 'Our senior secondary robotics team took first place with their solar-powered water filtration prototype at the annual West African STEM exposition held in Abuja. The project demonstrated immense ingenuity and technical precision.',
    featuredImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    category: 'Academics',
    author: 'Editorial Desk',
    publishDate: '2024-11-10',
    status: 'Published',
  },
  {
    id: 'news_2',
    title: 'Inter-House Sports Festival 2025 Scheduled for February',
    slug: 'inter-house-sports-festival-2025',
    excerpt: 'All four houses gear up for track, field, and indoor sporting events across two excitement-packed days.',
    content: 'The annual Jasmine Exclusive School Inter-House Sports competition is officially slated for February 14-15, 2025. Blue Sapphire, Red Ruby, Green Emerald, and Gold Topaz houses will compete for the championship trophy.',
    featuredImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    category: 'Sports',
    author: 'Sports Master',
    publishDate: '2024-12-01',
    status: 'Published',
  },
];

export const eventsCMSStore: EventItem[] = [
  {
    id: 'evt_1',
    title: 'Annual Science Fair & Innovation Day',
    slug: 'science-fair-2025',
    date: '2025-02-18',
    time: '09:00 AM - 03:00 PM',
    location: 'Main Science Auditorium, Aduwawa Campus',
    description: 'Exhibition of innovative student inventions, experiments, and research posters across Physics, Chemistry, Biology, and ICT.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    category: 'Academic',
  },
  {
    id: 'evt_2',
    title: 'Parent Teacher Association (PTA) General Meeting',
    slug: 'pta-general-meeting-term2',
    date: '2025-02-22',
    time: '10:00 AM - 01:00 PM',
    location: 'School Assembly Hall',
    description: 'Termly consultative gathering between school management and parents to discuss academic broadsheets, infrastructure improvements, and student welfare.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    category: 'PTA',
  },
];

export const mediaCMSStore: MediaFile[] = [
  {
    id: 'med_1',
    name: 'School_Prospectus_2024_2025.pdf',
    url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80',
    size: '2.4 MB',
    type: 'document',
    category: 'Admissions',
    uploadedAt: '2024-09-01',
  },
  {
    id: 'med_2',
    name: 'Aduwawa_Main_Campus_Aerial.jpg',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    size: '1.8 MB',
    type: 'image',
    category: 'Campus',
    uploadedAt: '2024-10-15',
  },
];

export const faqsCMSStore: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'Admissions',
    question: 'What are the admission requirements for new students?',
    answer: 'Applicants must submit completed application forms, previous academic transcripts, birth certificates, 2 passport photos, and undergo our entrance examination and interview process.',
  },
  {
    id: 'faq_2',
    category: 'Fees',
    question: 'How are tuition fees structured and paid?',
    answer: 'Tuition fees are paid termly prior to resumption via bank draft or our secure school online portal. Detailed fee breakdowns are provided upon admission.',
  },
];

export const galleryCMSStore: GalleryAlbum[] = [
  {
    id: 'alb_1',
    title: 'Cultural Heritage Day 2024',
    slug: 'cultural-heritage-day-2024',
    coverImage: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    photoCount: 18,
    category: 'Culture',
    photos: [
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

export const studentsStore: StudentRecord[] = [
  {
    id: 'std_01',
    admissionNo: 'JES/2022/084',
    name: 'David Okafor',
    gender: 'Male',
    dob: '2008-05-14',
    class: 'SS 1 Blue',
    parentId: 'prt_01',
    parentName: 'Dr. Emmanuel Okafor',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    session: '2024/2025',
    status: 'Active',
  },
  {
    id: 'std_02',
    admissionNo: 'JES/2023/112',
    name: 'Chinecherem Okafor',
    gender: 'Female',
    dob: '2010-09-20',
    class: 'JSS 2 Gold',
    parentId: 'prt_01',
    parentName: 'Dr. Emmanuel Okafor',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    session: '2024/2025',
    status: 'Active',
  },
];

// Export aliases for backwards and cross-branch compatibility
export const newsPosts = newsCMSStore;
export const upcomingEvents = eventsCMSStore;
export const eventsPosts = eventsCMSStore;

export const parentsStore: ParentRecord[] = [
  {
    id: 'prt_01',
    name: 'Dr. Emmanuel Okafor',
    email: 'parent@jasmine.edu.ng',
    phone: '+234 803 123 4567',
    address: '24 Limit Road, Off Sapele Road, Benin City, Edo State',
    wardIds: ['std_01', 'std_02'],
    wardNames: ['David Okafor', 'Chinecherem Okafor'],
    status: 'Active',
  },
];

export const staffRecordsStore: StaffRecord[] = [
  {
    id: 'stf_01',
    name: 'Dr. (Mrs.) E. A. Jasmine',
    position: 'School Principal',
    department: 'Administration',
    subjects: ['Educational Management', 'English Literature'],
    qualifications: 'B.Ed, M.Ed, Ph.D Educational Leadership',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    biography: 'Dr. Jasmine brings over 25 years of visionary leadership in Nigerian basic and secondary education.',
    status: 'Active',
  },
  {
    id: 'stf_02',
    name: 'Mr. Osagie Aghedo',
    position: 'Head of Mathematics Department',
    department: 'Mathematics & Computing',
    subjects: ['Mathematics', 'Further Mathematics'],
    qualifications: 'B.Sc Industrial Mathematics, PGDE',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    biography: 'Specializes in preparing secondary students for Olympiad and WAEC mathematics distinction.',
    status: 'Active',
  },
];
