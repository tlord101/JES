import Link from 'next/link';
import Image from 'next/image';
import { eventsList } from '@/data/events';

export default function EventsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Calendar & Activities</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Upcoming Events</h1>
          <p className="text-xs text-[var(--muted-text)] mt-1">
            Stay informed on school orientation sessions, PTA assemblies, sports days, and cultural celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventsList.map((evt) => (
            <div key={evt.slug} className="bg-white border border-[var(--border)] rounded overflow-hidden grid grid-cols-1 sm:grid-cols-3">
              <div className="relative h-48 sm:h-auto w-full sm:col-span-1">
                <Image src={evt.image} alt={evt.title} fill className="object-cover" />
              </div>
              <div className="p-5 sm:col-span-2 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded">
                      {evt.category}
                    </span>
                    <span className="font-bold text-amber-600">{evt.date}</span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--primary-dark)] leading-snug">
                    <Link href={`/events/${evt.slug}`} className="hover:text-[var(--primary)]">
                      {evt.title}
                    </Link>
                  </h3>
                  <div className="text-xs text-[var(--muted-text)] space-y-1">
                    <div><i className="bi bi-clock mr-1.5 text-[var(--primary)]"></i>{evt.time}</div>
                    <div><i className="bi bi-geo-alt mr-1.5 text-[var(--primary)]"></i>{evt.location}</div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 pt-1">{evt.description}</p>
                </div>

                <div className="pt-3">
                  <Link
                    href={`/events/${evt.slug}`}
                    className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                  >
                    Event Details & Schedule <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/calendar" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-calendar3"></i> View Full Academic Term Calendar
          </Link>
        </div>
      </div>
    </div>
  );
}
