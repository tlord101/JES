export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const faqCategories = [
  "Admissions",
  "Fees",
  "Uniform",
  "Transportation",
  "Boarding",
  "Academics",
  "Exams",
  "School hours",
  "Portal"
];

export const faqList: FAQItem[] = [
  {
    category: "Admissions",
    question: "What is the admission procedure for prospective students?",
    answer: "Prospective parents begin by purchasing an application form online or at our administrative office. The student then sits for a placement diagnostic test, followed by a brief family interaction interview."
  },
  {
    category: "Admissions",
    question: "At what age can a child be admitted into Nursery/Primary?",
    answer: "Children entering Creche must be at least 3 months old; Nursery 1 applicants must be at least 3 years old by September of the admission year."
  },
  {
    category: "Fees",
    question: "What are the school fees structures?",
    answer: "School fees vary by academic arm (Nursery, Primary, Junior Secondary, and Senior Secondary). A detailed breakdown is provided upon application or through our Admissions Office."
  },
  {
    category: "Fees",
    question: "Are flexible payment plans or installments available?",
    answer: "Yes, parents may opt for termly installment plans approved by the accounts department prior to the resumption of each academic term."
  },
  {
    category: "Uniform",
    question: "Where can parents purchase the official school uniform?",
    answer: "Official school uniforms, sports wear, and cardigan sets are supplied directly through the school bookstore upon payment of the uniform fee."
  },
  {
    category: "Transportation",
    question: "Does Jasmine Exclusive School offer bus transportation?",
    answer: "Yes, we operate safe, air-conditioned school bus routes across key neighborhoods in Benin City, including Aduwawa, Ikpoba Hill, and surrounding areas."
  },
  {
    category: "Boarding",
    question: "Are boarding facilities available for secondary students?",
    answer: "Yes, we offer modern, secure, and well-managed hostel facilities with 24/7 power backup, supervised prep sessions, and medical staff on duty."
  },
  {
    category: "Academics",
    question: "What curriculum does the school follow?",
    answer: "We offer a rich blended curriculum incorporating the Nigerian National Curriculum, British International standards, and specialized character development modules."
  },
  {
    category: "Exams",
    question: "Which external examinations do students take?",
    answer: "Our secondary students are prepared for BECE (Junior Secondary), WAEC SSCE, NECO SSCE, and optional international assessments such as SAT and IELTS."
  },
  {
    category: "School hours",
    question: "What are the daily school hours?",
    answer: "Classes run Monday through Friday from 7:30 AM to 2:30 PM. Extracurricular clubs and sports operate from 2:30 PM to 4:00 PM on designated days."
  },
  {
    category: "Portal",
    question: "How do parents access student report cards and fee portals?",
    answer: "Parents receive unique login credentials to access the Portal Login system to view termly results, attendance records, and pay school fees online."
  }
];
