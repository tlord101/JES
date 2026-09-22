import Link from 'next/link';
import { subjectsList } from '@/data/academic';

export default function SubjectsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Academics</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Subjects Offered</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjectsList.map((subject) => (
            <div key={subject.code} className="p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[var(--primary)] uppercase bg-white px-2 py-0.5 border border-slate-200 rounded">
                  {subject.code}
                </span>
                <span className="text-xs text-[var(--muted-text)] font-semibold">{subject.department}</span>
              </div>
              <h3 className="font-bold text-base text-[var(--primary-dark)]">{subject.name}</h3>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">{subject.description}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/academics" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Academics
          </Link>
        </div>
      </div>
    </div>
  );
}
