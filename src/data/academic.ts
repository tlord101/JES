export interface Subject {
  name: string;
  code: string;
  department: string;
  description: string;
}

export interface Club {
  slug: string;
  name: string;
  motto: string;
  meetingDays: string;
  patron: string;
  description: string;
  activities: string[];
  icon: string;
}

export const subjectsList: Subject[] = [
  { name: "Mathematics", code: "MTH", department: "Mathematics & ICT", description: "Foundational arithmetic, algebra, geometry, trigonometry, and analytical problem solving." },
  { name: "English Language & Literature", code: "ENG", department: "Humanities", description: "Grammar, composition, essay writing, comprehension, and classical literature analysis." },
  { name: "Physics", code: "PHY", department: "Sciences", description: "Study of mechanics, energy, wave motion, electricity, magnetism, and modern physics." },
  { name: "Chemistry", code: "CHM", department: "Sciences", description: "Inorganic, organic, physical chemistry, and hands-on laboratory experiments." },
  { name: "Biology", code: "BIO", department: "Sciences", description: "Cellular biology, human anatomy, genetics, ecology, and plant physiological processes." },
  { name: "Civic Education & Social Grace", code: "CVE", department: "Social Sciences", description: "Citizenship, moral values, human rights, etiquette, and social decorum." },
  { name: "Computer Science & Coding", code: "CSC", department: "Mathematics & ICT", description: "Computer literacy, practical programming fundamentals, digital ethics, and web basics." },
  { name: "Economics & Business Studies", code: "ECO", department: "Commercial", description: "Economic principles, financial literacy, business management, and commerce." }
];

export const clubsList: Club[] = [
  {
    slug: "red-cross",
    name: "Red Cross Youth Society",
    motto: "Through Humanity to Peace",
    meetingDays: "Wednesdays (2:30 PM - 4:00 PM)",
    patron: "Nurse Mary Igbinoba",
    description: "The Red Cross Youth Society trains students in first aid treatment, emergency response, health hygiene awareness, and community humanitarian service.",
    activities: [
      "Certified First Aid and CPR drills",
      "School health and sanitation campaigns",
      "Community outreach and visitation to care homes",
      "Disaster preparedness simulation exercises"
    ],
    icon: "bi-plus-circle-fill"
  },
  {
    slug: "chess",
    name: "Royal Chess & Strategy Club",
    motto: "Strategic Minds, Masters of Tomorrow",
    meetingDays: "Thursdays (2:30 PM - 4:00 PM)",
    patron: "Mr. Emmanuel Okonkwo",
    description: "Fostering critical reasoning, spatial foresight, patience, and competitive tactical decision making through classical chess.",
    activities: [
      "Tactical openings and endgame masterclasses",
      "Weekly intra-school blitz tournaments",
      "Inter-school chess championships",
      "Logic and puzzle solving challenges"
    ],
    icon: "bi-controller"
  },
  {
    slug: "literary",
    name: "Literary & Debating Society",
    motto: "Eloquent Voices, Persuasive Arguments",
    meetingDays: "Tuesdays (2:30 PM - 4:00 PM)",
    patron: "Mr. Osaro Edokpolo",
    description: "Empowering students with public speaking eloquence, formal parliamentary debate techniques, creative writing, and drama.",
    activities: [
      "Parliamentary mock debates",
      "Creative poetry writing and recitations",
      "Public speaking & elocution drills",
      "Annual Inter-School Debate Series"
    ],
    icon: "bi-journal-richtext"
  },
  {
    slug: "catering",
    name: "Home Economics & Culinary Arts Club",
    motto: "Nurturing Grace through Culinary Mastery",
    meetingDays: "Fridays (2:30 PM - 4:00 PM)",
    patron: "Mrs. Blessing Adebayo",
    description: "Instilling domestic skills, nutrition science, table etiquette, baking, and international culinary arts.",
    activities: [
      "Baking and pastry decoration masterclasses",
      "Nutritional meal planning and table arrangement",
      "Cultural dish tasting exhibitions",
      "Hospitality and dining grace training"
    ],
    icon: "bi-cup-hot"
  }
];
