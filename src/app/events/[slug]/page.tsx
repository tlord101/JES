import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { eventsList } from '@/data/events';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const evt = eventsList.find((e) => e.slug === slug);

  if (!evt) {
    notFound();
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4 space-y-2">
          <span className="text-[10px] font-bold uppercase bg-[var(--primary-light)] text-[var(--primary)] px-2.5 py-0.5 rounded">
            {evt.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--primary-dark)] leading-tight">{evt.title}</h1>
        </div>

        <div className="relative h-72 md:h-96 w-full rounded overflow-hidden border border-[var(--border)]">
          <Image src={evt.image} alt={evt.title} fill className="object-cover" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--soft-bg)] p-6 border border-[var(--border)] rounded">
          <div>
            <span className="text-xs text-[var(--muted-text)] font-semibold block">Date</span>
            <span className="font-bold text-[var(--primary-dark)] text-sm">{evt.date}</span>
          </div>
          <div>
            <span className="text-xs text-[var(--muted-text)] font-semibold block">Time</span>
            <span className="font-bold text-[var(--primary-dark)] text-sm">{evt.time}</span>
          </div>
          <div>
            <span className="text-xs text-[var(--muted-text)] font-semibold block">Location</span>
            <span className="font-bold text-[var(--primary-dark)] text-sm">{evt.location}</span>
          </div>
        </div>

        <div className="space-y-4 text-sm text-[var(--text)] leading-relaxed">
          <h2 className="font-bold text-base text-[var(--primary-dark)] border-b border-slate-200 pb-1">Event Description</h2>
          <p>{evt.description}</p>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
          <Link href="/events" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to All Events
          </Link>
        </div>
      </div>
    </div>
  );
}
