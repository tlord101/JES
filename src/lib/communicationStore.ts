export type NotificationType =
  | 'Announcement'
  | 'Exam'
  | 'Assignment'
  | 'Fee reminder'
  | 'Result'
  | 'Event'
  | 'Admission';

export type TargetAudience =
  | 'All Students'
  | 'All Parents'
  | 'All Teachers'
  | 'All Staff'
  | 'Class Group'
  | 'Individual User';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  targetAudience: TargetAudience;
  targetClassId?: string;
  targetUserId?: string;
  senderName: string;
  senderRole: string;
  sentAt: string;
  readBy: string[]; // user IDs who have read this
}

export interface MessageAttachment {
  name: string;
  size: string;
  url: string;
}

export interface MessageThreadItem {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  recipientName: string;
  recipientRole: string;
  subject: string;
  body: string;
  attachments?: MessageAttachment[];
  sentAt: string;
  isRead: boolean;
}

export type ContactMessageStatus = 'New' | 'Read' | 'Replied' | 'Archived';

export interface ContactSubmission {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  submittedAt: string;
  replyMessage?: string;
  repliedAt?: string;
}

export const notificationsStore: NotificationItem[] = [
  {
    id: 'notif-101',
    title: 'Upcoming 2nd Term Examination Timetable Released',
    message: 'The official second-term examination schedule is now active on student and parent portals. Please review the timetable and preparation guides.',
    type: 'Exam',
    targetAudience: 'All Students',
    senderName: 'Vice Principal Academics',
    senderRole: 'Principal',
    sentAt: '2025-03-20 10:00:00',
    readBy: ['std-101'],
  },
  {
    id: 'notif-102',
    title: '1st Term Balance Payment Reminder',
    message: 'Dear Parents, please ensure all outstanding term balances are cleared via the online payment portal prior to term extension.',
    type: 'Fee reminder',
    targetAudience: 'All Parents',
    senderName: 'Bursary Department',
    senderRole: 'Accountant',
    sentAt: '2025-03-18 14:30:00',
    readBy: ['par-201'],
  },
  {
    id: 'notif-103',
    title: 'PTA General Assembly Meeting Scheduled',
    message: 'The termly Parent-Teacher Association meeting will hold in the main school hall on Saturday, April 5th at 10:00 AM.',
    type: 'Event',
    targetAudience: 'All Parents',
    senderName: 'PTA Executive Council',
    senderRole: 'Admin',
    sentAt: '2025-03-15 09:15:00',
    readBy: [],
  },
];

export const messageThreadsStore: MessageThreadItem[] = [
  {
    id: 'msg-1',
    threadId: 'th-001',
    senderId: 'par-201',
    senderName: 'Chief Emeka Okafor',
    senderRole: 'Parent',
    recipientId: 'stf-301',
    recipientName: 'Mr. John Adebayo',
    recipientRole: 'Teacher',
    subject: 'Inquiry on Mathematics Performance for David',
    body: 'Good day Mr. Adebayo, I noticed David scored 87% in his latest CBT test. I would like to know if there are specific areas in Further Mathematics he needs extra help with.',
    sentAt: '2025-03-24 11:20:00',
    isRead: true,
  },
  {
    id: 'msg-2',
    threadId: 'th-001',
    senderId: 'stf-301',
    senderName: 'Mr. John Adebayo',
    senderRole: 'Teacher',
    recipientId: 'par-201',
    recipientName: 'Chief Emeka Okafor',
    recipientRole: 'Parent',
    subject: 'Re: Inquiry on Mathematics Performance for David',
    body: 'Good day Chief Okafor. David is performing exceptionally well in Quadratic Equations and Geometry. He only needs minor guidance on definite integration formulas.',
    sentAt: '2025-03-24 14:05:00',
    isRead: false,
  },
  {
    id: 'msg-3',
    threadId: 'th-002',
    senderId: 'adm-001',
    senderName: 'Admin Desk',
    senderRole: 'Super Admin',
    recipientId: 'stf-301',
    recipientName: 'Mr. John Adebayo',
    recipientRole: 'Teacher',
    subject: 'Submission of Termly Lesson Notes',
    body: 'Please submit your updated JSS 3 and SS 1 lesson plans before the end of this week for academic audit.',
    attachments: [
      { name: 'Lesson_Plan_Template_2025.pdf', size: '1.2 MB', url: '#' },
    ],
    sentAt: '2025-03-22 08:30:00',
    isRead: true,
  },
];

export const contactSubmissionsStore: ContactSubmission[] = [
  {
    id: 'cnt-001',
    senderName: 'Dr. Samuel Igbinoba',
    senderEmail: 'samuel.igbinoba@gmail.com',
    senderPhone: '+234 803 111 2233',
    subject: 'SS1 Boarding Facilities & Admission Inquiry',
    message: 'Hello Jasmine Exclusive School, I would like to inquire if there are available boarding slots for SS1 entry for the 2025/2026 academic session and the associated fee schedule.',
    status: 'New',
    submittedAt: '2025-03-25 16:45:10',
  },
  {
    id: 'cnt-002',
    senderName: 'Mrs. Patience Eke',
    senderEmail: 'patience.eke@yahoo.com',
    senderPhone: '+234 812 345 6789',
    subject: 'Transfer Requirements from Lagos School',
    message: 'My daughter is currently in JSS 1 in Lagos and we are relocating to Benin City next month. What are the transfer exam requirements?',
    status: 'Replied',
    submittedAt: '2025-03-21 10:12:00',
    replyMessage: 'Dear Mrs. Eke, thank you for reaching out. Transfer students undergo a placement assessment in Mathematics and English. Please visit our admissions portal to complete the transfer form.',
    repliedAt: '2025-03-21 14:00:00',
  },
];
