import Link from 'next/link';
import Image from 'next/image';

export default function PrincipalPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">About JES Leadership</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Principal&apos;s Welcome Address</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="bg-[var(--soft-bg)] p-4 border border-[var(--border)] rounded text-center space-y-3 md:col-span-1">
            <div className="relative h-64 w-full rounded overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                alt="Dr. (Mrs.) E. O. Aigbe - Executive Principal"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="font-bold text-base text-[var(--primary-dark)]">Dr. (Mrs.) E. O. Aigbe</h2>
            <p className="text-xs text-[var(--muted-text)]">Executive Principal</p>
            <p className="text-[11px] text-slate-500 italic">Ph.D. Educational Leadership, M.Ed., B.Ed.</p>
          </div>

          <div className="md:col-span-2 space-y-4 text-sm text-[var(--text)] leading-relaxed">
            <p className="font-semibold text-base text-[var(--primary)]">
              Dear Parents, Guardians, and Esteemed Visitors,
            </p>
            <p>
              It is my distinct privilege and joy to welcome you to Jasmine Exclusive School. Since our founding, we have remained steadfast in our commitment to offer a transformative educational experience rooted in academic excellence, moral integrity, and social grace.
            </p>
            <p>
              At Jasmine Exclusive School, we believe that education is far more than the acquisition of textbook knowledge. It is the intentional cultivation of character, critical thinking, curiosity, and compassion. Our motto, <em>Diligence for Excellence</em>, serves as our daily compass. We encourage our students to take pride in hard work and to pursue mastery in every endeavour.
            </p>
            <p>
              Our dedicated staff of qualified educators work tirelessly to create a safe, nurturing, and intellectually stimulating environment where every child is seen, supported, and challenged to achieve their full potential.
            </p>
            <p>
              Whether you are a prospective parent seeking the best foundation for your child or a member of our alumni community, I invite you to explore our website and visit our campuses in Benin City.
            </p>
            <div className="pt-4 border-t border-slate-200">
              <p className="font-bold text-[var(--primary-dark)]">Dr. (Mrs.) E. O. Aigbe</p>
              <p className="text-xs text-[var(--muted-text)]">Executive Principal, Jasmine Exclusive School</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/about" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to About Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
