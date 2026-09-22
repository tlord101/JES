import Link from 'next/link';
import { alumniNewsList } from '@/data/alumni';

export default function AlumniNewsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Alumni Network</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Alumni News & Spotlights</h1>
        </div>

        <div className="space-y-6">
          {alumniNewsList.map((item) => (
            <div key={item.id} className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">{item.date}</span>
              <h2 className="text-lg font-bold text-[var(--primary-dark)]">{item.title}</h2>
              <p className="text-xs text-[var(--text)] leading-relaxed">{item.summary}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/alumni" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Alumni Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
