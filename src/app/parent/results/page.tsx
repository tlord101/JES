'use client';

import Link from 'next/link';
import { defaultParentChildResults, defaultWards } from '@/lib/parentData';

export default function ParentResultsOverviewPage() {
  // CRITICAL SECURITY RULE: Show published results only!
  const publishedResults = defaultParentChildResults.filter((r) => r.status === 'Published');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            Academic Transcripts
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            Published Report Cards
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Official terminal report cards approved and published by the principal and academic board.
          </p>
        </div>
      </div>

      {publishedResults.length === 0 ? (
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-xs text-[var(--muted-text)]">
          No published report cards currently available for your wards.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedResults.map((res) => {
            const ward = defaultWards.find((w) => w.id === res.wardId);

            return (
              <div
                key={res.id}
                className="bg-white p-6 border border-[var(--border)] rounded space-y-4 hover:border-[var(--primary)] transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] text-[10px] font-bold rounded">
                        {res.sessionName} — {res.termName}
                      </span>
                      <h2 className="text-base font-extrabold text-[var(--primary-dark)] mt-1">{res.wardName}</h2>
                      <p className="text-xs text-[var(--muted-text)] font-semibold">Class: {res.className}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-green-700">{res.averageScore}%</div>
                      <div className="text-[10px] font-bold text-[var(--muted-text)]">
                        Rank: {res.positionInClass}nd / {res.totalStudents}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded text-xs space-y-1">
                    <span className="font-bold text-[var(--primary-dark)] block text-[11px]">Teacher Remark:</span>
                    <p className="italic text-[var(--muted-text)]">"{res.teacherRemark}"</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex justify-end">
                  <Link
                    href={`/parent/results/${res.wardId}`}
                    className="px-4 py-2 bg-[var(--primary)] text-white font-bold text-xs rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
                  >
                    <span>View Full Broadsheet</span>
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
