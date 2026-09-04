export interface CalendarEvent {
  title: string;
  date: string;
  term: "First Term" | "Second Term" | "Third Term";
  category: "Resumption" | "Exams" | "PTA" | "Sports" | "Holiday" | "Closing";
  description?: string;
}

export const termCalendar: CalendarEvent[] = [
  // First Term
  { title: "Hostel Resumption (Boarders)", date: "Sunday, September 7, 2025", term: "First Term", category: "Resumption" },
  { title: "First Term Official Resumption", date: "Monday, September 8, 2025", term: "First Term", category: "Resumption" },
  { title: "First Term PTA General Meeting", date: "Saturday, October 11, 2025", term: "First Term", category: "PTA" },
  { title: "Mid-Term Break", date: "October 29 - October 31, 2025", term: "First Term", category: "Holiday" },
  { title: "First Term Continuous Assessments", date: "November 10 - November 14, 2025", term: "First Term", category: "Exams" },
  { title: "First Term Examinations", date: "December 1 - December 10, 2025", term: "First Term", category: "Exams" },
  { title: "First Term Vacation Begins", date: "Friday, December 12, 2025", term: "First Term", category: "Closing" },

  // Second Term
  { title: "Second Term Resumption", date: "Monday, January 12, 2026", term: "Second Term", category: "Resumption" },
  { title: "Annual Inter-House Sports Day", date: "Thursday, February 19, 2026", term: "Second Term", category: "Sports" },
  { title: "Second Term Mid-Term Break", date: "February 25 - February 27, 2026", term: "Second Term", category: "Holiday" },
  { title: "Second Term Examinations", date: "March 23 - April 2, 2026", term: "Second Term", category: "Exams" },
  { title: "Second Term Vacation Begins", date: "Friday, April 3, 2026", term: "Second Term", category: "Closing" },

  // Third Term
  { title: "Third Term Resumption", date: "Monday, April 27, 2026", term: "Third Term", category: "Resumption" },
  { title: "Third Term PTA Meeting", date: "Saturday, May 23, 2026", term: "Third Term", category: "PTA" },
  { title: "Third Term Examinations", date: "July 6 - July 16, 2026", term: "Third Term", category: "Exams" },
  { title: "Valedictory Service & Graduation", date: "Friday, July 24, 2026", term: "Third Term", category: "Closing" }
];
