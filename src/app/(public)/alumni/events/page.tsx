import Link from 'next/link';
import { alumniEventsList } from '@/data/alumni';

export default function AlumniEventsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Alumni Calendar</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Reunions & Networking Events</h1>
        </div>

        <div className="space-y-4">
          {alumniEventsList.map((evt) => (
            <div key={evt.id} className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <h2 className="text-base font-bold text-[var(--primary-dark)]">{evt.title}</h2>
                <span className="text-xs font-bold text-white bg-[var(--primary)] px-3 py-1 rounded">{evt.date}</span>
              </div>
              <div className="text-xs text-[var(--muted-text)]">
                <i className="bi bi-geo-alt mr-2 text-[var(--primary)]"></i><strong>Location:</strong> {evt.location}
              </div>
              <p className="text-xs text-[var(--text)] pt-1 border-t border-slate-200">{evt.description}</p>
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
