export interface PTANewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export interface PTAEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  agenda: string;
}

export const ptaNewsList: PTANewsItem[] = [
  {
    id: "pta-donates-new-ict-equipment",
    title: "PTA Donates 30 High-Performance Laptops to School Computer Lab",
    date: "August 15, 2025",
    summary: "In a landmark initiative, the Parent-Teacher Association presented brand new computing equipment to bolster STEM learning.",
    content: "The Parent-Teacher Association (PTA) of Jasmine Exclusive School has successfully handed over 30 state-of-the-art laptop computers to the school executive management to enhance digital literacy and programming education for all students."
  },
  {
    id: "parent-teacher-interactive-forum-outcomes",
    title: "Outcomes of the Termly Parent-Teacher Interactive Forum",
    date: "July 20, 2025",
    summary: "Key resolutions regarding student welfare, security enhancements, and school bus expansion were adopted.",
    content: "During the recent general meeting, parents and management reached consensus on expanding school bus pick-up zones in Benin City and introducing automated attendance notifications via SMS/email."
  }
];

export const ptaEventsList: PTAEventItem[] = [
  {
    id: "first-term-pta-general-assembly",
    title: "First Term PTA General Assembly & Executive Election",
    date: "October 11, 2025",
    time: "10:00 AM",
    venue: "Main Campus Auditorium, Aduwawa",
    agenda: "Review of school development projects, financial reporting, and election of parent representatives."
  },
  {
    id: "pta-family-fun-day-2025",
    title: "Annual PTA Family Fun & Cultural Fair",
    date: "November 29, 2025",
    time: "11:00 AM - 4:00 PM",
    venue: "JES Sports Complex",
    agenda: "Networking, parent-student sports activities, food stalls, and community bonding."
  }
];
