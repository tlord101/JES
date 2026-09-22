import Link from 'next/link';
import Image from 'next/image';
import { staffMembers } from '@/data/staff';

export default function StaffDirectoryPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Our Faculty & Team</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Staff Directory</h1>
          <p className="text-xs text-[var(--muted-text)] mt-1">
            Meet the qualified, dedicated educators and leadership driving academic excellence at Jasmine Exclusive School.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {staffMembers.map((staff) => (
            <div key={staff.slug} className="bg-white border border-[var(--border)] rounded overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-56 w-full">
                  <Image src={staff.photo} alt={staff.name} fill className="object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded">
                    {staff.department}
                  </span>
                  <h3 className="font-bold text-base text-[var(--primary-dark)] leading-tight">{staff.name}</h3>
                  <p className="text-xs font-semibold text-[var(--muted-text)]">{staff.position}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">{staff.biography}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                <Link
                  href={`/staff/${staff.slug}`}
                  className="w-full py-2 bg-[var(--soft-bg)] border border-[var(--border)] text-[var(--primary-dark)] text-xs font-bold rounded hover:bg-[var(--primary)] hover:text-white transition-colors block text-center"
                >
                  View Profile & Credentials
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
