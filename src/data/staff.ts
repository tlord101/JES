export interface StaffMember {
  slug: string;
  name: string;
  position: string;
  department: string;
  subjects: string[];
  biography: string;
  qualification: string;
  photo: string;
  email: string;
}

export const staffMembers: StaffMember[] = [
  {
    slug: "dr-mrs-e-o-aigbe",
    name: "Dr. (Mrs.) E. O. Aigbe",
    position: "Executive Principal",
    department: "Executive Management",
    subjects: ["School Leadership", "Educational Management"],
    biography: "Dr. (Mrs.) E. O. Aigbe has over 25 years of distinguished experience in educational leadership, curriculum engineering, and youth mentoring. She holds a Ph.D. in Educational Administration and is passionate about raising morally upright and academically stellar global leaders.",
    qualification: "Ph.D. Educational Leadership, M.Ed. Guidance & Counseling, B.Ed. English",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    email: "principal@jasmineexclusiveschool.com"
  },
  {
    slug: "mr-emmanuel-okonkwo",
    name: "Mr. Emmanuel Okonkwo",
    position: "Vice Principal (Academics)",
    department: "Academic Administration",
    subjects: ["Mathematics", "Further Mathematics"],
    biography: "Mr. Emmanuel Okonkwo oversees academic standards, teacher assessment, and curriculum implementation. With 16 years of classroom and administrative experience, he ensures JES students excel in national and international examinations.",
    qualification: "M.Sc. Industrial Mathematics, B.Sc. Mathematics Education",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    email: "academics@jasmineexclusiveschool.com"
  },
  {
    slug: "mrs-grace-osagie",
    name: "Mrs. Grace Osagie",
    position: "Head of Sciences & STEM Lead",
    department: "Sciences",
    subjects: ["Chemistry", "Basic Science"],
    biography: "Mrs. Grace Osagie leads the Science department with an engaging hands-on laboratory approach. She has trained numerous state and national science quiz champions.",
    qualification: "B.Sc. Ed. Chemistry (Uniben)",
    photo: "https://images.unsplash.com/photo-1580894732413-a751516a4a3b?auto=format&fit=crop&q=80&w=800",
    email: "sciences@jasmineexclusiveschool.com"
  },
  {
    slug: "mr-osaro-edokpolo",
    name: "Mr. Osaro Edokpolo",
    position: "Head of Humanities & Literary Club Patron",
    department: "Humanities",
    subjects: ["English Language", "Literature-in-English"],
    biography: "Mr. Osaro Edokpolo is a seasoned literaire and speech coach dedicated to instilling strong communication skills, critical thinking, and social grace in JES students.",
    qualification: "M.A. English Language, B.A. English & Literary Studies",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    email: "humanities@jasmineexclusiveschool.com"
  }
];
