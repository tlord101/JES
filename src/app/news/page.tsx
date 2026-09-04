'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { newsArticles } from '@/data/news';

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Announcements', 'Sports', 'Academics', 'STEM'];

  const filteredNews = newsArticles.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = newsArticles.find((a) => a.featured) || newsArticles[0];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-10">

        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Newsroom & Updates</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">School News</h1>
        </div>

        {/* Featured Article */}
        {featured && (
          <div className="bg-[var(--soft-bg)] border border-[var(--border)] rounded-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 relative h-64 sm:h-80 w-full">
              <Image src={featured.image} alt={featured.title} fill className="object-cover" />
            </div>
            <div className="lg:col-span-5 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded">Featured</span>
                <span className="text-xs text-[var(--muted-text)]">{featured.date}</span>
              </div>
              <h2 className="text-xl font-bold text-[var(--primary-dark)] leading-tight">
                <Link href={`/news/${featured.slug}`} className="hover:text-[var(--primary)]">
                  {featured.title}
                </Link>
              </h2>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">{featured.summary}</p>
              <div className="pt-2">
                <Link
                  href={`/news/${featured.slug}`}
                  className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors inline-block"
                >
                  Read Full Article
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Search & Category Filter UI */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[var(--soft-bg)] p-4 border border-[var(--border)] rounded">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-white border border-[var(--border)] text-[var(--text)] hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 pl-8 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
            />
            <i className="bi bi-search absolute left-2.5 top-2 text-xs text-slate-400"></i>
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article) => (
            <div key={article.slug} className="bg-white border border-[var(--border)] rounded overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full">
                  <Image src={article.image} alt={article.title} fill className="object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <span className="text-slate-400">{article.date}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[var(--primary-dark)] leading-snug">
                    <Link href={`/news/${article.slug}`} className="hover:text-[var(--primary)]">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-[var(--muted-text)] line-clamp-3 leading-relaxed">{article.summary}</p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href={`/news/${article.slug}`}
                  className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                >
                  Read More <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination UI Mock */}
        <div className="flex justify-center items-center gap-2 pt-6 border-t border-slate-200">
          <button className="px-3 py-1 border border-[var(--border)] text-xs text-[var(--muted-text)] rounded disabled:opacity-50" disabled>
            Previous
          </button>
          <span className="px-3 py-1 bg-[var(--primary)] text-white text-xs font-bold rounded">1</span>
          <button className="px-3 py-1 border border-[var(--border)] text-xs text-[var(--muted-text)] rounded disabled:opacity-50" disabled>
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
