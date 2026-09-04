'use client';

import { useState } from 'react';
import { faqsCMSStore, FAQItem } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([...faqsCMSStore]);
  const [showModal, setShowModal] = useState(false);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Admissions');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    const newFaq: FAQItem = {
      id: `faq_${Date.now()}`,
      category,
      question,
      answer,
    };

    faqsCMSStore.push(newFaq);
    setFaqs([...faqsCMSStore]);
    logAuditEvent('FAQ Item Created', 'CMS', `Added FAQ question under category ${category}`);

    setQuestion('');
    setAnswer('');
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const idx = faqsCMSStore.findIndex((f) => f.id === id);
    if (idx !== -1) {
      faqsCMSStore.splice(idx, 1);
      setFaqs([...faqsCMSStore]);
      logAuditEvent('FAQ Item Deleted', 'CMS', 'Deleted FAQ item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Frequently Asked Questions (FAQ) CMS</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage public inquiry questions and answers across Admissions, Fees, Academics, and Portal Access.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-patch-question-fill"></i>
          <span>Add FAQ Item</span>
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className="bg-white p-5 border border-[var(--border)] rounded space-y-2 text-xs">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded">
                {f.category}
              </span>
              <button
                onClick={() => handleDelete(f.id)}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                Delete
              </button>
            </div>
            <h3 className="font-bold text-sm text-[var(--primary-dark)]">{f.question}</h3>
            <p className="text-slate-600 leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-[var(--border)] rounded max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Add FAQ Entry</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-bold"
                >
                  <option value="Admissions">Admissions</option>
                  <option value="Fees">Fees</option>
                  <option value="Uniform">Uniform</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Boarding">Boarding</option>
                  <option value="Academics">Academics</option>
                  <option value="Exams">Exams</option>
                  <option value="Portal">Portal</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How do parents access term report cards?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                ></textarea>
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
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
