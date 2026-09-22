import Link from 'next/link';
import { listEvents } from '@/lib/data/cms';

export const metadata = {
  title: 'School Events & Calendar | Jasmine Exclusive School',
  description: 'Upcoming events, assemblies, sports festivals, and PTA meetings at Jasmine Exclusive School.',
};

export default async function EventsPage() {
  const now = new Date().toISOString();
  const all = await listEvents({ status: 'published' });
  const upcoming = all.filter((e) => e.startsAt >= now);
  const past = all.filter((e) => e.startsAt < now).reverse();

  function EventRow({ event }: { event: (typeof all)[number] }) {
    const start = new Date(event.startsAt);
    return (
      <Link
        href={`/events/${event.slug}`}
        className="flex gap-4 p-4 bg-white border border-[var(--border)] rounded hover:border-[var(--primary)] transition-colors"
      >
        <div className="w-16 shrink-0 text-center bg-[var(--primary-light)] rounded py-2">
          <div className="text-xl font-extrabold text-[var(--primary-dark)]">
            {start.toLocaleDateString('en-GB', { day: '2-digit' })}
          </div>
          <div className="text-[10px] font-bold uppercase text-[var(--primary)]">
            {start.toLocaleDateString('en-GB', { month: 'short' })}
          </div>
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded">
              {event.category}
            </span>
            {event.isFeatured && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded">Featured</span>
            )}
          </div>
          <h3 className="font-bold text-sm text-[var(--text)]">{event.title}</h3>
          <div className="text-xs text-[var(--muted-text)] flex flex-wrap gap-3">
            <span>
              <i className="bi bi-clock mr-1"></i>
              {start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span><i className="bi bi-geo-alt mr-1"></i>{event.location ?? 'Main Campus'}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="space-y-10 text-[var(--text)]">
      <section className="bg-[var(--primary)] text-white py-12 border-b-4 border-[var(--primary-dark)]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold">School Events</h1>
          <p className="text-sm text-slate-200 max-w-2xl">
            Assemblies, inter-house sports, science fairs, PTA meetings, and everything happening on
            campus this session.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16 space-y-8">
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
            Upcoming Events
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-xs text-[var(--muted-text)]">No upcoming events scheduled at the moment.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

        {past.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
              Past Events
            </h2>
            <div className="space-y-3 opacity-75">
              {past.slice(0, 6).map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
