import Link from 'next/link';
import { clubsList } from '@/data/academic';

export default function ClubsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Co-Curricular Life</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Student Clubs & Societies</h1>
          <p className="text-xs text-[var(--muted-text)] mt-1">
            Developing leadership, practical skills, teamwork, and social grace outside the classroom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clubsList.map((club) => (
            <div key={club.slug} className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <i className={`bi ${club.icon} text-3xl text-[var(--primary)] block mb-1`}></i>
                  <h2 className="font-bold text-lg text-[var(--primary-dark)]">{club.name}</h2>
                  <p className="text-xs text-[var(--muted-text)] italic">&quot;{club.motto}&quot;</p>
                </div>
              </div>

              <p className="text-xs text-[var(--text)] leading-relaxed">{club.description}</p>

              <div className="text-xs text-slate-600 space-y-1 bg-white p-3 border border-slate-200 rounded">
                <div><strong>Meeting Time:</strong> {club.meetingDays}</div>
                <div><strong>Patron:</strong> {club.patron}</div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/academics/clubs/${club.slug}`}
                  className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors inline-flex items-center gap-1.5"
                >
                  View Club Profile <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/academics" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Academics Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
