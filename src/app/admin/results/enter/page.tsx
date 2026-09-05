'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resultsStore, subjectsStore, classesStore, calculateGrade, StudentResult } from '@/lib/academicStore';
import { studentsStore } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function EnterResultsPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('std_01');
  const [subjectId, setSubjectId] = useState('sub_mth');
  const [termName, setTermName] = useState<'First Term' | 'Second Term' | 'Third Term'>('Second Term');
  const [caScore, setCaScore] = useState(25);
  const [examScore, setExamScore] = useState(60);
  const [teacherRemark, setTeacherRemark] = useState('Good academic performance.');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = studentsStore.find((s) => s.id === studentId);
    const subject = subjectsStore.find((sub) => sub.id === subjectId);

    if (!student || !subject) return;

    const total = Number(caScore) + Number(examScore);
    const { grade, remark } = calculateGrade(total);

    const newRes: StudentResult = {
      id: `res_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      admissionNo: student.admissionNo,
      className: student.class,
      sessionId: 'sess_1',
      sessionName: '2024/2025',
      termName,
      subjectId: subject.id,
      subjectName: subject.name,
      caScore: Number(caScore),
      examScore: Number(examScore),
      totalScore: total,
      grade,
      remark,
      status: 'Draft', // Enters into Draft state
      teacherRemark,
      principalRemark: 'Pending review',
    };

    resultsStore.push(newRes);
    logAuditEvent('Result Score Entered', 'System', `Entered Draft result for ${student.name} (${subject.name}: ${total} marks)`);
    setMsg('Score recorded in Draft state successfully!');
    setTimeout(() => {
      router.push('/admin/results');
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/results" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Results Engine
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">Enter Subject Scores (Draft Stage)</h1>
        </div>
      </div>

      {msg && <div className="p-3 bg-green-50 border border-green-200 text-green-800 font-bold rounded">{msg}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <div>
          <label className="block font-semibold mb-1">Select Student *</label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          >
            {studentsStore.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.admissionNo} • {s.class})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Select Subject *</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full p-2 border border-[var(--border)] rounded font-bold"
            >
              {subjectsStore.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Continuous Assessment Score (Max 30) *</label>
            <input
              type="number"
              min={0}
              max={30}
              required
              value={caScore}
              onChange={(e) => setCaScore(Number(e.target.value))}
              className="w-full p-2 border border-[var(--border)] rounded font-mono font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Term Exam Score (Max 70) *</label>
            <input
              type="number"
              min={0}
              max={70}
              required
              value={examScore}
              onChange={(e) => setExamScore(Number(e.target.value))}
              className="w-full p-2 border border-[var(--border)] rounded font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Subject Teacher Remark</label>
          <input
            type="text"
            value={teacherRemark}
            onChange={(e) => setTeacherRemark(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Link href="/admin/results" className="px-4 py-2 border border-[var(--border)] font-bold rounded">
            Cancel
          </Link>
          <button type="submit" className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded">
            Save Draft Entry
          </button>
        </div>
      </form>
    </div>
  );
}
