export interface AuditLog {
  id: string;
  action: string;
  category: 'User' | 'Student' | 'Parent' | 'Staff' | 'CMS' | 'Finance' | 'Admissions' | 'System';
  details: string;
  userEmail: string;
  userName: string;
  timestamp: string;
  ip?: string;
}

export const auditLogsStore: AuditLog[] = [
  {
    id: 'log_001',
    action: 'System Initialized',
    category: 'System',
    details: 'Jasmine Exclusive School Phase 3 Admin & CMS Engine Started',
    userEmail: 'admin@jasmine.edu.ng',
    userName: 'Super Administrator',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    ip: '127.0.0.1',
  },
  {
    id: 'log_002',
    action: 'User Created',
    category: 'User',
    details: 'Created staff account for Mrs. Beatrice Osagie (Teacher)',
    userEmail: 'admin@jasmine.edu.ng',
    userName: 'Super Administrator',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    ip: '197.210.12.44',
  },
  {
    id: 'log_003',
    action: 'News Published',
    category: 'CMS',
    details: 'Published news article "Jasmine Exclusive School Wins 2024 STEM Championship"',
    userEmail: 'principal@jasmine.edu.ng',
    userName: 'Dr. (Mrs.) E. A. Jasmine',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    ip: '197.210.14.88',
  },
  {
    id: 'log_004',
    action: 'Fee Recorded',
    category: 'Finance',
    details: 'Recorded Term 2 fee payment for student JES/2022/084 (David Okafor)',
    userEmail: 'accountant@jasmine.edu.ng',
    userName: 'Bursary Department',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    ip: '197.210.10.15',
  },
];

export function logAuditEvent(
  action: string,
  category: AuditLog['category'],
  details: string,
  userEmail = 'admin@jasmine.edu.ng',
  userName = 'Administrator',
  ip = '127.0.0.1'
) {
  const newLog: AuditLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    action,
    category,
    details,
    userEmail,
    userName,
    timestamp: new Date().toISOString(),
    ip,
  };
  auditLogsStore.unshift(newLog);
  return newLog;
}
