export interface AlumniMember {
  id: string;
  name: string;
  graduationYear: number;
  profession: string;
  organization: string;
  location: string;
  bio: string;
  photo: string;
}

export interface AlumniNewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
}

export interface AlumniEventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export const alumniDirectory: AlumniMember[] = [
  {
    id: "dr-osagie-enabulele",
    name: "Dr. Osagie Enabulele",
    graduationYear: 2012,
    profession: "Medical Doctor / Public Health Specialist",
    organization: "Lagos University Teaching Hospital",
    location: "Lagos, Nigeria",
    bio: "Osagie graduated as top student in 2012 and went on to complete his MBBS with distinction. He credits JES for instilling disciplined study habits.",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "engr-chidinma-okoro",
    name: "Engr. Chidinma Okoro",
    graduationYear: 2015,
    profession: "Software Engineer",
    organization: "Microsoft Africa Development Center",
    location: "Nairobi, Kenya",
    bio: "Chidinma was the president of the JES Science Club in 2015. She is now a lead cloud infrastructure engineer.",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "barr-victor-omoruyi",
    name: "Barr. Victor Omoruyi",
    graduationYear: 2014,
    profession: "Corporate Attorney",
    organization: "Omoruyi & Partners Legal Practitioners",
    location: "Benin City, Nigeria",
    bio: "Victor was an active member of the Literary & Debating Society at JES and now practices corporate and constitutional law.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
  }
];

export const alumniNewsList: AlumniNewsItem[] = [
  {
    id: "alumni-endowment-fund-launched",
    title: "JES Alumni Association Launches Scholarship Endowment Fund",
    date: "August 1, 2025",
    summary: "The alumni network has raised ₦10M to sponsor tuition fees for deserving indigent students over the next 5 years."
  },
  {
    id: "alumnus-keynote-address",
    title: "Engr. Chidinma Okoro Addresses JES 2025 Graduating Class",
    date: "July 25, 2025",
    summary: "Distinguished alumna shared inspiring insights on career readiness and resilience at the 2025 Valedictory Ceremony."
  }
];

export const alumniEventsList: AlumniEventItem[] = [
  {
    id: "annual-alumni-homecoming-2025",
    title: "Grand Alumni Homecoming & Dinner Gala 2025",
    date: "December 20, 2025",
    location: "JES Grand Ballroom & Gardens, Benin City",
    description: "An evening of reconnection, networking, celebrating achievements, and honoring past mentors."
  },
  {
    id: "alumni-mentorship-webinar",
    title: "Global Career Mentorship Virtual Session",
    date: "November 15, 2025",
    location: "Zoom Virtual Conference",
    description: "Alumni across healthcare, technology, law, and finance mentor SS3 students preparing for university entry."
  }
];
