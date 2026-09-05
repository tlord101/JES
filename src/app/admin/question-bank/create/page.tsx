'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QuestionType } from '@/lib/cbtStore';

export default function AdminCreateQuestionPage() {
  const [type, setType] = useState<QuestionType>('mcq');
  const [questionText, setQuestionText] = useState('');
  const [optionsStr, setOptionsStr] = useState('Option A, Option B, Option C, Option D');
  const [correctAnswer, setCorrectAnswer] = useState('Option A');
  const [explanation, setExplanation] = useState('');
  const [marks, setMarks] = useState('2');
  const [subject, setSubject] = useState('Mathematics');
  const [classId, setClassId] = useState('ss1-blue');
  const [topic, setTopic] = useState('General');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Link href="/admin/question-bank" className="text-xs text-blue-600 hover:underline">
          &larr; Back to Question Bank
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Create Question Item</h1>
        <p className="text-sm text-slate-500">Supports MCQ, Multi-Select, True/False, Short Answer, Fill-in, Image, and Math types.</p>
      </div>

      {saved ? (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-emerald-800 space-y-3">
          <h2 className="font-bold text-base">Question Added to Bank Successfully!</h2>
          <Link
            href="/admin/question-bank"
            className="inline-block px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl"
          >
            Return to Master Bank
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Question Type</label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
              >
                <option value="mcq">Multiple Choice</option>
                <option value="multi_select">Multiple Select</option>
                <option value="true_false">True / False</option>
                <option value="short_answer">Short Answer</option>
                <option value="fill_in_blank">Fill in the Blank</option>
                <option value="image">Image Question</option>
                <option value="math">Mathematical Expression</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Further Mathematics">Further Mathematics</option>
                <option value="Basic Technology">Basic Technology</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Question Text</label>
            <textarea
              rows={2}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Options (Comma-separated)</label>
            <input
              type="text"
              value={optionsStr}
              onChange={(e) => setOptionsStr(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Correct Answer</label>
              <input
                type="text"
                required
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Marks</label>
              <input
                type="number"
                required
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Explanation</label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Link href="/admin/question-bank" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">
              Cancel
            </Link>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-sm">
              Save Question Item
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
