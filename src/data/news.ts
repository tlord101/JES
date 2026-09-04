export interface NewsArticle {
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  summary: string;
  content: string;
  image: string;
  featured?: boolean;
}

export const newsArticles: NewsArticle[] = [
  {
    slug: "resumption-for-first-term-2025-2026",
    title: "Official Resumption Announcement for First Term 2025/2026 Academic Session",
    category: "Announcements",
    date: "September 1, 2025",
    author: "School Administration",
    summary: "Jasmine Exclusive School warmly welcomes all new and returning students to the start of the 2025/2026 Academic Session.",
    content: `Jasmine Exclusive School is excited to welcome our students, parents, and staff back for the 2025/2026 Academic Session.

Boarding students are expected to report to their hostels on Sunday, September 7, 2025, between 12:00 PM and 5:00 PM. Day students will resume on Monday, September 8, 2025, at 7:30 AM.

All students must be dressed in complete, clean school uniforms and possess their required learning materials. We look forward to an academic year filled with diligence, academic excellence, and character development.`,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800",
    featured: true,
  },
  {
    slug: "annual-inter-house-sports-competition",
    title: "Annual Inter-House Sports Competition Announced",
    category: "Sports",
    date: "August 20, 2025",
    author: "Sports Department",
    summary: "Preparations are underway for the highly anticipated Jasmine Exclusive School Annual Inter-House Sports Competition.",
    content: `Our annual Inter-House Sports Competition will take place in November 2025 at the main school athletic grounds.

Students across Red, Blue, Green, and Yellow houses will compete in track and field events, relay races, high jump, chess, and football. Sportsmanship, physical fitness, and healthy competition remain core pillars of physical education at Jasmine Exclusive School.`,
    image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "national-literary-competition-winners",
    title: "JES Literary Club Triumphs at National Essay Competition",
    category: "Academics",
    date: "July 14, 2025",
    author: "Department of English",
    summary: "Students from our Senior Secondary Literary & Debating Club emerged top winners in the National Schools Essay Competition.",
    content: `We are immensely proud to announce that two of our SS2 students secured 1st and 3rd positions in the prestigious National Schools Essay Competition held in Abuja.

Their insightful essays on 'Education as the Bedrock of National Development' impressed the panel of distinguished judges. We congratulate our students and their patrons for demonstrating Diligence for Excellence.`,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "stem-exhibition-2025",
    title: "Annual Science & Technology Innovation Fair",
    category: "STEM",
    date: "June 28, 2025",
    author: "Science Department",
    summary: "Students displayed innovative robotics models, renewable energy prototypes, and digital solutions at the 2025 STEM Fair.",
    content: `The 2025 Science & Technology Innovation Fair showcased the exceptional creative and analytical problem-solving abilities of JES students. Projects included solar power chargers, automated irrigation systems, and web application prototypes.`,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
  }
];
