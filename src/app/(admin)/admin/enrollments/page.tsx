'use client';

import { useState } from 'react';
import { enrollmentsStore, classesStore, sessionsStore, termsStore, StudentEnrollment } from '@/lib/academicStore';
import { studentsStore } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([...enrollmentsStore]);
  const [showModal, setShowModal] = useState(false);

  const [studentId, setStudentId] = useState('std_01');
  const [classId, setClassId] = useState('cls_ss1b');
  const [termName, setTermName] = useState<'First Term' | 'Second Term' | 'Third Term'>('Second Term');

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    const student = studentsStore.find((s) => s.id === studentId);
    const cls = classesStore.find((c) => c.id === classId);
    const session = sessionsStore.find((s) => s.isCurrent) || sessionsStore[0];

    if (!student || !cls) return;

    const newEnr: StudentEnrollment = {
      id: `enr_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      admissionNo: student.admissionNo,
      sessionId: session.id,
      sessionName: session.sessionName,
      termName,
      classId: cls.id,
      className: cls.name,
      subjectIds: cls.subjectIds,
      enrolledDate: new Date().toISOString().substring(0, 10),
    };

    enrollmentsStore.push(newEnr);
    setEnrollments([...enrollmentsStore]);
    logAuditEvent('Student Enrolled', 'System', `Enrolled ${student.name} (${student.admissionNo}) into ${cls.name} for ${session.sessionName} ${termName}`);

    setShowModal(false);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Student Term Enrollment Ledger</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Enroll students into specific Academic Sessions, Terms, Class arms, and assigned Subject selections.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-journal-check"></i>
          <span>New Term Enrollment</span>
        </button>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Admission No</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Class Arm</th>
              <th className="p-3">Academic Session</th>
              <th className="p-3">Term</th>
              <th className="p-3">Enrolled Subjects</th>
              <th className="p-3 font-mono">Date Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {enrollments.map((enr) => (
              <tr key={enr.id} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-mono font-bold text-[var(--primary-dark)]">{enr.admissionNo}</td>
                <td className="p-3 font-bold text-[var(--text)]">{enr.studentName}</td>
                <td className="p-3 font-semibold">{enr.className}</td>
                <td className="p-3 text-[var(--muted-text)]">{enr.sessionName}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded">
                    {enr.termName}
                  </span>
                </td>
                <td className="p-3 font-bold text-[var(--primary)]">{enr.subjectIds.length} Subjects Selected</td>
                <td className="p-3 font-mono text-[var(--muted-text)]">{enr.enrolledDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-[var(--border)] rounded max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Enroll Student into Term</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleEnroll} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Student *</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-bold"
                >
                  {studentsStore.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.admissionNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Select Class Placement *</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-bold"
                >
                  {classesStore.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Academic Term *</label>
                <select
                  value={termName}
                  onChange={(e) => setTermName(e.target.value as any)}
                  className="w-full p-2 border border-[var(--border)] rounded font-bold"
                >
                  <option value="First Term">First Term</option>
                  <option value="Second Term">Second Term</option>
                  <option value="Third Term">Third Term</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[var(--border)] font-bold rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
