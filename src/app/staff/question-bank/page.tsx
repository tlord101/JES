'use client';

import React, { useState } from 'react';
import { mockQuestionBank, QuestionBankItem } from '@/lib/staffData';

export default function StaffQuestionBankPage() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>(mockQuestionBank);
  const [filterSubject, setFilterSubject] = useState('All');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [type, setType] = useState<'mcq' | 'multi_select' | 'true_false' | 'short_answer' | 'fill_in_blank' | 'image' | 'math'>('mcq');
  const [questionText, setQuestionText] = useState('');
  const [optionsStr, setOptionsStr] = useState('Option A, Option B, Option C, Option D');
  const [correctAnswer, setCorrectAnswer] = useState('Option A');
  const [explanation, setExplanation] = useState('');
  const [marks, setMarks] = useState('2');
  const [subject, setSubject] = useState('Mathematics');
  const [classId, setClassId] = useState('ss1-blue');
  const [topic, setTopic] = useState('General');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [imageUrl, setImageUrl] = useState('');
  const [mathFormula, setMathFormula] = useState('');

  const [saving, setSaving] = useState(false);

  const filteredQuestions = questions.filter(
    (q) => filterSubject === 'All' || q.subject === filterSubject
  );

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const optionsArray = ['mcq', 'multi_select', 'true_false', 'image'].includes(type)
      ? optionsStr.split(',').map((s) => s.trim())
      : undefined;

    const payload = {
      question: questionText,
      type,
      options: optionsArray,
      correctAnswer,
      explanation,
      marks: Number(marks),
      subject,
      classId,
      topic,
      difficulty,
      imageUrl: type === 'image' ? imageUrl : undefined,
      mathFormula: type === 'math' ? mathFormula : undefined,
    };

    try {
      const res = await fetch('/api/staff/questions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.question) {
        setQuestions([data.question, ...questions]);
        setShowModal(false);
        // Reset form
        setQuestionText('');
        setExplanation('');
      }
    } catch {
      alert('Error creating question');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CBT Question Bank</h1>
          <p className="text-sm text-slate-500">
            Create and manage reusable exam items across Multiple Choice, True/False, Fill-in, Image, and Math types.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
        >
          <i className="bi bi-plus-lg"></i> Add New Question
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span>Filter Subject:</span>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl outline-none"
          >
            <option value="All">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Further Mathematics">Further Mathematics</option>
            <option value="Basic Technology">Basic Technology</option>
          </select>
        </div>
        <span className="text-xs text-slate-500 font-semibold">{filteredQuestions.length} Total Items</span>
      </div>

      {/* Question Items List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase">
                  {q.type.replace('_', ' ')}
                </span>
                <span className="text-xs font-semibold text-slate-600">{q.subject} • {q.topic}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                  {q.marks} Marks
                </span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">
                  {q.difficulty}
                </span>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-900">{q.question}</p>

            {q.mathFormula && (
              <div className="p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl">
                LaTeX Formula: {q.mathFormula}
              </div>
            )}

            {q.imageUrl && (
              <div className="w-48 h-32 rounded-xl overflow-hidden border border-slate-200">
                <img src={q.imageUrl} alt="Question figure" className="w-full h-full object-cover" />
              </div>
            )}

            {q.options && q.options.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border text-center font-medium ${
                      (Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(opt) : q.correctAnswer === opt)
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div>
                <span className="font-bold text-slate-700">Correct Answer:</span>{' '}
                <span className="font-bold text-emerald-700">
                  {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                </span>
              </div>
              {q.explanation && (
                <div>
                  <span className="font-bold text-slate-700">Explanation:</span>{' '}
                  <span className="text-slate-600">{q.explanation}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Question Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Add Question to Bank</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Question Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
                  >
                    <option value="mcq">Multiple Choice (MCQ)</option>
                    <option value="multi_select">Multiple Select</option>
                    <option value="true_false">True / False</option>
                    <option value="short_answer">Short Answer</option>
                    <option value="fill_in_blank">Fill in the Blank</option>
                    <option value="image">Image Based Question</option>
                    <option value="math">Mathematical / Equation</option>
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
                  placeholder="Enter problem statement or question..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
                />
              </div>

              {['mcq', 'multi_select', 'true_false', 'image'].includes(type) && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={optionsStr}
                    onChange={(e) => setOptionsStr(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
                  />
                </div>
              )}

              {type === 'image' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
                  />
                </div>
              )}

              {type === 'math' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LaTeX Mathematical Expression</label>
                  <input
                    type="text"
                    placeholder="\int_{0}^{2} 3x^2 dx"
                    value={mathFormula}
                    onChange={(e) => setMathFormula(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-mono outline-none"
                  />
                </div>
              )}

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
                  placeholder="Step-by-step solution..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
