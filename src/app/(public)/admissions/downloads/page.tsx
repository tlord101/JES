'use client';

import Link from 'next/link';

export default function DownloadsPage() {
  const handleMockDownload = (docName: string) => {
    alert(`Downloading ${docName}... (Mock download started)`);
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Admissions</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Downloads & Documents</h1>
        </div>

        <div className="space-y-4">
          <div className="p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <i className="bi bi-file-earmark-pdf text-3xl text-red-600"></i>
              <div>
                <h3 className="font-bold text-sm text-[var(--primary-dark)]">2025/2026 School Prospectus</h3>
                <p className="text-xs text-[var(--muted-text)]">PDF Document • 2.4 MB</p>
              </div>
            </div>
            <button
              onClick={() => handleMockDownload('2025/2026 School Prospectus')}
              className="px-3 py-1.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1 shrink-0"
            >
              <i className="bi bi-download"></i> Download
            </button>
          </div>

          <div className="p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <i className="bi bi-file-earmark-pdf text-3xl text-red-600"></i>
              <div>
                <h3 className="font-bold text-sm text-[var(--primary-dark)]">Printable Admission Application Form</h3>
                <p className="text-xs text-[var(--muted-text)]">PDF Document • 1.1 MB</p>
              </div>
            </div>
            <button
              onClick={() => handleMockDownload('Printable Admission Application Form')}
              className="px-3 py-1.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1 shrink-0"
            >
              <i className="bi bi-download"></i> Download
            </button>
          </div>

          <div className="p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <i className="bi bi-file-earmark-pdf text-3xl text-red-600"></i>
              <div>
                <h3 className="font-bold text-sm text-[var(--primary-dark)]">Student Health & Medical Fitness Form</h3>
                <p className="text-xs text-[var(--muted-text)]">PDF Document • 850 KB</p>
              </div>
            </div>
            <button
              onClick={() => handleMockDownload('Student Health & Medical Fitness Form')}
              className="px-3 py-1.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1 shrink-0"
            >
              <i className="bi bi-download"></i> Download
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/admissions" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Admissions
          </Link>
        </div>
      </div>
    </div>
  );
}
