import Link from 'next/link';
import Image from 'next/image';
import { alumniDirectory } from '@/data/alumni';

export default function AlumniDirectoryPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Global Network</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Alumni Directory</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumniDirectory.map((alum) => (
            <div key={alum.id} className="bg-white border border-[var(--border)] rounded overflow-hidden space-y-3 p-5">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border border-[var(--border)] shrink-0">
                  <Image src={alum.photo} alt={alum.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--primary-dark)]">{alum.name}</h3>
                  <p className="text-xs font-bold text-amber-600">Class of {alum.graduationYear}</p>
                  <p className="text-xs text-[var(--muted-text)]">{alum.profession}</p>
                </div>
              </div>

              <div className="text-xs text-[var(--text)] space-y-1 bg-[var(--soft-bg)] p-3 border border-slate-200 rounded">
                <div><strong>Organization:</strong> {alum.organization}</div>
                <div><strong>Location:</strong> {alum.location}</div>
              </div>

              <p className="text-xs text-[var(--muted-text)] leading-relaxed italic">{alum.bio}</p>
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
