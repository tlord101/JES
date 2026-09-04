import Link from 'next/link';
import { clubsList } from '@/data/academic';

export default function ChessClubPage() {
  const club = clubsList.find((c) => c.slug === 'chess')!;

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Club Profile</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">{club.name}</h1>
          <p className="text-sm text-[var(--muted-text)] italic mt-1">&quot;{club.motto}&quot;</p>
        </div>

        <div className="space-y-6 text-sm text-[var(--text)] leading-relaxed">
          <p>{club.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--soft-bg)] p-5 border border-[var(--border)] rounded">
            <div>
              <span className="text-xs text-[var(--muted-text)] font-semibold block">Meeting Schedule</span>
              <span className="font-bold text-[var(--primary-dark)] text-sm">{club.meetingDays}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--muted-text)] font-semibold block">Club Patron</span>
              <span className="font-bold text-[var(--primary-dark)] text-sm">{club.patron}</span>
            </div>
          </div>

          <div className="space-y-3 bg-white p-6 border border-[var(--border)] rounded">
            <h3 className="font-bold text-base text-[var(--primary-dark)]">Key Activities & Training</h3>
            <ul className="space-y-2 text-xs text-[var(--text)]">
              {club.activities.map((act, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-[var(--success)]"></i>
                  {act}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/academics/clubs" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Clubs Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
