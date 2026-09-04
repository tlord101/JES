export interface SchoolEvent {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  image: string;
}

export const eventsList: SchoolEvent[] = [
  {
    slug: "orientation-day-2025",
    title: "New Student & Parent Orientation Day",
    date: "September 6, 2025",
    time: "10:00 AM - 1:00 PM",
    location: "School Main Auditorium, Campus A",
    description: "An essential orientation session for newly admitted students and parents to understand school policies, academic expectations, and school culture.",
    category: "Orientation",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "first-term-resumption-2025",
    title: "First Term Resumption Day",
    date: "September 8, 2025",
    time: "7:30 AM",
    location: "Main Campus, Benin City",
    description: "Official start of classes for the First Term 2025/2026 academic year across Nursery, Primary, and Secondary divisions.",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "pta-general-meeting-q1",
    title: "First Term PTA General Meeting",
    date: "October 11, 2025",
    time: "10:00 AM - 12:30 PM",
    location: "Multipurpose Hall & Virtual Stream",
    description: "Discussion on school development projects, academic progress reviews, and election of new parent committee representatives.",
    category: "PTA",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "annual-cultural-day-2025",
    title: "JES Cultural Heritage & Diversity Festival",
    date: "October 24, 2025",
    time: "9:00 AM - 3:00 PM",
    location: "School Sports Complex",
    description: "Celebrating rich Nigerian and global cultural heritage through music, traditional attire, drama, and culinary exhibitions.",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
  }
];
