'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminCreateExamPage() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [classId, setClassId] = useState('ss1-blue');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [passMark, setPassMark] = useState('50');
  const [attemptsAllowed, setAttemptsAllowed] = useState('1');
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [randomizeOptions, setRandomizeOptions] = useState(true);
  const [resultVisibility, setResultVisibility] = useState<'immediate' | 'after_deadline' | 'manual'>('immediate');

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Link href="/admin/exams" className="text-xs text-blue-600 hover:underline">
          &larr; Back to Examinations
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Create CBT Examination Paper</h1>
        <p className="text-sm text-slate-500">Configure parameters, randomization rules, and attempt limits.</p>
      </div>

      {saved ? (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-3 text-emerald-800">
          <h2 className="font-bold text-base">CBT Examination Paper Created Successfully!</h2>
          <p className="text-xs">You can now proceed to link question items from the master question bank.</p>
          <Link
            href="/admin/exams/cbt-exam-1/questions"
            className="inline-block px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800"
          >
            Attach Questions &rarr;
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Exam Title</label>
            <input
              type="text"
              required
              placeholder="e.g. SS1 First Term Mathematics Online CBT"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 border rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Further Mathematics">Further Mathematics</option>
                <option value="English Language">English Language</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Class</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
              >
                <option value="ss1-blue">SS 1 Blue</option>
                <option value="jss2-gold">JSS 2 Gold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration (Mins)</label>
              <input
                type="number"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pass Mark (%)</label>
              <input
                type="number"
                required
                value={passMark}
                onChange={(e) => setPassMark(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Attempts Allowed</label>
              <input
                type="number"
                required
                value={attemptsAllowed}
                onChange={(e) => setAttemptsAllowed(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Available From (Start Date)</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Available Until (End Date)</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description & Scope</label>
            <input
              type="text"
              placeholder="Brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Student Instructions</label>
            <textarea
              rows={3}
              placeholder="Clear rules and guidelines..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
            />
          </div>

          <div className="p-4 bg-slate-50 border rounded-xl space-y-2">
            <div className="font-bold text-slate-800">Randomization & Anti-Cheating</div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={randomizeQuestions}
                  onChange={(e) => setRandomizeQuestions(e.target.checked)}
                  className="rounded text-blue-600"
                />
                Randomize Question Order
              </label>
              <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={randomizeOptions}
                  onChange={(e) => setRandomizeOptions(e.target.checked)}
                  className="rounded text-blue-600"
                />
                Randomize Option Order
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Result Visibility</label>
            <select
              value={resultVisibility}
              onChange={(e: any) => setResultVisibility(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
            >
              <option value="immediate">Immediate Score Calculation & Display</option>
              <option value="after_deadline">Show Results Only After Exam End Date</option>
              <option value="manual">Manual Release by Administrator</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Link
              href="/admin/exams"
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm"
            >
              Save Exam Configuration
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
