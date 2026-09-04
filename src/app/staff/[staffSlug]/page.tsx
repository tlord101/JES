import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { staffMembers } from '@/data/staff';

export default async function StaffProfilePage({
  params,
}: {
  params: Promise<{ staffSlug: string }>;
}) {
  const { staffSlug } = await params;
  const staff = staffMembers.find((s) => s.slug === staffSlug);

  if (!staff) {
    notFound();
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Faculty Profile</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">{staff.name}</h1>
          <p className="text-xs text-[var(--muted-text)] font-semibold mt-1">{staff.position} • {staff.department}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[var(--soft-bg)] p-4 border border-[var(--border)] rounded text-center space-y-3 md:col-span-1">
            <div className="relative h-64 w-full rounded overflow-hidden">
              <Image src={staff.photo} alt={staff.name} fill className="object-cover" />
            </div>
            <div className="text-xs text-left space-y-2 pt-2 border-t border-slate-200">
              <div><strong>Qualification:</strong> <span className="text-[var(--muted-text)]">{staff.qualification}</span></div>
              <div><strong>Email:</strong> <span className="text-[var(--primary)]">{staff.email}</span></div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6 text-sm text-[var(--text)] leading-relaxed">
            <div className="space-y-2">
              <h2 className="font-bold text-base text-[var(--primary-dark)] border-b border-slate-200 pb-1">Biography</h2>
              <p>{staff.biography}</p>
            </div>

            <div className="space-y-2">
              <h2 className="font-bold text-base text-[var(--primary-dark)] border-b border-slate-200 pb-1">Subjects & Leadership Roles</h2>
              <div className="flex flex-wrap gap-2">
                {staff.subjects.map((subj, idx) => (
                  <span key={idx} className="text-xs bg-[var(--soft-bg)] border border-[var(--border)] px-3 py-1 rounded font-medium text-[var(--text)]">
                    {subj}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/staff" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Staff Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
