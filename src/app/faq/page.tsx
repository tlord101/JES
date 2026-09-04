'use client';

import { useState } from 'react';
import Link from 'next/link';
import { faqCategories, faqList } from '@/data/faq';

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['All', ...faqCategories];

  const filteredFaqs = faqList.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">

        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Help & Information</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Frequently Asked Questions</h1>
          <p className="text-xs text-[var(--muted-text)] mt-1">
            Find quick answers regarding admissions, fees, uniforms, transportation, boarding, academics, and portal access.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--soft-bg)] border border-[var(--border)] text-[var(--text)] hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion Component */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border border-[var(--border)] rounded overflow-hidden">
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 text-left font-bold text-sm text-[var(--primary-dark)] bg-[var(--soft-bg)] hover:bg-slate-100 transition-colors flex justify-between items-center gap-4"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[var(--primary)] bg-white px-2 py-0.5 border border-slate-200 rounded">
                      {faq.category}
                    </span>
                    {faq.question}
                  </span>
                  <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} text-xs text-[var(--muted-text)] shrink-0`}></i>
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs text-[var(--text)] leading-relaxed border-t border-[var(--border)]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-[var(--soft-bg)] border border-[var(--border)] rounded text-center space-y-2">
          <h3 className="font-bold text-sm text-[var(--primary-dark)]">Still have questions?</h3>
          <p className="text-xs text-[var(--muted-text)]">Our administrative team is available to assist you directly.</p>
          <div className="pt-2">
            <Link href="/contact" className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded inline-block">
              Contact Admissions Office
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
