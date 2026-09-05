'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockStaffAssignments } from '@/lib/staffData';

export default function StaffGradeAssignmentPage({ params }: { params: { id: string } }) {
  const assignment = mockStaffAssignments.find((a) => a.id === params.id);
  if (!assignment) {
    notFound();
  }

  const [submissions, setSubmissions] = useState(assignment.submissions);
  const [selectedStudentId, setSelectedStudentId] = useState(submissions[0]?.studentId || '');
  const [gradeInput, setGradeInput] = useState(submissions[0]?.grade?.toString() || '');
  const [feedbackInput, setFeedbackInput] = useState(submissions[0]?.feedback || '');
  const [msg, setMsg] = useState('');

  const currentSubmission = submissions.find((s) => s.studentId === selectedStudentId);

  const handleSelectStudent = (stdId: string) => {
    setSelectedStudentId(stdId);
    const sub = submissions.find((s) => s.studentId === stdId);
    setGradeInput(sub?.grade !== undefined ? sub.grade.toString() : '');
    setFeedbackInput(sub?.feedback || '');
    setMsg('');
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSubmission) return;

    try {
      const res = await fetch('/api/staff/assignments/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: assignment.id,
          studentId: currentSubmission.studentId,
          grade: Number(gradeInput),
          feedback: feedbackInput,
        }),
      });

      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) =>
            s.studentId === currentSubmission.studentId
              ? { ...s, grade: Number(gradeInput), feedback: feedbackInput, status: 'graded' }
              : s
          )
        );
        setMsg('Grade and teacher feedback recorded successfully!');
      } else {
        setMsg('Error saving grade.');
      }
    } catch {
      setMsg('Network error.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <Link href="/staff/assignments" className="text-xs text-blue-600 hover:underline">
          &larr; Back to Assignments
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md">
              {assignment.className} • {assignment.subject}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">{assignment.title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Due Date: {assignment.dueDate} • Maximum Grade: {assignment.maxScore} Marks
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List Column */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Student Submissions ({submissions.length})
          </h2>
          <div className="space-y-2">
            {submissions.map((sub) => {
              const isSelected = sub.studentId === selectedStudentId;
              return (
                <button
                  key={sub.studentId}
                  type="button"
                  onClick={() => handleSelectStudent(sub.studentId)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900">{sub.studentName}</div>
                    <div className="text-[10px] text-slate-500">{sub.submittedAt}</div>
                  </div>
                  {sub.status === 'graded' ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      {sub.grade}/{assignment.maxScore}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                      Submitted
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grading Details Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          {currentSubmission ? (
            <>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Grading: {currentSubmission.studentName}</h2>
                <p className="text-xs text-slate-500">Submitted at {currentSubmission.submittedAt}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Submission Content</div>
                {currentSubmission.fileUrl && (
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
                    <i className="bi bi-file-earmark-pdf text-base"></i>
                    <span>Attached Document: {currentSubmission.fileUrl}</span>
                  </div>
                )}
                {currentSubmission.content && (
                  <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
                    {currentSubmission.content}
                  </p>
                )}
              </div>

              {msg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl">
                  {msg}
                </div>
              )}

              <form onSubmit={handleSaveGrade} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Award Score (Out of {assignment.maxScore})
                  </label>
                  <input
                    type="number"
                    max={assignment.maxScore}
                    min={0}
                    required
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full md:w-1/3 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teacher Feedback</label>
                  <textarea
                    rows={3}
                    placeholder="Enter constructive comments for the student..."
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                >
                  Save Score & Feedback
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              No submission selected. Select a student from the left panel to begin grading.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
